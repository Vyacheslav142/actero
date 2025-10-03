import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Eye, X, Download } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const PreviewModal = ({ documentData, onGenerate }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [previewContent, setPreviewContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handlePreview = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:5001/api/documents/preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(documentData)
      })
      
      if (response.ok) {
        const result = await response.json()
        setPreviewContent(result.preview_html || '')
        setIsOpen(true)
      } else {
        const error = await response.json()
        alert(`Ошибка предварительного просмотра: ${error.error}`)
      }
    } catch (error) {
      alert(`Ошибка соединения: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Button 
        onClick={handlePreview} 
        variant="outline" 
        className="w-full group relative overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-blue-200 hover:border-blue-300 transition-all duration-300"
        disabled={isLoading}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={false}
        />
        <Eye className="h-4 w-4 mr-2 relative z-10" />
        <span className="relative z-10">
          {isLoading ? 'Загрузка...' : 'Предварительный просмотр'}
        </span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-white/95 backdrop-blur-xl border border-gray-200/50 shadow-2xl">
          <DialogHeader className="border-b border-gray-200/50 pb-4">
            <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Предварительный просмотр документа
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-auto p-6 bg-gray-50/50 rounded-lg">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200/50 p-6">
              <div 
                dangerouslySetInnerHTML={{ __html: previewContent }}
                className="prose prose-sm max-w-none"
              />
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t border-gray-200/50">
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="hover:bg-gray-100 transition-colors duration-200"
            >
              <X className="h-4 w-4 mr-2" />
              Закрыть
            </Button>
            
            <Button 
              onClick={() => {
                setIsOpen(false)
                onGenerate()
              }}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Download className="h-4 w-4 mr-2" />
              Создать PDF
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default PreviewModal

