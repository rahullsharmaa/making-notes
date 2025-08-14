import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { generateTopicNotes } from '../lib/gemini'
import { FileText, Loader, Eye, Code, Save, RefreshCw } from 'lucide-react'
import 'katex/dist/katex.min.css'
import { InlineMath, BlockMath } from 'react-katex'

interface SelectedItems {
  exam: { id: string; name: string } | null
  course: { id: string; name: string } | null
  subject: { id: string; name: string } | null
  unit: { id: string; name: string } | null
  chapter: { id: string; name: string } | null
  topic: { id: string; name: string } | null
}

interface NotesGeneratorProps {
  selected: SelectedItems
  books: string[]
}

export default function NotesGenerator({ selected, books }: NotesGeneratorProps) {
  const [loading, setLoading] = useState(false)
  const [notes, setNotes] = useState('')
  const [existingNotes, setExistingNotes] = useState('')
  const [relatedQuestions, setRelatedQuestions] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  useEffect(() => {
    if (selected.topic) {
      loadExistingNotes()
      loadRelatedQuestions()
    }
  }, [selected.topic])

  const loadExistingNotes = async () => {
    if (!selected.topic) return

    try {
      const { data, error } = await supabase
        .from('topics')
        .select('notes')
        .eq('id', selected.topic.id)
        .single()

      if (error) throw error
      
      const existingNotesContent = data?.notes || ''
      setExistingNotes(existingNotesContent)
      setNotes(existingNotesContent)
    } catch (error) {
      console.error('Error loading existing notes:', error)
    }
  }

  const loadRelatedQuestions = async () => {
    if (!selected.topic) return

    try {
      const { data, error } = await supabase
        .from('questions_topic_wise')
        .select('question_statement')
        .eq('topic_id', selected.topic.id)
        .not('question_statement', 'is', null)

      if (error) throw error
      
      const questions = data?.map(q => q.question_statement).filter(Boolean) || []
      setRelatedQuestions(questions)
    } catch (error) {
      console.error('Error loading related questions:', error)
    }
  }

  const generateNotes = async () => {
    if (!selected.topic || !selected.exam || !selected.course || !selected.chapter) {
      return
    }

    setLoading(true)
    try {
      const generatedNotes = await generateTopicNotes({
        topicName: selected.topic.name,
        examName: selected.exam.name,
        courseName: selected.course.name,
        chapterName: selected.chapter.name,
        bookReferences: books,
        relatedQuestions: relatedQuestions
      })

      setNotes(generatedNotes)
      setViewMode('preview')
    } catch (error) {
      console.error('Error generating notes:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate notes. Please try again.'
      alert(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const saveNotes = async () => {
    if (!selected.topic || !notes.trim()) return

    setSaveStatus('saving')
    try {
      const { error } = await supabase
        .from('topics')
        .update({ 
          notes: notes.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', selected.topic.id)

      if (error) throw error
      
      setSaveStatus('saved')
      setExistingNotes(notes)
      setTimeout(() => setSaveStatus('idle'), 2000)
    } catch (error) {
      console.error('Error saving notes:', error)
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 2000)
    }
  }

  const renderLatex = (content: string) => {
    if (!content) return null

    // Split content by display math blocks
    const parts = content.split(/(\\\[[\s\S]*?\\\])/g)
    
    return parts.map((part, index) => {
      if (part.match(/^\\\[[\s\S]*?\\\]$/)) {
        // Display math block
        const mathContent = part.slice(2, -2) // Remove \[ and \]
        try {
          return <BlockMath key={index} math={mathContent} />
        } catch (error) {
          return <div key={index} className="text-red-500 bg-red-50 p-2 rounded">Error rendering: {part}</div>
        }
      } else {
        // Regular text with possible inline math
        const inlineParts = part.split(/(\\\([\s\S]*?\\\))/g)
        return inlineParts.map((inlinePart, inlineIndex) => {
          if (inlinePart.match(/^\\\([\s\S]*?\\\)$/)) {
            // Inline math
            const mathContent = inlinePart.slice(2, -2) // Remove \( and \)
            try {
              return <InlineMath key={`${index}-${inlineIndex}`} math={mathContent} />
            } catch (error) {
              return <span key={`${index}-${inlineIndex}`} className="text-red-500">Error: {inlinePart}</span>
            }
          } else {
            // Regular text - render with basic formatting
            return (
              <span 
                key={`${index}-${inlineIndex}`}
                dangerouslySetInnerHTML={{
                  __html: inlinePart
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    .replace(/\n/g, '<br>')
                }}
              />
            )
          }
        })
      }
    })
  }

  const canGenerate = selected.topic && books.length > 0
  const hasChanges = notes !== existingNotes

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Notes Generator
          </h2>
          
          <div className="flex items-center gap-2">
            {notes && (
              <>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('preview')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      viewMode === 'preview' 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <Eye className="w-4 h-4 inline mr-1" />
                    Preview
                  </button>
                  <button
                    onClick={() => setViewMode('code')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      viewMode === 'code' 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <Code className="w-4 h-4 inline mr-1" />
                    LaTeX Code
                  </button>
                </div>
                
                <button
                  onClick={saveNotes}
                  disabled={!hasChanges || saveStatus === 'saving'}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                    hasChanges
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {saveStatus === 'saving' ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {saveStatus === 'saving' ? 'Saving...' : 
                   saveStatus === 'saved' ? 'Saved!' :
                   saveStatus === 'error' ? 'Error!' : 'Save Notes'}
                </button>
              </>
            )}
          </div>
        </div>

        {selected.topic ? (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Current Topic:</h3>
              <p className="text-blue-700">{selected.topic.name}</p>
              {relatedQuestions.length > 0 && (
                <p className="text-sm text-blue-600 mt-1">
                  {relatedQuestions.length} related questions found
                </p>
              )}
            </div>

            <button
              onClick={generateNotes}
              disabled={!canGenerate || loading}
              className={`w-full py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                canGenerate && !loading
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Generating Notes...
                </>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5" />
                  {existingNotes ? 'Regenerate Notes' : 'Generate Notes'}
                </>
              )}
            </button>

            {!canGenerate && (
              <p className="text-sm text-gray-600 text-center">
                Please add at least one reference book to generate notes.
              </p>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Please select a topic to generate notes.</p>
          </div>
        )}
      </div>

      {notes && (
        <div className="p-6">
          {viewMode === 'preview' ? (
            <div className="prose prose-lg max-w-none">
              <div className="bg-gray-50 p-6 rounded-lg border">
                <div className="rendered-latex">
                  {renderLatex(notes)}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto">
              <pre className="whitespace-pre-wrap text-sm">
                <code>{notes}</code>
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}