import React, { useState } from 'react'
import { Plus, X, GripVertical } from 'lucide-react'

interface BookReferencesProps {
  books: string[]
  onBooksChange: (books: string[]) => void
}

export default function BookReferences({ books, onBooksChange }: BookReferencesProps) {
  const [newBook, setNewBook] = useState('')

  const addBook = () => {
    if (newBook.trim() && !books.includes(newBook.trim())) {
      onBooksChange([...books, newBook.trim()])
      setNewBook('')
    }
  }

  const removeBook = (index: number) => {
    onBooksChange(books.filter((_, i) => i !== index))
  }

  const moveBook = (fromIndex: number, toIndex: number) => {
    const newBooks = [...books]
    const [movedBook] = newBooks.splice(fromIndex, 1)
    newBooks.splice(toIndex, 0, movedBook)
    onBooksChange(newBooks)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addBook()
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Reference Books</h2>
      
      <div className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newBook}
            onChange={(e) => setNewBook(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter book name (e.g., 'Linear Algebra by Gilbert Strang')"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={addBook}
            disabled={!newBook.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>

      {books.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-gray-600 mb-3">
            Books are ordered by priority (drag to reorder):
          </p>
          {books.map((book, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-2 text-gray-400">
                <GripVertical className="w-4 h-4 cursor-move" />
                <span className="text-sm font-medium">#{index + 1}</span>
              </div>
              
              <div className="flex-1">
                <p className="text-gray-800">{book}</p>
              </div>
              
              <button
                onClick={() => removeBook(index)}
                className="p-1 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {books.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No reference books added yet.</p>
          <p className="text-sm">Add books to improve the quality of generated notes.</p>
        </div>
      )}
    </div>
  )
}