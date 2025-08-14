import React, { useState } from 'react'
import HierarchySelector from './components/HierarchySelector'
import BookReferences from './components/BookReferences'
import NotesGenerator from './components/NotesGenerator'
import { BookOpen, Brain } from 'lucide-react'

interface SelectedItems {
  exam: { id: string; name: string } | null
  course: { id: string; name: string } | null
  subject: { id: string; name: string } | null
  unit: { id: string; name: string } | null
  chapter: { id: string; name: string } | null
  topic: { id: string; name: string } | null
}

function App() {
  const [selected, setSelected] = useState<SelectedItems>({
    exam: null,
    course: null,
    subject: null,
    unit: null,
    chapter: null,
    topic: null
  })
  
  const [books, setBooks] = useState<string[]>([])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-800">AI Notes Generator</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Generate comprehensive study notes using AI for your exam preparation. 
            Select your topic hierarchy, add reference books, and get detailed LaTeX-formatted notes.
          </p>
        </header>

        <div className="space-y-8">
          <HierarchySelector onSelectionChange={setSelected} />
          
          <BookReferences books={books} onBooksChange={setBooks} />
          
          <NotesGenerator selected={selected} books={books} />
        </div>

        <footer className="mt-12 text-center text-gray-500">
          <div className="flex items-center justify-center gap-2 mb-2">
            <BookOpen className="w-4 h-4" />
            <span className="text-sm">Powered by Gemini AI & KaTeX</span>
          </div>
          <p className="text-xs">
            Generate high-quality study notes with mathematical formulations and detailed explanations.
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App