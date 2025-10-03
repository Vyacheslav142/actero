# 🤖 Настройка Telegram авторизации для DocuFlow

## Шаг 1: Создание Telegram бота

### 1.1 Создайте бота через @BotFather

1. **Откройте Telegram** и найдите [@BotFather](https://t.me/BotFather)
2. **Отправьте команду** `/newbot`
3. **Введите имя бота** (например: "DocuFlow Bot")
4. **Введите username** (например: "DocuFlowBot")
5. **Получите токен** (формат: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

### 1.2 Настройте бота

Отправьте боту следующие команды:

```
/setdomain - установите домен вашего сайта
/setprivacy - выберите "Disable" для получения сообщений
```

## Шаг 2: Обновление конфигурации

### 2.1 Обновите токен бота

В файле `auth.py` замените:

```python
TELEGRAM_BOT_TOKEN = "YOUR_BOT_TOKEN_HERE"
```

На ваш реальный токен:

```python
TELEGRAM_BOT_TOKEN = "123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
```

### 2.2 Обновите username бота

В файле `src/components/TelegramAuth.jsx` найдите строку:

```javascript
script.setAttribute("data-telegram-login", "DocuFlowBot");
```

Замените `DocuFlowBot` на username вашего бота.

## Шаг 3: Запуск серверов

### 3.1 Запустите Flask сервер

```bash
python main.py
```

### 3.2 Запустите React сервер

```bash
npm run dev
```

## Шаг 4: Тестирование

1. **Откройте** http://localhost:5000 (или ваш порт)
2. **Нажмите** на кнопку "Авторизация через Telegram"
3. **Должен появиться** Telegram Login Widget
4. **Нажмите** "Log in with Telegram"
5. **Подтвердите** авторизацию в Telegram

## 🔧 Устранение проблем

### Проблема: Widget не загружается

**Решение**: Проверьте username бота в коде

### Проблема: Ошибка авторизации

**Решение**: Проверьте токен бота и домен

### Проблема: Flask не запускается

**Решение**: Установите зависимости:

```bash
pip install -r requirements.txt
```

## 📱 Демо режим

Если не хотите настраивать Telegram бота, можете использовать демо авторизацию:

- Нажмите кнопку "Демо авторизация"
- Будет создан тестовый пользователь

## 🚀 Продакшн

Для продакшн среды:

1. **Настройте HTTPS** (обязательно для Telegram)
2. **Обновите домен** в настройках бота
3. **Используйте production WSGI сервер** вместо Flask dev server
