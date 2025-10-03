#!/bin/bash

echo "Starting DocuFlow Development Environment..."

echo ""
echo "Installing dependencies..."
npm install

echo ""
echo "Starting Flask backend on port 5000..."
python main.py &
BACKEND_PID=$!

echo ""
echo "Starting React frontend on port 5173..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "Development environment started!"
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop all services"

# Функция для остановки всех процессов
cleanup() {
    echo ""
    echo "Stopping services..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Обработка сигнала прерывания
trap cleanup SIGINT

# Ожидание завершения
wait

