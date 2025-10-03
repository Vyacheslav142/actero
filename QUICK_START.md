# 🚀 Быстрый запуск DocuFlow

## Локальный запуск (Windows)

### 1. Установка зависимостей

```bash
# Установка Node.js зависимостей
npm install

# Установка Python зависимостей
pip install -r requirements.txt
```

### 2. Запуск проекта

```bash
# Вариант 1: Автоматический запуск (Windows)
start-dev.bat

# Вариант 2: Ручной запуск
# Терминал 1 - Backend
python main.py

# Терминал 2 - Frontend
npm run dev
```

### 3. Доступ к приложению

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## Локальный запуск (Linux/Mac)

### 1. Установка зависимостей

```bash
npm install
pip install -r requirements.txt
```

### 2. Запуск проекта

```bash
# Автоматический запуск
chmod +x start-dev.sh
./start-dev.sh

# Или ручной запуск
python main.py &
npm run dev
```

## 🔧 Настройка Telegram бота

1. Создайте бота через @BotFather в Telegram
2. Получите токен бота
3. Обновите токен в файле `auth.py`:
   ```python
   TELEGRAM_BOT_TOKEN = "ваш-токен-бота"
   ```

## 📁 Структура проекта

```
docflow/
├── src/                    # React приложение
│   ├── components/         # Компоненты
│   ├── lib/               # Утилиты
│   └── ...
├── main.py                # Flask сервер
├── documents.py           # PDF генерация
├── auth.py                # Telegram авторизация
├── requirements.txt       # Python зависимости
├── package.json          # Node.js зависимости
└── README.md             # Полная документация
```

## 🐛 Устранение проблем

### Ошибка "Module not found"

```bash
npm install
```

### Ошибка "Python module not found"

```bash
pip install -r requirements.txt
```

### Проблемы с PDF генерацией

```bash
# Ubuntu/Debian
sudo apt install -y libcairo2-dev libpango1.0-dev libgdk-pixbuf2.0-dev

# Windows
# Установите Microsoft Visual C++ Build Tools
```

## 📞 Поддержка

Если возникли проблемы, проверьте:

1. Все зависимости установлены
2. Порты 5000 и 5173 свободны
3. Python 3.8+ и Node.js 18+ установлены

