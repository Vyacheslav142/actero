import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './components/HomePage'
import DocumentGenerator from './components/DocumentGenerator'
import './App.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/generator" element={<DocumentGenerator />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

