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
