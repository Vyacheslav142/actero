import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FileText, Receipt, FileCheck, Zap, Shield, Download, ArrowRight, Send, Star, Box, Layers, Zap as Rocket, Eye } from 'lucide-react'
import { motion } from 'framer-motion'
import TelegramAuth from './TelegramAuth'

const HomePage = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  const handleAuthChange = (userData) => {
    setUser(userData)
  }

  const handleStartCreating = () => {
    navigate('/generator')
  }

  const features = [
    {
      icon: <Rocket className="h-8 w-8 text-white" />,
      title: "Быстрое создание",
      description: "Создавайте документы за считанные минуты с помощью интуитивного интерфейса"
    },
    {
      icon: <Shield className="h-8 w-8 text-white" />,
      title: "Безопасность данных",
      description: "Ваши данные защищены современными методами шифрования"
    },
    {
      icon: <Download className="h-8 w-8 text-white" />,
      title: "Мгновенная загрузка",
      description: "Получайте готовые документы в формате PDF сразу после создания"
    }
  ]

  const documentTypes = [
    {
      icon: <FileText className="h-12 w-12 text-white" />,
      title: "Прайс-листы",
      description: "Профессиональные прайс-листы с вашим брендингом"
    },
    {
      icon: <Receipt className="h-12 w-12 text-white" />,
      title: "Счета на оплату",
      description: "Корректные счета с полными реквизитами"
    },
    {
      icon: <FileCheck className="h-12 w-12 text-white" />,
      title: "Договоры",
      description: "Юридически корректные договоры и соглашения"
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div
                  className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center"
                >
                  <Box className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-pulse"></div>
              </div>
              <span className="text-2xl font-bold text-gray-900">
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Act</span>
                <span className="text-gray-900">ero</span>
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <TelegramAuth onAuthChange={handleAuthChange} />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 py-20 overflow-hidden">
        {/* 3D Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ 
              rotateX: [0, 360],
              rotateY: [0, 180],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full blur-xl"
          />
          <motion.div
            animate={{ 
              rotateX: [360, 0],
              rotateY: [180, 0],
              scale: [1.1, 1, 1.1]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-pink-400/20 to-purple-400/20 rounded-full blur-xl"
          />
          <motion.div
            animate={{ 
              rotateZ: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-20 left-1/4 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-xl"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-block mb-6"
            >
              <div className="relative">
                <motion.div
                  animate={{ rotateY: [0, 360] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xl"
                >
                  <Box className="h-10 w-10 text-white" />
                </motion.div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              </div>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Act</span>
              <span className="text-gray-900">ero</span>
              <span className="block text-4xl md:text-5xl mt-2">
                Генератор документов
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Современная платформа для создания документов. 
              Создавайте прайс-листы, счета и договоры с невероятной скоростью и точностью.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  onClick={handleStartCreating}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg shadow-xl"
                >
                  <FileText className="mr-2 h-5 w-5" />
                  Начать создавать
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="outline" 
                  size="lg"
                  className="px-8 py-4 text-lg border-purple-200 hover:bg-purple-50"
                >
                  <Eye className="mr-2 h-5 w-5" />
                  Посмотреть примеры
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Document Types */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* 3D Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-400 to-blue-400 transform rotate-12 scale-150"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Типы документов
              </h2>
              <p className="text-xl text-gray-600">
                Создавайте любые деловые документы с помощью наших шаблонов
              </p>
            </motion.div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {documentTypes.map((type, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20, rotateX: -15 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ 
                  y: -10, 
                  rotateX: 5,
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
                className="perspective-1000"
              >
                <Card className="h-full hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-purple-50/30 shadow-lg">
                  <CardContent className="p-8 text-center relative">
                    {/* 3D Icon Container */}
                    <div className="mb-6 flex justify-center relative">
                      <motion.div
                        whileHover={{ rotateY: 180 }}
                        transition={{ duration: 0.6 }}
                        className="relative"
                      >
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                          {type.icon}
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-pulse"></div>
                      </motion.div>
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                      {type.title}
                    </h3>
                    <p className="text-gray-600">
                      {type.description}
                    </p>
                    {/* 3D Effect Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-purple-50/30 relative overflow-hidden">
        {/* Floating 3D Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              rotateZ: [0, 180, 360]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 right-10 w-16 h-16 bg-gradient-to-br from-purple-400/30 to-blue-400/30 rounded-full blur-sm"
          />
          <div
            animate={{ 
              y: [0, 20, 0],
              rotateZ: [360, 180, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-20 left-10 w-12 h-12 bg-gradient-to-br from-pink-400/30 to-purple-400/30 rounded-full blur-sm"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Почему выбирают <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Actero</span>
              </h2>
              <p className="text-xl text-gray-600">
                Простота, скорость и профессиональное качество
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                
                whileHover={{ 
                  scale: 1.05,
                  y: -5,
                  transition: { duration: 0.3 }
                }}
                className="text-center relative"
              >
                <div className="relative">
                  <div
                  
                    className="mb-6 flex justify-center"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                      {feature.icon}
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-pulse"></div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 relative overflow-hidden">
        {/* 3D Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ 
              rotateX: [0, 360],
              rotateY: [0, 180],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute top-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-xl"
          />
          <motion.div
            animate={{ 
              rotateX: [360, 0],
              rotateY: [180, 0],
              scale: [1.2, 1, 1.2]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-block mb-6"
            >
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto backdrop-blur-sm">
                <Rocket className="h-10 w-10 text-white" />
              </div>
            </motion.div>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Готовы начать создавать документы?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Присоединяйтесь к тысячам пользователей, которые уже используют <span className="font-semibold">Actero</span> 
              для создания документов
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={handleStartCreating}
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-xl"
              >
                <FileText className="mr-2 h-5 w-5" />
                Создать первый документ
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 relative overflow-hidden">
        {/* 3D Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ 
              rotateZ: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-full blur-xl"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div
               
                className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center"
              >
                <Box className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Act</span>
                <span className="text-white">ero</span>
              </span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2024 <span className="text-purple-400">Actero</span>. Все права защищены.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage

