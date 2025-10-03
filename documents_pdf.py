from flask import Blueprint, request, jsonify, make_response
from flask_cors import cross_origin
import io
from datetime import datetime
import os

documents_bp = Blueprint('documents', __name__)

def create_pdf_content_with_watermark(data):
    """Создание PDF контента с водяным знаком используя WeasyPrint"""
    try:
        from weasyprint import HTML, CSS
        from weasyprint.text.fonts import FontConfiguration
    except ImportError:
        # Fallback к HTML если WeasyPrint недоступен
        return create_html_content(data)
    
    document_type = data.get('type')
    form_data = data.get('formData', {})
    items = data.get('items', [])
    
    if document_type == 'pricelist':
        title = "ПРАЙС-ЛИСТ"
        company_info = f"<h2>{form_data.get('companyName', 'Компания')}</h2>"
    elif document_type == 'invoice':
        title = f"СЧЕТ НА ОПЛАТУ № {form_data.get('invoiceNumber', '001')}"
        company_info = f"<h2>{form_data.get('companyName', 'Компания')}</h2>"
    elif document_type == 'contract':
        title = f"ДОГОВОР № {form_data.get('contractNumber', '001')}"
        company_info = f"<h2>{form_data.get('companyName', 'Компания')}</h2>"
    else:
        title = "ДОКУМЕНТ"
        company_info = "<h2>Компания</h2>"
    
    # CSS стили с водяным знаком
    css_content = """
    @page {
        size: A4;
        margin: 2cm;
        @bottom-left {
            content: "Создано с помощью DocuFlow";
            font-size: 8pt;
            color: #888;
        }
    }
    
    body {
        font-family: 'DejaVu Sans', Arial, sans-serif;
        margin: 0;
        padding: 20px;
        position: relative;
    }
    
    .watermark {
        position: fixed;
        bottom: 20px;
        left: 20px;
        font-size: 10px;
        color: #ccc;
        z-index: 1000;
        background: rgba(255, 255, 255, 0.8);
        padding: 5px 10px;
        border-radius: 3px;
        border: 1px solid #eee;
    }
    
    h1 {
        text-align: center;
        color: #333;
        margin-bottom: 30px;
    }
    
    h2 {
        color: #555;
        margin-bottom: 20px;
    }
    
    table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
    }
    
    th, td {
        border: 1px solid #ddd;
        padding: 12px 8px;
        text-align: left;
    }
    
    th {
        background-color: #f8f9fa;
        font-weight: bold;
    }
    
    .total-row {
        background-color: #f0f8ff;
        font-weight: bold;
    }
    
    .company-info {
        margin-bottom: 30px;
        padding: 15px;
        background-color: #f9f9f9;
        border-radius: 5px;
    }
    
    .document-footer {
        margin-top: 40px;
        text-align: center;
        font-size: 12px;
        color: #666;
    }
    """
    
    # HTML контент
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>{title}</title>
    </head>
    <body>
        <div class="watermark">🔒 DocuFlow Free</div>
        
        <h1>{title}</h1>
        
        <div class="company-info">
            {company_info}
            <p><strong>Дата:</strong> {datetime.now().strftime('%d.%m.%Y')}</p>
            {f'<p><strong>Телефон:</strong> {form_data.get("phone", "")}</p>' if form_data.get("phone") else ''}
            {f'<p><strong>Email:</strong> {form_data.get("email", "")}</p>' if form_data.get("email") else ''}
            {f'<p><strong>Адрес:</strong> {form_data.get("address", "")}</p>' if form_data.get("address") else ''}
        </div>
        
        <h3>Товары и услуги:</h3>
        <table>
            <thead>
                <tr>
                    <th style="width: 5%;">№</th>
                    <th style="width: 40%;">Наименование</th>
                    <th style="width: 15%;">Количество</th>
                    <th style="width: 20%;">Цена за единицу</th>
                    <th style="width: 20%;">Сумма</th>
                </tr>
            </thead>
            <tbody>
    """
    
    total = 0
    for i, item in enumerate(items, 1):
        item_total = item.get('quantity', 1) * item.get('price', 0)
        total += item_total
        html_content += f"""
                <tr>
                    <td>{i}</td>
                    <td>{item.get('name', '')}</td>
                    <td>{item.get('quantity', 1)}</td>
                    <td>{item.get('price', 0):.2f}</td>
                    <td>{item_total:.2f}</td>
                </tr>
        """
    
    html_content += f"""
            </tbody>
            <tfoot>
                <tr class="total-row">
                    <td colspan="4"><strong>ИТОГО:</strong></td>
                    <td><strong>{total:.2f} {form_data.get('currency', 'RUB')}</strong></td>
                </tr>
            </tfoot>
        </table>
        
        <div class="document-footer">
            <p>Документ создан с помощью DocuFlow - {datetime.now().strftime('%d.%m.%Y %H:%M')}</p>
            <p>Для снятия водяного знака и получения дополнительных функций - обновите тарифный план</p>
        </div>
    </body>
    </html>
    """
    
    try:
        # Попытка создать PDF с помощью WeasyPrint
        font_config = FontConfiguration()
        html_doc = HTML(string=html_content)
        css_doc = CSS(string=css_content, font_config=font_config)
        
        pdf_bytes = html_doc.write_pdf(stylesheets=[css_doc], font_config=font_config)
        return pdf_bytes, 'application/pdf'
        
    except Exception as e:
        print(f"WeasyPrint error: {e}")
        # Fallback к HTML
        return html_content, 'text/html'

def create_html_content(data):
    """Fallback функция для создания HTML контента"""
    document_type = data.get('type')
    form_data = data.get('formData', {})
    items = data.get('items', [])
    
    if document_type == 'pricelist':
        title = "ПРАЙС-ЛИСТ"
    elif document_type == 'invoice':
        title = f"СЧЕТ НА ОПЛАТУ № {form_data.get('invoiceNumber', '001')}"
    elif document_type == 'contract':
        title = f"ДОГОВОР № {form_data.get('contractNumber', '001')}"
    else:
        title = "ДОКУМЕНТ"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>{title}</title>
        <style>
            body {{ font-family: Arial, sans-serif; margin: 20px; position: relative; }}
            .watermark {{ position: fixed; bottom: 20px; left: 20px; font-size: 12px; color: #ccc; background: rgba(255,255,255,0.8); padding: 5px; border: 1px solid #eee; }}
            h1 {{ text-align: center; }}
            table {{ width: 100%; border-collapse: collapse; margin: 20px 0; }}
            th, td {{ border: 1px solid #ddd; padding: 8px; text-align: left; }}
            th {{ background-color: #f2f2f2; }}
        </style>
    </head>
    <body>
        <div class="watermark">🔒 DocuFlow Free</div>
        <h1>{title}</h1>
        <h2>{form_data.get('companyName', 'Компания')}</h2>
        <p>Дата: {datetime.now().strftime('%d.%m.%Y')}</p>
        
        <h3>Товары и услуги:</h3>
        <table>
            <tr><th>№</th><th>Наименование</th><th>Количество</th><th>Цена</th><th>Сумма</th></tr>
    """
    
    total = 0
    for i, item in enumerate(items, 1):
        item_total = item.get('quantity', 1) * item.get('price', 0)
        total += item_total
        html_content += f"""
            <tr>
                <td>{i}</td>
                <td>{item.get('name', '')}</td>
                <td>{item.get('quantity', 1)}</td>
                <td>{item.get('price', 0):.2f}</td>
                <td>{item_total:.2f}</td>
            </tr>
        """
    
    html_content += f"""
            <tr style="font-weight: bold;">
                <td colspan="4">ИТОГО:</td>
                <td>{total:.2f} {form_data.get('currency', 'RUB')}</td>
            </tr>
        </table>
        <p><em>Документ создан с помощью DocuFlow - {datetime.now().strftime('%d.%m.%Y %H:%M')}</em></p>
    </body>
    </html>
    """
    
    return html_content

@documents_bp.route('/generate', methods=['POST'])
@cross_origin()
def generate_document():
    """API endpoint для генерации PDF документов с водяным знаком"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Нет данных для генерации'}), 400
        
        # Создаем PDF или HTML контент
        content, content_type = create_pdf_content_with_watermark(data)
        
        # Определяем расширение файла
        file_extension = 'pdf' if content_type == 'application/pdf' else 'html'
        filename = f"document_{data.get('type', 'unknown')}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.{file_extension}"
        
        response = make_response(content)
        response.headers['Content-Type'] = content_type
        response.headers['Content-Disposition'] = f'attachment; filename="{filename}"'
        
        return response
        
    except Exception as e:
        return jsonify({'error': f'Ошибка генерации документа: {str(e)}'}), 500

@documents_bp.route('/preview', methods=['POST', 'GET'])
@cross_origin()
def preview_document():
    """API endpoint для предварительного просмотра документа"""
    try:
        if request.method == 'GET':
            return jsonify({'message': 'Preview endpoint is working', 'method': 'GET'})
            
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Нет данных для предварительного просмотра'}), 400
        
        # Создаем HTML превью
        html_content = create_html_content(data)
        
        return jsonify({
            'success': True,
            'message': 'Предварительный просмотр готов',
            'type': data.get('type'),
            'items_count': len(data.get('items', [])),
            'total': data.get('total', 0),
            'preview_html': html_content
        })
        
    except Exception as e:
        return jsonify({'error': f'Ошибка предварительного просмотра: {str(e)}'}), 500

