@@ .. @@
   const generateNotes = async () => {
-    if (!selected.topic || !selected.exam || !selected.course || !selected.chapter) {
+    if (!selected.topic || !selected.exam || !selected.course || !selected.subject || !selected.unit || !selected.chapter) {
       return
    if (!selected.topic || !selected.exam || !notes.trim()) return
    if (!selected.topic || !selected.exam) return
     setLoading(true)
     try {
       const generatedNotes = await generateTopicNotes({
         topicName: selected.topic.name,
      // First try to get exam-specific notes
      const { data: examNotes, error: examError } = await supabase
        .from('exam_topic_notes')
        .select('notes, book_references, question_count')
        .eq('exam_id', selected.exam.id)
        .eq('topic_id', selected.topic.id)
         chapterName: selected.chapter.name,
         bookReferences: books,
      if (examNotes && examNotes.notes) {
        setExistingNotes(examNotes.notes)
        setNotes(examNotes.notes)
        return
      // Save as exam-specific notes
      const { error } = await supabase
        .from('exam_topic_notes')
        .upsert({ 
          exam_id: selected.exam.id,
          topic_id: selected.topic.id,
          notes: notes.trim(),
          book_references: books,
          question_count: relatedQuestions.length,
          updated_at: new Date().toISOString()
        .select('notes')
        .single()
       })
      const existingNotesContent = topicNotes?.notes || ''
       setNotes(generatedNotes)
       setViewMode('preview')
     } catch (error) {
       console.error('Error generating notes:', error)
       const errorMessage = error instanceof Error ? error.message : 'Failed to generate notes. Please try again.'
-      alert(errorMessage)
+      setNotes(`Error: ${errorMessage}`)
     } finally {
       setLoading(false)
     }
   }
@@ .. @@
   const canGenerate = selected.topic && books.length > 0
   const hasChanges = notes !== existingNotes
+  const isComplete = selected.exam && selected.course && selected.subject && selected.unit && selected.chapter && selected.topic

   return (
@@ .. @@
         {selected.topic ? (
           <div className="space-y-4">
             <div className="bg-blue-50 p-4 rounded-lg">
-              <h3 className="font-semibold text-blue-800 mb-2">Current Topic:</h3>
-              <p className="text-blue-700">{selected.topic.name}</p>
+              <h3 className="font-semibold text-blue-800 mb-2">Selected Hierarchy:</h3>
+              <div className="text-blue-700 space-y-1">
+                <p><strong>Exam:</strong> {selected.exam?.name || 'Not selected'}</p>
+                <p><strong>Course:</strong> {selected.course?.name || 'Not selected'}</p>
+                <p><strong>Subject:</strong> {selected.subject?.name || 'Not selected'}</p>
+                <p><strong>Unit:</strong> {selected.unit?.name || 'Not selected'}</p>
+                <p><strong>Chapter:</strong> {selected.chapter?.name || 'Not selected'}</p>
+                <p><strong>Topic:</strong> {selected.topic?.name || 'Not selected'}</p>
+              </div>
               {relatedQuestions.length > 0 && (
                 <p className="text-sm text-blue-600 mt-1">
                   {relatedQuestions.length} related questions found
                 </p>
               )}
+              {!isComplete && (
+                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
+                  <p className="text-yellow-800 text-sm">
+                    ⚠️ Complete hierarchy selection required for exam-specific notes
+                  </p>
+                </div>
+              )}
             </div>

+            {books.length > 0 && (
+              <div className="bg-green-50 p-4 rounded-lg">
+                <h4 className="font-semibold text-green-800 mb-2">Reference Books ({books.length}):</h4>
+                <ul className="text-green-700 text-sm space-y-1">
+                  {books.slice(0, 3).map((book, index) => (
+                    <li key={index}>• {book}</li>
+                  ))}
+                  {books.length > 3 && (
+                    <li className="text-green-600">... and {books.length - 3} more</li>
+                  )}
+                </ul>
+              </div>
+            )}
+
             <button
               onClick={generateNotes}
-              disabled={!canGenerate || loading}
+              disabled={!canGenerate || !isComplete || loading}
               className={`w-full py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
-                canGenerate && !loading
+                canGenerate && isComplete && !loading
                   ? 'bg-blue-600 text-white hover:bg-blue-700'
                   : 'bg-gray-300 text-gray-500 cursor-not-allowed'
               }`}
@@ .. @@
               )}
             </button>

-            {!canGenerate && (
+            {(!canGenerate || !isComplete) && (
               <p className="text-sm text-gray-600 text-center">
-                Please add at least one reference book to generate notes.
+                {!isComplete 
+                  ? 'Please complete the full hierarchy selection.'
+                  : 'Please add at least one reference book to generate notes.'
+                }
               </p>
             )}
           </div>
@@ .. @@
       {notes && (
         <div className="p-6">
+          {notes.startsWith('Error:') ? (
+            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
+              <h3 className="text-red-800 font-semibold mb-2">Generation Error</h3>
+              <p className="text-red-700">{notes}</p>
+              <button
+                onClick={generateNotes}
+                className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
+              >
+                Try Again
+              </button>
+            </div>
+          ) : (
           {viewMode === 'preview' ? (
             <div className="prose prose-lg max-w-none">
               <div className="bg-gray-50 p-6 rounded-lg border">
@@ .. @@
               </pre>
             </div>
           )}
+          )}
         </div>
       )}
     </div>