import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileText, Receipt, FileCheck, Plus, Trash2, Eye, Download, ArrowLeft, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import PreviewModal from './PreviewModal'

const DocumentGenerator = () => {
  const navigate = useNavigate()
  const [documentType, setDocumentType] = useState('pricelist')
  const [formData, setFormData] = useState({
    // Общие поля
    companyName: '',
    companyLogo: '',
    phone: '',
    email: '',
    address: '',
    currency: 'RUB',
    vatIncluded: true,
    
    // Для счетов
    invoiceNumber: '',
    invoiceDate: '',
    paymentDue: '',
    supplierInn: '',
    supplierKpp: '',
    supplierBankDetails: '',
    customerName: '',
    customerInn: '',
    customerKpp: '',
    customerAddress: '',
    
    // Для договоров
    contractNumber: '',
    contractDate: '',
    contractPlace: '',
    customerRepresentative: '',
    supplierRepresentative: '',
    contractSubject: '',
    executionPeriod: '',
    paymentTerms: '',
    additionalTerms: ''
  })

  const [items, setItems] = useState([
    {
      id: 1,
      name: '',
      description: '',
      unit: 'шт',
      quantity: 1,
      price: 0,
      category: ''
    }
  ])

  const documentTypes = [
    { id: 'pricelist', name: 'Прайс-лист', icon: <FileText className="h-5 w-5" /> },
    { id: 'invoice', name: 'Счет на оплату', icon: <Receipt className="h-5 w-5" /> },
    { id: 'contract', name: 'Договор', icon: <FileCheck className="h-5 w-5" /> }
  ]

  const currencies = [
    { value: 'RUB', label: '₽ Рубли' },
    { value: 'USD', label: '$ Доллары' },
    { value: 'EUR', label: '€ Евро' }
  ]

  const units = [
    'шт', 'кг', 'л', 'м', 'м²', 'м³', 'час', 'день', 'месяц', 'год', 'услуга'
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleItemChange = (id, field, value) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  const addItem = () => {
    const newId = Math.max(...items.map(item => item.id)) + 1
    setItems(prev => [...prev, {
      id: newId,
      name: '',
      description: '',
      unit: 'шт',
      quantity: 1,
      price: 0,
      category: ''
    }])
  }

  const removeItem = (id) => {
    if (items.length > 1) {
      setItems(prev => prev.filter(item => item.id !== id))
    }
  }

  const calculateTotal = () => {
    return items.reduce((total, item) => total + (item.quantity * item.price), 0)
  }

  const handleGenerate = async () => {
    const documentData = {
      type: documentType,
      formData,
      items,
      total: calculateTotal()
    }
    
    try {
      const response = await fetch('http://localhost:5001/api/documents/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(documentData)
      })
      
      if (response.ok) {
        // Проверяем, что это PDF файл
        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('application/pdf')) {
          // Получаем PDF файл как blob
          const blob = await response.blob()
          
          // Создаем ссылку для скачивания
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `document_${documentType}_${Date.now()}.pdf`
          document.body.appendChild(a)
          a.click()
          window.URL.revokeObjectURL(url)
          document.body.removeChild(a)
          
          alert('PDF документ успешно создан и загружен!')
        } else {
          // Если не PDF, пытаемся получить JSON ошибку
          try {
            const error = await response.json()
            alert(`Ошибка генерации PDF: ${error.error}`)
          } catch (e) {
            alert(`Ошибка генерации PDF: Неожиданный формат ответа`)
          }
        }
      } else {
        // Обрабатываем ошибку
        try {
          const error = await response.json()
          alert(`Ошибка генерации PDF: ${error.error}`)
        } catch (e) {
          alert(`Ошибка генерации PDF: ${response.status} ${response.statusText}`)
        }
      }
    } catch (error) {
      alert(`Ошибка соединения: ${error.message}`)
    }
  }

  const renderFormFields = () => {
    switch (documentType) {
      case 'pricelist':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyName">Название компании *</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  placeholder="ООО 'Ваша компания'"
                />
              </div>
              <div>
                <Label htmlFor="currency">Валюта</Label>
                <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map(currency => (
                      <SelectItem key={currency.value} value={currency.value}>
                        {currency.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Телефон</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+7 (999) 123-45-67"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="info@company.ru"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="address">Адрес</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="г. Москва, ул. Примерная, д. 1"
              />
            </div>
          </div>
        )

      case 'invoice':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="invoiceNumber">Номер счета *</Label>
                <Input
                  id="invoiceNumber"
                  value={formData.invoiceNumber}
                  onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
                  placeholder="001"
                />
              </div>
              <div>
                <Label htmlFor="invoiceDate">Дата выставления *</Label>
                <Input
                  id="invoiceDate"
                  type="date"
                  value={formData.invoiceDate}
                  onChange={(e) => handleInputChange('invoiceDate', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="paymentDue">Срок оплаты</Label>
                <Input
                  id="paymentDue"
                  type="date"
                  value={formData.paymentDue}
                  onChange={(e) => handleInputChange('paymentDue', e.target.value)}
                />
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3">Данные поставщика</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyName">Название организации *</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    placeholder="ООО 'Ваша компания'"
                  />
                </div>
                <div>
                  <Label htmlFor="supplierInn">ИНН *</Label>
                  <Input
                    id="supplierInn"
                    value={formData.supplierInn}
                    onChange={(e) => handleInputChange('supplierInn', e.target.value)}
                    placeholder="1234567890"
                  />
                </div>
                <div>
                  <Label htmlFor="supplierKpp">КПП</Label>
                  <Input
                    id="supplierKpp"
                    value={formData.supplierKpp}
                    onChange={(e) => handleInputChange('supplierKpp', e.target.value)}
                    placeholder="123456789"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Адрес</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="г. Москва, ул. Примерная, д. 1"
                  />
                </div>
              </div>
              <div className="mt-4">
                <Label htmlFor="supplierBankDetails">Банковские реквизиты</Label>
                <Textarea
                  id="supplierBankDetails"
                  value={formData.supplierBankDetails}
                  onChange={(e) => handleInputChange('supplierBankDetails', e.target.value)}
                  placeholder="Банк: ПАО Сбербанк&#10;БИК: 044525225&#10;Корр. счет: 30101810400000000225&#10;Расч. счет: 40702810338000000000"
                  rows={4}
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3">Данные покупателя</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerName">Название организации *</Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) => handleInputChange('customerName', e.target.value)}
                    placeholder="ООО 'Компания-покупатель'"
                  />
                </div>
                <div>
                  <Label htmlFor="customerInn">ИНН *</Label>
                  <Input
                    id="customerInn"
                    value={formData.customerInn}
                    onChange={(e) => handleInputChange('customerInn', e.target.value)}
                    placeholder="0987654321"
                  />
                </div>
                <div>
                  <Label htmlFor="customerKpp">КПП</Label>
                  <Input
                    id="customerKpp"
                    value={formData.customerKpp}
                    onChange={(e) => handleInputChange('customerKpp', e.target.value)}
                    placeholder="987654321"
                  />
                </div>
                <div>
                  <Label htmlFor="customerAddress">Адрес</Label>
                  <Input
                    id="customerAddress"
                    value={formData.customerAddress}
                    onChange={(e) => handleInputChange('customerAddress', e.target.value)}
                    placeholder="г. Санкт-Петербург, ул. Покупательская, д. 2"
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 'contract':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="contractNumber">Номер договора *</Label>
                <Input
                  id="contractNumber"
                  value={formData.contractNumber}
                  onChange={(e) => handleInputChange('contractNumber', e.target.value)}
                  placeholder="001/2024"
                />
              </div>
              <div>
                <Label htmlFor="contractDate">Дата заключения *</Label>
                <Input
                  id="contractDate"
                  type="date"
                  value={formData.contractDate}
                  onChange={(e) => handleInputChange('contractDate', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="contractPlace">Место заключения</Label>
                <Input
                  id="contractPlace"
                  value={formData.contractPlace}
                  onChange={(e) => handleInputChange('contractPlace', e.target.value)}
                  placeholder="г. Москва"
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3">Стороны договора</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium mb-2">Заказчик</h5>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="customerName">Полное наименование *</Label>
                      <Input
                        id="customerName"
                        value={formData.customerName}
                        onChange={(e) => handleInputChange('customerName', e.target.value)}
                        placeholder="ООО 'Компания-заказчик'"
                      />
                    </div>
                    <div>
                      <Label htmlFor="customerRepresentative">Представитель</Label>
                      <Input
                        id="customerRepresentative"
                        value={formData.customerRepresentative}
                        onChange={(e) => handleInputChange('customerRepresentative', e.target.value)}
                        placeholder="Генеральный директор Иванов И.И."
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Исполнитель</h5>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="companyName">Полное наименование *</Label>
                      <Input
                        id="companyName"
                        value={formData.companyName}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                        placeholder="ООО 'Ваша компания'"
                      />
                    </div>
                    <div>
                      <Label htmlFor="supplierRepresentative">Представитель</Label>
                      <Input
                        id="supplierRepresentative"
                        value={formData.supplierRepresentative}
                        onChange={(e) => handleInputChange('supplierRepresentative', e.target.value)}
                        placeholder="Генеральный директор Петров П.П."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3">Условия договора</h4>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="contractSubject">Предмет договора *</Label>
                  <Textarea
                    id="contractSubject"
                    value={formData.contractSubject}
                    onChange={(e) => handleInputChange('contractSubject', e.target.value)}
                    placeholder="Описание предмета договора..."
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="executionPeriod">Сроки выполнения</Label>
                    <Input
                      id="executionPeriod"
                      value={formData.executionPeriod}
                      onChange={(e) => handleInputChange('executionPeriod', e.target.value)}
                      placeholder="30 календарных дней"
                    />
                  </div>
                  <div>
                    <Label htmlFor="paymentTerms">Условия оплаты</Label>
                    <Input
                      id="paymentTerms"
                      value={formData.paymentTerms}
                      onChange={(e) => handleInputChange('paymentTerms', e.target.value)}
                      placeholder="100% предоплата"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="additionalTerms">Дополнительные условия</Label>
                  <Textarea
                    id="additionalTerms"
                    value={formData.additionalTerms}
                    onChange={(e) => handleInputChange('additionalTerms', e.target.value)}
                    placeholder="Дополнительные условия и требования..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Header */}
      <motion.header 
        className="relative z-10 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              className="flex items-center space-x-4"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="hover:bg-blue-50 transition-colors duration-200"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Назад
              </Button>
              <div className="flex items-center space-x-2">
                <motion.div
                  className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <FileText className="h-4 w-4 text-white" />
                </motion.div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Act</span>ero
                </h1>
              </div>
            </motion.div>
            
            <div className="flex items-center space-x-3">
              <PreviewModal 
                documentData={{
                  type: documentType,
                  formData,
                  items,
                  total: calculateTotal()
                }}
                onGenerate={handleGenerate}
              />
              <Button 
                onClick={handleGenerate} 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <motion.div
                  className="flex items-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Download className="h-4 w-4 mr-2 group-hover:animate-bounce" />
                  Создать PDF
                </motion.div>
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Создание документа</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={documentType} onValueChange={setDocumentType}>
                  <TabsList className="grid w-full grid-cols-3">
                    {documentTypes.map(type => (
                      <TabsTrigger key={type.id} value={type.id} className="flex items-center space-x-2">
                        {type.icon}
                        <span className="hidden sm:inline">{type.name}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  {documentTypes.map(type => (
                    <TabsContent key={type.id} value={type.id} className="mt-6">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {renderFormFields()}
                      </motion.div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>

            {/* Items Section */}
            <Card className="mt-6">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>
                    {documentType === 'pricelist' ? 'Товары и услуги' : 
                     documentType === 'invoice' ? 'Позиции счета' : 
                     'Предмет договора'}
                  </CardTitle>
                  <Button onClick={addItem} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Добавить
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-medium">Позиция {index + 1}</h4>
                        {items.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <Label>Наименование *</Label>
                          <Input
                            value={item.name}
                            onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                            placeholder="Название товара или услуги"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label>Описание</Label>
                          <Textarea
                            value={item.description}
                            onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                            placeholder="Подробное описание..."
                            rows={2}
                          />
                        </div>
                        {documentType !== 'contract' && (
                          <>
                            <div>
                              <Label>Единица измерения</Label>
                              <Select 
                                value={item.unit} 
                                onValueChange={(value) => handleItemChange(item.id, 'unit', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {units.map(unit => (
                                    <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>Количество</Label>
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                                min="0"
                                step="0.01"
                              />
                            </div>
                            <div>
                              <Label>Цена за единицу</Label>
                              <Input
                                type="number"
                                value={item.price}
                                onChange={(e) => handleItemChange(item.id, 'price', parseFloat(e.target.value) || 0)}
                                min="0"
                                step="0.01"
                              />
                            </div>
                            <div>
                              <Label>Сумма</Label>
                              <Input
                                value={(item.quantity * item.price).toFixed(2)}
                                readOnly
                                className="bg-gray-50"
                              />
                            </div>
                          </>
                        )}
                        {documentType === 'pricelist' && (
                          <div>
                            <Label>Категория</Label>
                            <Input
                              value={item.category}
                              onChange={(e) => handleItemChange(item.id, 'category', e.target.value)}
                              placeholder="Категория товара"
                            />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Итоги</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Тип документа:</span>
                    <span className="font-medium">
                      {documentTypes.find(type => type.id === documentType)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Позиций:</span>
                    <span className="font-medium">{items.length}</span>
                  </div>
                  {documentType !== 'contract' && (
                    <>
                      <div className="border-t pt-4">
                        <div className="flex justify-between text-lg font-semibold">
                          <span>Итого:</span>
                          <span>
                            {calculateTotal().toFixed(2)} {formData.currency}
                          </span>
                        </div>
                      </div>
                      {formData.vatIncluded && (
                        <div className="text-sm text-gray-600">
                          В том числе НДС: {(calculateTotal() * 0.2).toFixed(2)} {formData.currency}
                        </div>
                      )}
                    </>
                  )}
                  <div className="border-t pt-4 space-y-2">
                    <PreviewModal 
                      documentData={{
                        type: documentType,
                        formData,
                        items,
                        total: calculateTotal()
                      }}
                      onGenerate={handleGenerate}
                    />
                    <Button 
                      onClick={handleGenerate} 
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
                    >
                      <motion.div
                        className="flex items-center justify-center w-full"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <Download className="h-4 w-4 mr-2 group-hover:animate-bounce" />
                        Создать PDF
                      </motion.div>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DocumentGenerator

