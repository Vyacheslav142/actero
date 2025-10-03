import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Send, LogOut, User } from 'lucide-react'
import { motion } from 'framer-motion'

const TelegramAuth = ({ onAuthChange }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Проверяем статус авторизации при загрузке
    checkAuthStatus()
    
    // Загружаем Telegram Login Widget скрипт
    const script = document.createElement('script')
    script.src = 'https://telegram.org/js/telegram-widget.js?22'
    script.async = true
    script.setAttribute('data-telegram-login', 'tgFit_bot') // Замените на ваш username бота
    script.setAttribute('data-size', 'large')
    script.setAttribute('data-onauth', 'onTelegramAuth(user)')
    script.setAttribute('data-request-access', 'write')
    
    // Создаем глобальную функцию для обработки авторизации
    window.onTelegramAuth = handleTelegramAuth
    
    const container = document.getElementById('telegram-login-container')
    if (container && !user) {
      container.appendChild(script)
    }

    return () => {
      // Очистка при размонтировании
      if (window.onTelegramAuth) {
        delete window.onTelegramAuth
      }
    }
  }, [user])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/check-auth', {
        credentials: 'include'
      })
      const data = await response.json()
      
      if (data.authenticated && data.user) {
        setUser(data.user)
        onAuthChange?.(data.user)
      }
    } catch (error) {
      console.error('Ошибка проверки авторизации:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTelegramAuth = async (telegramUser) => {
    try {
      const response = await fetch('/api/auth/telegram/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(telegramUser)
      })

      const data = await response.json()
      
      if (data.success) {
        setUser(data.user)
        onAuthChange?.(data.user)
        
        // Убираем Telegram виджет после успешной авторизации
        const container = document.getElementById('telegram-login-container')
        if (container) {
          container.innerHTML = ''
        }
      } else {
        alert(`Ошибка авторизации: ${data.error}`)
      }
    } catch (error) {
      alert(`Ошибка соединения: ${error.message}`)
    }
  }

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
      
      const data = await response.json()
      
      if (data.success) {
        setUser(null)
        onAuthChange?.(null)
        
        // Перезагружаем страницу для сброса Telegram виджета
        window.location.reload()
      }
    } catch (error) {
      alert(`Ошибка выхода: ${error.message}`)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (user) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.photo_url} alt={user.first_name} />
                  <AvatarFallback className="bg-blue-600 text-white">
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-gray-900">
                    {user.first_name} {user.last_name}
                  </p>
                  {user.username && (
                    <p className="text-sm text-gray-600">@{user.username}</p>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-gray-600 hover:text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center justify-center space-x-2">
            <Send className="h-5 w-5 text-blue-600" />
            <span>Авторизация через Telegram</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-gray-600 mb-4">
            Войдите через Telegram для доступа к расширенным возможностям
          </p>
          <div id="telegram-login-container" className="flex justify-center">
            {/* Telegram Login Widget будет загружен здесь */}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default TelegramAuth

