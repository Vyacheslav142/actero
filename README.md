# Actero - Генератор документов

SaaS-сервис для создания документов (прайс-листы, счета на оплату, договоры) с современным дизайном.

## 🚀 Локальный запуск

### Предварительные требования

- Node.js 18+
- Python 3.8+
- pip

### Установка и запуск

#### 1. Установка зависимостей Frontend

```bash
# Установка Node.js зависимостей
npm install

# Или если используете yarn
yarn install
```

#### 2. Установка зависимостей Backend

```bash
# Установка Python зависимостей
pip install -r requirements.txt
```

#### 3. Запуск в режиме разработки

**Терминал 1 - Backend (Flask):**

```bash
python main.py
```

Backend будет доступен на http://localhost:5000

**Терминал 2 - Frontend (React):**

```bash
npm run dev
```

Frontend будет доступен на http://localhost:5173

### Структура проекта

```
docflow/
├── src/                    # React приложение
│   ├── components/         # React компоненты
│   │   ├── ui/           # UI компоненты (shadcn/ui)
│   │   ├── HomePage.jsx
│   │   ├── DocumentGenerator.jsx
│   │   ├── TelegramAuth.jsx
│   │   └── PreviewModal.jsx
│   ├── lib/               # Утилиты
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── main.py                # Flask приложение
├── documents.py           # API для генерации PDF
├── auth.py               # Telegram авторизация
├── requirements.txt      # Python зависимости
├── package.json         # Node.js зависимости
└── vite.config.js       # Vite конфигурация
```

## 🛠 Технологии

### Frontend

- **React 18** - UI библиотека
- **Vite** - сборщик
- **Tailwind CSS** - стилизация
- **shadcn/ui** - UI компоненты
- **Framer Motion** - анимации
- **React Router** - маршрутизация
- **Lucide React** - иконки

### Backend

- **Flask** - веб-фреймворк
- **ReportLab** - генерация PDF
- **Flask-CORS** - CORS поддержка
- **SQLAlchemy** - ORM (опционально)

## 📋 Функциональность

- ✅ Генерация прайс-листов
- ✅ Создание счетов на оплату
- ✅ Составление договоров
- ✅ Предварительный просмотр
- ✅ Telegram авторизация
- ✅ Адаптивный дизайн
- ✅ Анимации и переходы

## 🚀 Деплой на сервер

### 1. Подготовка сервера

```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Установка Python
sudo apt install python3 python3-pip python3-venv

# Установка системных зависимостей для PDF
sudo apt install -y libcairo2-dev libpango1.0-dev libgdk-pixbuf2.0-dev libffi-dev shared-mime-info
```

### 2. Настройка проекта на сервере

```bash
# Клонирование проекта
git clone <your-repo-url>
cd docflow

# Установка зависимостей
npm install
pip install -r requirements.txt

# Сборка frontend
npm run build
```

### 3. Настройка веб-сервера (Nginx)

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 4. Запуск в продакшн

```bash
# Создание systemd сервиса
sudo nano /etc/systemd/system/docflow.service
```

```ini
[Unit]
Description=DocuFlow Flask App
After=network.target

[Service]
User=www-data
WorkingDirectory=/path/to/docflow
Environment=PATH=/path/to/docflow/venv/bin
ExecStart=/path/to/docflow/venv/bin/python main.py
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
# Активация сервиса
sudo systemctl daemon-reload
sudo systemctl enable docflow
sudo systemctl start docflow
```

## 🔧 Конфигурация

### Переменные окружения

Создайте файл `.env`:

```env
FLASK_ENV=production
SECRET_KEY=your-secret-key
TELEGRAM_BOT_TOKEN=your-bot-token
```

### Настройка Telegram бота

1. Создайте бота через @BotFather
2. Получите токен бота
3. Обновите `TELEGRAM_BOT_TOKEN` в `auth.py`

## 📝 API Endpoints

- `POST /api/documents/generate` - Генерация PDF документа
- `POST /api/documents/preview` - Предварительный просмотр
- `POST /api/auth/telegram/login` - Авторизация через Telegram
- `GET /api/auth/check-auth` - Проверка авторизации
- `POST /api/auth/logout` - Выход из системы

## 🐛 Устранение неполадок

### Проблемы с PDF генерацией

```bash
# Установка дополнительных зависимостей
sudo apt install -y libcairo2-dev libpango1.0-dev libgdk-pixbuf2.0-dev
```

### Проблемы с CORS

Убедитесь, что в `main.py` правильно настроен CORS:

```python
CORS(app, supports_credentials=True)
```

## 📄 Лицензия

MIT License
