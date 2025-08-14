@@ .. @@
   const [loading, setLoading] = useState(false)
+  const [error, setError] = useState<string | null>(null)

   useEffect(() => {
@@ .. @@
   const loadExams = async () => {
+    setLoading(true)
+    setError(null)
     try {
       const { data: exams, error } = await supabase
         .from('exams')
@@ .. @@
       if (error) throw error
       setData(prev => ({ ...prev, exams: exams || [] }))
     } catch (error) {
       console.error('Error loading exams:', error)
+      setError('Failed to load exams. Please check your connection.')
+    } finally {
+      setLoading(false)
     }
   }

   const loadCourses = async (examId: string) => {
+    setLoading(true)
     try {
       const { data: courses, error } = await supabase
@@ .. @@
       setData(prev => ({ ...prev, courses: courses || [] }))
     } catch (error) {
       console.error('Error loading courses:', error)
+      setError('Failed to load courses.')
+    } finally {
+      setLoading(false)
     }
   }

   const loadSubjects = async (courseId: string) => {
+    setLoading(true)
     try {
       const { data: subjects, error } = await supabase
@@ .. @@
       setData(prev => ({ ...prev, subjects: subjects || [] }))
     } catch (error) {
       console.error('Error loading subjects:', error)
+      setError('Failed to load subjects.')
+    } finally {
+      setLoading(false)
     }
   }

   const loadUnits = async (subjectId: string) => {
+    setLoading(true)
     try {
       const { data: units, error } = await supabase
@@ .. @@
       setData(prev => ({ ...prev, units: units || [] }))
     } catch (error) {
       console.error('Error loading units:', error)
+      setError('Failed to load units.')
+    } finally {
+      setLoading(false)
     }
   }

   const loadChapters = async (unitId: string) => {
+    setLoading(true)
     try {
       const { data: chapters, error } = await supabase
@@ .. @@
       setData(prev => ({ ...prev, chapters: chapters || [] }))
     } catch (error) {
       console.error('Error loading chapters:', error)
+      setError('Failed to load chapters.')
+    } finally {
+      setLoading(false)
     }
   }

   const loadTopics = async (chapterId: string) => {
+    setLoading(true)
     try {
       const { data: topics, error } = await supabase
@@ .. @@
       setData(prev => ({ ...prev, topics: topics || [] }))
     } catch (error) {
       console.error('Error loading topics:', error)
+      setError('Failed to load topics.')
+    } finally {
+      setLoading(false)
     }
   }
@@ .. @@
   return (
     <div className="bg-white p-6 rounded-lg shadow-lg">
       <h2 className="text-2xl font-bold text-gray-800 mb-6">Select Hierarchy</h2>
+      
+      {error && (
+        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
+          <p className="text-red-700">{error}</p>
+          <button 
+            onClick={() => {
+              setError(null)
+              loadExams()
+            }}
+            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
+          >
+            Try again
+          </button>
+        </div>
+      )}
       
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
+        {loading && (
+          <div className="col-span-full flex items-center justify-center py-4">
+            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
+            <span className="ml-2 text-gray-600">Loading...</span>
+          </div>
+        )}
+        
         <SelectDropdown
@@ .. @@
           disabled={!selected.chapter}
         />
       </div>