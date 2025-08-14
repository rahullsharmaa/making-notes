@@ .. @@
           <input
             type="text"
             value={newBook}
             onChange={(e) => setNewBook(e.target.value)}
             onKeyPress={handleKeyPress}
-            placeholder="Enter book name (e.g., 'Linear Algebra by Gilbert Strang')"
+            placeholder="Enter book name with author (e.g., 'Concepts of Physics by H.C. Verma')"
             className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
           />
@@ .. @@
       {books.length === 0 && (
         <div className="text-center py-8 text-gray-500">
-          <p>No reference books added yet.</p>
-          <p className="text-sm">Add books to improve the quality of generated notes.</p>
+          <p className="mb-2">📚 No reference books added yet.</p>
+          <p className="text-sm mb-4">Add standard books for your exam to get high-quality, exam-specific notes.</p>
+          <div className="text-xs text-gray-400 space-y-1">
+            <p><strong>Examples:</strong></p>
+            <p>• "Physics by Resnick, Halliday & Krane"</p>
+            <p>• "Organic Chemistry by Morrison & Boyd"</p>
+            <p>• "Mathematics by R.D. Sharma"</p>
+          </div>
         </div>
       )}
     </div>