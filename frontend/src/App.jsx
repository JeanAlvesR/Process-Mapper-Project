import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Navbar } from '@/components/Navbar'
import { Home } from '@/pages/Home'
import { AreaManagement } from '@/pages/AreaManagement'
import { ProcessManagement } from '@/pages/ProcessManagement'
import { ProcessVisualization } from '@/pages/ProcessVisualization'
import { Toaster } from '@/components/ui/sonner'
import './App.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/areas" element={<AreaManagement />} />
            <Route path="/processes" element={<ProcessManagement />} />
            <Route path="/visualization" element={<ProcessVisualization />} />
          </Routes>
        </main>
        <Toaster />
      </div>
    </Router>
  )
}

export default App

