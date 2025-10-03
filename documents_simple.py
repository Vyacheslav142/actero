from flask import Blueprint, request, jsonify, make_response
from flask_cors import cross_origin
import io
from datetime import datetime

documents_bp = Blueprint('documents', __name__)

def create_simple_pdf_content(data):
    """Создание простого PDF контента в виде HTML для демонстрации"""
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
    
    # Создание HTML контента
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>{title}</title>
        <style>
            body {{ font-family: Arial, sans-serif; margin: 20px; }}
            h1 {{ text-align: center; }}
            table {{ width: 100%; border-collapse: collapse; margin: 20px 0; }}
            th, td {{ border: 1px solid #ddd; padding: 8px; text-align: left; }}
            th {{ background-color: #f2f2f2; }}
        </style>
    </head>
    <body>
        <h1>{title}</h1>
        {company_info}
        <p>Дата: {datetime.now().strftime('%d.%m.%Y')}</p>
        
        <h3>Товары и услуги:</h3>
        <table>
            <tr>
                <th>№</th>
                <th>Наименование</th>
                <th>Количество</th>
                <th>Цена</th>
                <th>Сумма</th>
            </tr>
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
            <tr>
                <td colspan="4"><strong>ИТОГО:</strong></td>
                <td><strong>{total:.2f} {form_data.get('currency', 'RUB')}</strong></td>
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
    """API endpoint для генерации документов"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Нет данных для генерации'}), 400
        
        # Создаем HTML версию документа
        html_content = create_simple_pdf_content(data)
        
        # Возвращаем HTML как "PDF" для демонстрации
        response = make_response(html_content)
        response.headers['Content-Type'] = 'text/html; charset=utf-8'
        response.headers['Content-Disposition'] = f'attachment; filename="document_{data.get("type", "unknown")}_{datetime.now().strftime("%Y%m%d_%H%M%S")}.html"'
        
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
        
        return jsonify({
            'success': True,
            'message': 'Предварительный просмотр готов',
            'type': data.get('type'),
            'items_count': len(data.get('items', [])),
            'total': data.get('total', 0)
        })
        
    except Exception as e:
        return jsonify({'error': f'Ошибка предварительного просмотра: {str(e)}'}), 500

