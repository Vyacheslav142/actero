from flask import Blueprint, request, jsonify, send_file
from flask_cors import cross_origin
import io
import os
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

documents_bp = Blueprint('documents', __name__)

# Регистрация шрифта для поддержки кириллицы
try:
    # Попробуем использовать системный шрифт для Linux
    pdfmetrics.registerFont(TTFont('DejaVuSans', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'))
    pdfmetrics.registerFont(TTFont('DejaVuSans-Bold', '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'))
except:
    try:
        # Попробуем использовать системный шрифт для Windows
        import os
        windows_fonts = [
            'C:/Windows/Fonts/arial.ttf',
            'C:/Windows/Fonts/calibri.ttf',
            'C:/Windows/Fonts/tahoma.ttf'
        ]
        for font_path in windows_fonts:
            if os.path.exists(font_path):
                pdfmetrics.registerFont(TTFont('Arial', font_path))
                pdfmetrics.registerFont(TTFont('Arial-Bold', font_path))
                break
    except:
        # Если системные шрифты недоступны, используем встроенные
        pass

def create_styles():
    """Создание профессиональных стилей для документа"""
    styles = getSampleStyleSheet()
    
    # Определяем доступные шрифты
    available_fonts = pdfmetrics.getRegisteredFontNames()
    
    # Выбираем лучший шрифт для кириллицы
    if 'Arial' in available_fonts:
        font_name = 'Arial'
        bold_font_name = 'Arial-Bold'
    elif 'DejaVuSans' in available_fonts:
        font_name = 'DejaVuSans'
        bold_font_name = 'DejaVuSans-Bold'
    else:
        # Fallback на стандартные шрифты
        font_name = 'Helvetica'
        bold_font_name = 'Helvetica-Bold'
    
    # Стиль для заголовка документа
    title_style = ParagraphStyle(
        'DocumentTitle',
        parent=styles['Heading1'],
        fontSize=24,
        spaceAfter=40,
        alignment=1,  # Центрирование
        fontName=bold_font_name,
        textColor=colors.HexColor('#2c3e50')
    )
    
    # Стиль для названия компании
    company_style = ParagraphStyle(
        'CompanyName',
        parent=styles['Heading2'],
        fontSize=16,
        spaceAfter=15,
        alignment=1,
        fontName=bold_font_name,
        textColor=colors.HexColor('#34495e')
    )
    
    # Стиль для обычного текста
    normal_style = ParagraphStyle(
        'NormalText',
        parent=styles['Normal'],
        fontSize=11,
        fontName=font_name,
        textColor=colors.HexColor('#2c3e50'),
        leading=14
    )
    
    # Стиль для подзаголовков
    heading_style = ParagraphStyle(
        'SectionHeading',
        parent=styles['Heading2'],
        fontSize=13,
        spaceAfter=15,
        spaceBefore=20,
        fontName=bold_font_name,
        textColor=colors.HexColor('#34495e')
    )
    
    # Стиль для контактной информации
    contact_style = ParagraphStyle(
        'ContactInfo',
        parent=styles['Normal'],
        fontSize=10,
        fontName=font_name,
        textColor=colors.HexColor('#7f8c8d'),
        alignment=1,
        leading=12
    )
    
    # Стиль для даты
    date_style = ParagraphStyle(
        'DateStyle',
        parent=styles['Normal'],
        fontSize=10,
        fontName=font_name,
        textColor=colors.HexColor('#7f8c8d'),
        alignment=2,  # По правому краю
        leading=12
    )
    
    return {
        'title': title_style,
        'company': company_style,
        'normal': normal_style,
        'heading': heading_style,
        'contact': contact_style,
        'date': date_style
    }

def generate_pricelist_pdf(data):
    """Генерация профессионального прайс-листа"""
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, 
                          rightMargin=72, leftMargin=72, 
                          topMargin=72, bottomMargin=18)
    story = []
    styles = create_styles()
    
    # Заголовок документа
    title = Paragraph("ПРАЙС-ЛИСТ", styles['title'])
    story.append(title)
    story.append(Spacer(1, 30))
    
    # Информация о компании
    if data['formData']['companyName']:
        company_info = Paragraph(data['formData']['companyName'], styles['company'])
        story.append(company_info)
        story.append(Spacer(1, 20))
    
    # Контактная информация в центре
    contact_info = []
    if data['formData']['phone']:
        contact_info.append(f"📞 {data['formData']['phone']}")
    if data['formData']['email']:
        contact_info.append(f"✉ {data['formData']['email']}")
    if data['formData']['address']:
        contact_info.append(f"📍 {data['formData']['address']}")
    
    if contact_info:
        contact_text = Paragraph("<br/>".join(contact_info), styles['contact'])
        story.append(contact_text)
        story.append(Spacer(1, 30))
    
    # Дата создания справа
    date_text = Paragraph(f"Дата составления: {datetime.now().strftime('%d.%m.%Y')}", styles['date'])
    story.append(date_text)
    story.append(Spacer(1, 30))
    
    # Таблица товаров
    if data['items']:
        # Заголовок таблицы
        table_header = Paragraph("ТОВАРЫ И УСЛУГИ", styles['heading'])
        story.append(table_header)
        story.append(Spacer(1, 15))
        
        table_data = [['№', 'Наименование', 'Описание', 'Ед.изм.', 'Цена', 'Категория']]
        
        for i, item in enumerate(data['items'], 1):
            table_data.append([
                str(i),
                item['name'] or '',
                item['description'] or '',
                item['unit'] or '',
                f"{item['price']:.2f} {data['formData']['currency']}",
                item['category'] or ''
            ])
        
        table = Table(table_data, colWidths=[0.5*inch, 2*inch, 2*inch, 0.8*inch, 1*inch, 1.2*inch])
        # Определяем шрифты для таблицы
        available_fonts = pdfmetrics.getRegisteredFontNames()
        if 'Arial' in available_fonts:
            table_font = 'Arial'
            table_bold_font = 'Arial-Bold'
        elif 'DejaVuSans' in available_fonts:
            table_font = 'DejaVuSans'
            table_bold_font = 'DejaVuSans-Bold'
        else:
            table_font = 'Helvetica'
            table_bold_font = 'Helvetica-Bold'
        
        # Профессиональные стили таблицы
        table.setStyle(TableStyle([
            # Заголовок таблицы
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#34495e')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), table_bold_font),
            ('FONTSIZE', (0, 0), (-1, 0), 11),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('TOPPADDING', (0, 0), (-1, 0), 12),
            
            # Строки данных
            ('BACKGROUND', (0, 1), (-1, -1), colors.white),
            ('TEXTCOLOR', (0, 1), (-1, -1), colors.HexColor('#2c3e50')),
            ('ALIGN', (0, 1), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 1), (-1, -1), table_font),
            ('FONTSIZE', (0, 1), (-1, -1), 10),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f8f9fa')]),
            ('TOPPADDING', (0, 1), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 1), (-1, -1), 8),
            
            # Границы
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#dee2e6')),
            ('LINEBELOW', (0, 0), (-1, 0), 2, colors.HexColor('#34495e')),
        ]))
        
        story.append(table)
        story.append(Spacer(1, 30))
    
    doc.build(story)
    buffer.seek(0)
    return buffer

def generate_invoice_pdf(data):
    """Генерация профессионального счета на оплату"""
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, 
                          rightMargin=72, leftMargin=72, 
                          topMargin=72, bottomMargin=18)
    story = []
    styles = create_styles()
    
    # Заголовок документа
    title = Paragraph(f"СЧЕТ НА ОПЛАТУ № {data['formData']['invoiceNumber']}", styles['title'])
    story.append(title)
    story.append(Spacer(1, 30))
    
    # Даты
    date_info = f"от {data['formData']['invoiceDate']}"
    if data['formData']['paymentDue']:
        date_info += f", к оплате до {data['formData']['paymentDue']}"
    date_text = Paragraph(date_info, styles['date'])
    story.append(date_text)
    story.append(Spacer(1, 30))
    
    # Поставщик
    supplier_heading = Paragraph("ПОСТАВЩИК:", styles['heading'])
    story.append(supplier_heading)
    
    supplier_info = [data['formData']['companyName']]
    if data['formData']['supplierInn']:
        supplier_info.append(f"ИНН: {data['formData']['supplierInn']}")
    if data['formData']['supplierKpp']:
        supplier_info.append(f"КПП: {data['formData']['supplierKpp']}")
    if data['formData']['address']:
        supplier_info.append(f"Адрес: {data['formData']['address']}")
    
    supplier_text = Paragraph("<br/>".join(supplier_info), styles['normal'])
    story.append(supplier_text)
    story.append(Spacer(1, 15))
    
    # Покупатель
    customer_heading = Paragraph("ПОКУПАТЕЛЬ:", styles['heading'])
    story.append(customer_heading)
    
    customer_info = [data['formData']['customerName']]
    if data['formData']['customerInn']:
        customer_info.append(f"ИНН: {data['formData']['customerInn']}")
    if data['formData']['customerKpp']:
        customer_info.append(f"КПП: {data['formData']['customerKpp']}")
    if data['formData']['customerAddress']:
        customer_info.append(f"Адрес: {data['formData']['customerAddress']}")
    
    customer_text = Paragraph("<br/>".join(customer_info), styles['normal'])
    story.append(customer_text)
    story.append(Spacer(1, 20))
    
    # Таблица товаров
    if data['items']:
        table_data = [['№', 'Наименование', 'Кол-во', 'Ед.изм.', 'Цена', 'Сумма']]
        total_sum = 0
        
        for i, item in enumerate(data['items'], 1):
            item_sum = item['quantity'] * item['price']
            total_sum += item_sum
            table_data.append([
                str(i),
                item['name'] or '',
                str(item['quantity']),
                item['unit'] or '',
                f"{item['price']:.2f}",
                f"{item_sum:.2f}"
            ])
        
        # Итого
        table_data.append(['', '', '', '', 'ИТОГО:', f"{total_sum:.2f} {data['formData']['currency']}"])
        
        table = Table(table_data, colWidths=[0.5*inch, 2.5*inch, 0.8*inch, 0.8*inch, 1*inch, 1.2*inch])
        # Определяем шрифты для таблицы
        available_fonts = pdfmetrics.getRegisteredFontNames()
        if 'Arial' in available_fonts:
            table_font = 'Arial'
            table_bold_font = 'Arial-Bold'
        elif 'DejaVuSans' in available_fonts:
            table_font = 'DejaVuSans'
            table_bold_font = 'DejaVuSans-Bold'
        else:
            table_font = 'Helvetica'
            table_bold_font = 'Helvetica-Bold'
        
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), table_bold_font),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -2), colors.beige),
            ('BACKGROUND', (0, -1), (-1, -1), colors.lightgrey),
            ('FONTNAME', (0, 1), (-1, -1), table_font),
            ('FONTSIZE', (0, 1), (-1, -1), 9),
            ('FONTNAME', (0, -1), (-1, -1), table_bold_font),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        
        story.append(table)
    
    # Банковские реквизиты
    if data['formData']['supplierBankDetails']:
        story.append(Spacer(1, 20))
        bank_heading = Paragraph("БАНКОВСКИЕ РЕКВИЗИТЫ:", styles['heading'])
        story.append(bank_heading)
        bank_text = Paragraph(data['formData']['supplierBankDetails'].replace('\n', '<br/>'), styles['normal'])
        story.append(bank_text)
    
    doc.build(story)
    buffer.seek(0)
    return buffer

def generate_contract_pdf(data):
    """Генерация договора"""
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)
    story = []
    styles = create_styles()
    
    # Заголовок
    title = Paragraph(f"ДОГОВОР № {data['formData']['contractNumber']}", styles['title'])
    story.append(title)
    story.append(Spacer(1, 20))
    
    # Дата и место
    date_place = f"{data['formData']['contractPlace'] or ''} {data['formData']['contractDate'] or ''}"
    date_text = Paragraph(date_place, styles['normal'])
    story.append(date_text)
    story.append(Spacer(1, 20))
    
    # Стороны
    parties_heading = Paragraph("СТОРОНЫ ДОГОВОРА:", styles['heading'])
    story.append(parties_heading)
    
    # Заказчик
    customer_text = Paragraph(f"<b>Заказчик:</b> {data['formData']['customerName']}", styles['normal'])
    story.append(customer_text)
    if data['formData']['customerRepresentative']:
        rep_text = Paragraph(f"в лице {data['formData']['customerRepresentative']}", styles['normal'])
        story.append(rep_text)
    story.append(Spacer(1, 10))
    
    # Исполнитель
    supplier_text = Paragraph(f"<b>Исполнитель:</b> {data['formData']['companyName']}", styles['normal'])
    story.append(supplier_text)
    if data['formData']['supplierRepresentative']:
        rep_text = Paragraph(f"в лице {data['formData']['supplierRepresentative']}", styles['normal'])
        story.append(rep_text)
    story.append(Spacer(1, 20))
    
    # Предмет договора
    if data['formData']['contractSubject']:
        subject_heading = Paragraph("ПРЕДМЕТ ДОГОВОРА:", styles['heading'])
        story.append(subject_heading)
        subject_text = Paragraph(data['formData']['contractSubject'], styles['normal'])
        story.append(subject_text)
        story.append(Spacer(1, 15))
    
    # Условия
    conditions = []
    if data['formData']['executionPeriod']:
        conditions.append(f"Сроки выполнения: {data['formData']['executionPeriod']}")
    if data['formData']['paymentTerms']:
        conditions.append(f"Условия оплаты: {data['formData']['paymentTerms']}")
    
    if conditions:
        conditions_heading = Paragraph("УСЛОВИЯ:", styles['heading'])
        story.append(conditions_heading)
        conditions_text = Paragraph("<br/>".join(conditions), styles['normal'])
        story.append(conditions_text)
        story.append(Spacer(1, 15))
    
    # Дополнительные условия
    if data['formData']['additionalTerms']:
        additional_heading = Paragraph("ДОПОЛНИТЕЛЬНЫЕ УСЛОВИЯ:", styles['heading'])
        story.append(additional_heading)
        additional_text = Paragraph(data['formData']['additionalTerms'], styles['normal'])
        story.append(additional_text)
        story.append(Spacer(1, 20))
    
    # Подписи
    signatures_heading = Paragraph("ПОДПИСИ СТОРОН:", styles['heading'])
    story.append(signatures_heading)
    
    signature_table = Table([
        ['Заказчик:', 'Исполнитель:'],
        ['_________________', '_________________'],
        [data['formData']['customerRepresentative'] or '', data['formData']['supplierRepresentative'] or '']
    ], colWidths=[3*inch, 3*inch])
    
    # Определяем шрифты для таблицы подписей
    available_fonts = pdfmetrics.getRegisteredFontNames()
    if 'Arial' in available_fonts:
        signature_font = 'Arial'
    elif 'DejaVuSans' in available_fonts:
        signature_font = 'DejaVuSans'
    else:
        signature_font = 'Helvetica'
    
    signature_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, -1), signature_font),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 1), (-1, 1), 20),
    ]))
    
    story.append(signature_table)
    
    doc.build(story)
    buffer.seek(0)
    return buffer

@documents_bp.route('/generate', methods=['POST'])
@cross_origin()
def generate_document():
    """API endpoint для генерации документов"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Нет данных для генерации'}), 400
        
        document_type = data.get('type')
        
        if document_type == 'pricelist':
            pdf_buffer = generate_pricelist_pdf(data)
            filename = f"pricelist_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        elif document_type == 'invoice':
            pdf_buffer = generate_invoice_pdf(data)
            filename = f"invoice_{data['formData'].get('invoiceNumber', 'unknown')}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        elif document_type == 'contract':
            pdf_buffer = generate_contract_pdf(data)
            filename = f"contract_{data['formData'].get('contractNumber', 'unknown')}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        else:
            return jsonify({'error': 'Неизвестный тип документа'}), 400
        
        return send_file(
            pdf_buffer,
            as_attachment=True,
            download_name=filename,
            mimetype='application/pdf'
        )
        
    except Exception as e:
        return jsonify({'error': f'Ошибка генерации документа: {str(e)}'}), 500

@documents_bp.route('/preview', methods=['POST'])
@cross_origin()
def preview_document():
    """API endpoint для предварительного просмотра документа"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Нет данных для предварительного просмотра'}), 400
        
        document_type = data.get('type')
        form_data = data.get('formData', {})
        items = data.get('items', [])
        
        # Генерируем HTML предварительный просмотр
        html_content = generate_preview_html(document_type, form_data, items)
        
        return jsonify({
            'success': True,
            'preview_html': html_content,
            'type': document_type,
            'items_count': len(items),
            'total': data.get('total', 0)
        })
        
    except Exception as e:
        return jsonify({'error': f'Ошибка предварительного просмотра: {str(e)}'}), 500

def generate_preview_html(document_type, form_data, items):
    """Генерация HTML для предварительного просмотра"""
    html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; background: white; border: 1px solid #dee2e6; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="color: #2c3e50; margin: 0; font-size: 28px; font-weight: bold;">{get_document_title(document_type, form_data)}</h1>
        </div>
    """
    
    # Информация о компании
    if form_data.get('companyName'):
        html += f'<div style="text-align: center; margin-bottom: 20px;"><h2 style="color: #34495e; margin: 0; font-size: 18px; font-weight: bold;">{form_data["companyName"]}</h2></div>'
    
    # Контактная информация
    contact_info = []
    if form_data.get('phone'):
        contact_info.append(f"📞 {form_data['phone']}")
    if form_data.get('email'):
        contact_info.append(f"✉ {form_data['email']}")
    if form_data.get('address'):
        contact_info.append(f"📍 {form_data['address']}")
    
    if contact_info:
        html += f'<div style="text-align: center; margin-bottom: 30px; color: #7f8c8d; font-size: 12px;">{"<br/>".join(contact_info)}</div>'
    
    # Специфичная информация для разных типов документов
    if document_type == 'invoice':
        html += generate_invoice_preview(form_data)
    elif document_type == 'contract':
        html += generate_contract_preview(form_data)
    
    # Таблица товаров
    if items:
        html += generate_items_table(items, document_type)
    
    html += "</div>"
    return html

def get_document_title(document_type, form_data=None):
    """Получение заголовка документа"""
    if form_data is None:
        form_data = {}
    
    titles = {
        'pricelist': 'ПРАЙС-ЛИСТ',
        'invoice': f'СЧЕТ НА ОПЛАТУ № {form_data.get("invoiceNumber", "")}',
        'contract': f'ДОГОВОР № {form_data.get("contractNumber", "")}'
    }
    return titles.get(document_type, 'ДОКУМЕНТ')

def generate_invoice_preview(form_data):
    """Генерация предварительного просмотра счета"""
    html = ""
    
    if form_data.get('invoiceDate'):
        html += f'<div style="margin-bottom: 20px;">от {form_data["invoiceDate"]}</div>'
    
    # Поставщик
    html += '<div style="margin-bottom: 15px;"><strong>ПОСТАВЩИК:</strong><br/>'
    supplier_info = [form_data.get('companyName', '')]
    if form_data.get('supplierInn'):
        supplier_info.append(f"ИНН: {form_data['supplierInn']}")
    if form_data.get('supplierKpp'):
        supplier_info.append(f"КПП: {form_data['supplierKpp']}")
    if form_data.get('address'):
        supplier_info.append(f"Адрес: {form_data['address']}")
    html += "<br/>".join(filter(None, supplier_info)) + '</div>'
    
    # Покупатель
    html += '<div style="margin-bottom: 20px;"><strong>ПОКУПАТЕЛЬ:</strong><br/>'
    customer_info = [form_data.get('customerName', '')]
    if form_data.get('customerInn'):
        customer_info.append(f"ИНН: {form_data['customerInn']}")
    if form_data.get('customerKpp'):
        customer_info.append(f"КПП: {form_data['customerKpp']}")
    if form_data.get('customerAddress'):
        customer_info.append(f"Адрес: {form_data['customerAddress']}")
    html += "<br/>".join(filter(None, customer_info)) + '</div>'
    
    return html

def generate_contract_preview(form_data):
    """Генерация предварительного просмотра договора"""
    html = ""
    
    if form_data.get('contractDate') or form_data.get('contractPlace'):
        date_place = f"{form_data.get('contractPlace', '')} {form_data.get('contractDate', '')}"
        html += f'<div style="margin-bottom: 20px;">{date_place}</div>'
    
    # Стороны договора
    html += '<div style="margin-bottom: 15px;"><strong>СТОРОНЫ ДОГОВОРА:</strong><br/>'
    html += f'<strong>Заказчик:</strong> {form_data.get("customerName", "")}<br/>'
    if form_data.get('customerRepresentative'):
        html += f'в лице {form_data["customerRepresentative"]}<br/>'
    html += f'<strong>Исполнитель:</strong> {form_data.get("companyName", "")}<br/>'
    if form_data.get('supplierRepresentative'):
        html += f'в лице {form_data["supplierRepresentative"]}'
    html += '</div>'
    
    # Предмет договора
    if form_data.get('contractSubject'):
        html += f'<div style="margin-bottom: 15px;"><strong>ПРЕДМЕТ ДОГОВОРА:</strong><br/>{form_data["contractSubject"]}</div>'
    
    return html

def generate_items_table(items, document_type):
    """Генерация таблицы товаров"""
    if not items:
        return ""
    
    # Заголовки таблицы
    if document_type == 'invoice':
        headers = ['№', 'Наименование', 'Кол-во', 'Ед.изм.', 'Цена', 'Сумма']
    else:
        headers = ['№', 'Наименование', 'Описание', 'Ед.изм.', 'Цена', 'Категория']
    
    # Заголовок таблицы
    html = '<h3 style="color: #34495e; margin: 30px 0 15px 0; font-size: 16px; font-weight: bold;">ТОВАРЫ И УСЛУГИ</h3>'
    html += '<table style="width: 100%; border-collapse: collapse; margin-top: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">'
    html += '<thead><tr style="background-color: #34495e; color: white;">'
    for header in headers:
        html += f'<th style="border: 1px solid #dee2e6; padding: 12px; text-align: center; font-weight: bold; font-size: 11px;">{header}</th>'
    html += '</tr></thead><tbody>'
    
    total_sum = 0
    for i, item in enumerate(items, 1):
        if document_type == 'invoice':
            item_sum = item.get('quantity', 0) * item.get('price', 0)
            total_sum += item_sum
            row_bg = '#f8f9fa' if i % 2 == 0 else 'white'
            html += f'''
            <tr style="background-color: {row_bg};">
                <td style="border: 1px solid #dee2e6; padding: 10px; text-align: center; color: #2c3e50; font-size: 10px;">{i}</td>
                <td style="border: 1px solid #dee2e6; padding: 10px; color: #2c3e50; font-size: 10px;">{item.get('name', '')}</td>
                <td style="border: 1px solid #dee2e6; padding: 10px; text-align: center; color: #2c3e50; font-size: 10px;">{item.get('quantity', 0)}</td>
                <td style="border: 1px solid #dee2e6; padding: 10px; text-align: center; color: #2c3e50; font-size: 10px;">{item.get('unit', '')}</td>
                <td style="border: 1px solid #dee2e6; padding: 10px; text-align: center; color: #2c3e50; font-size: 10px;">{item.get('price', 0):.2f}</td>
                <td style="border: 1px solid #dee2e6; padding: 10px; text-align: center; color: #2c3e50; font-size: 10px;">{item_sum:.2f}</td>
            </tr>
            '''
        else:
            row_bg = '#f8f9fa' if i % 2 == 0 else 'white'
            html += f'''
            <tr style="background-color: {row_bg};">
                <td style="border: 1px solid #dee2e6; padding: 10px; text-align: center; color: #2c3e50; font-size: 10px;">{i}</td>
                <td style="border: 1px solid #dee2e6; padding: 10px; color: #2c3e50; font-size: 10px;">{item.get('name', '')}</td>
                <td style="border: 1px solid #dee2e6; padding: 10px; color: #2c3e50; font-size: 10px;">{item.get('description', '')}</td>
                <td style="border: 1px solid #dee2e6; padding: 10px; text-align: center; color: #2c3e50; font-size: 10px;">{item.get('unit', '')}</td>
                <td style="border: 1px solid #dee2e6; padding: 10px; text-align: center; color: #2c3e50; font-size: 10px;">{item.get('price', 0):.2f}</td>
                <td style="border: 1px solid #dee2e6; padding: 10px; color: #2c3e50; font-size: 10px;">{item.get('category', '')}</td>
            </tr>
            '''
    
    # Итого для счетов
    if document_type == 'invoice' and total_sum > 0:
        html += f'''
        <tr style="background-color: #e9ecef;">
            <td colspan="5" style="border: 1px solid #dee2e6; padding: 12px; text-align: right; font-weight: bold; color: #2c3e50; font-size: 11px;">ИТОГО:</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center; font-weight: bold; color: #2c3e50; font-size: 11px;">{total_sum:.2f}</td>
        </tr>
        '''
    
    html += '</tbody></table>'
    return html

