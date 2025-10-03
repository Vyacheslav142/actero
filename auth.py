from flask import Blueprint, request, jsonify, session
import hashlib
import hmac
import json
from urllib.parse import unquote

auth_bp = Blueprint('auth', __name__)

# Telegram Bot Token (предоставлен пользователем)
TELEGRAM_BOT_TOKEN = "7035782288:AAFLDM0Uq-FV-r4tYNkOFhb_IH-7pR5GZ8g"

def verify_telegram_auth(auth_data):
    """
    Проверяет подлинность данных авторизации Telegram
    """
    check_hash = auth_data.pop('hash', None)
    if not check_hash:
        return False
    
    # Создаем строку для проверки
    data_check_string = '\n'.join([f'{k}={v}' for k, v in sorted(auth_data.items())])
    
    # Создаем секретный ключ
    secret_key = hashlib.sha256(TELEGRAM_BOT_TOKEN.encode()).digest()
    
    # Вычисляем HMAC
    calculated_hash = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()
    
    return calculated_hash == check_hash

@auth_bp.route('/telegram/login', methods=['POST'])
def telegram_login():
    """
    Обрабатывает авторизацию через Telegram
    """
    try:
        auth_data = request.json
        
        if not auth_data:
            return jsonify({'error': 'Отсутствуют данные авторизации'}), 400
        
        # Проверяем подлинность данных
        if not verify_telegram_auth(auth_data.copy()):
            return jsonify({'error': 'Недействительные данные авторизации'}), 401
        
        # Сохраняем данные пользователя в сессии
        session['user'] = {
            'id': auth_data.get('id'),
            'first_name': auth_data.get('first_name'),
            'last_name': auth_data.get('last_name'),
            'username': auth_data.get('username'),
            'photo_url': auth_data.get('photo_url'),
            'auth_date': auth_data.get('auth_date')
        }
        
        return jsonify({
            'success': True,
            'user': session['user'],
            'message': 'Успешная авторизация через Telegram'
        })
        
    except Exception as e:
        return jsonify({'error': f'Ошибка авторизации: {str(e)}'}), 500

@auth_bp.route('/user/profile', methods=['GET'])
def get_user_profile():
    """
    Возвращает профиль текущего пользователя
    """
    if 'user' not in session:
        return jsonify({'error': 'Пользователь не авторизован'}), 401
    
    return jsonify({
        'user': session['user'],
        'authenticated': True
    })

@auth_bp.route('/logout', methods=['POST'])
def logout():
    """
    Выход из системы
    """
    session.pop('user', None)
    return jsonify({
        'success': True,
        'message': 'Успешный выход из системы'
    })

@auth_bp.route('/check-auth', methods=['GET'])
def check_auth():
    """
    Проверяет статус авторизации
    """
    return jsonify({
        'authenticated': 'user' in session,
        'user': session.get('user', None)
    })

