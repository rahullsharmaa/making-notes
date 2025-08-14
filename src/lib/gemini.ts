@@ .. @@
 export interface GenerateNotesRequest {
   topicName: string
   examName: string
   courseName: string
+  subjectName: string
+  unitName: string
   chapterName: string
   bookReferences: string[]
   relatedQuestions: string[]
 }

 export async function generateTopicNotes(request: GenerateNotesRequest): Promise<string> {
@@ .. @@
   const prompt = `
-Generate comprehensive study notes for the following topic in LaTeX format suitable for KaTeX rendering:
+Generate comprehensive, exam-specific study notes for the following topic in LaTeX format suitable for KaTeX rendering:

 **Topic**: ${request.topicName}
 **Exam**: ${request.examName}
 **Course**: ${request.courseName}
+**Subject**: ${request.subjectName}
+**Unit**: ${request.unitName}
 **Chapter**: ${request.chapterName}

 **Reference Books**: ${request.bookReferences.join(', ')}

 **Related Questions**: 
 ${request.relatedQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}

-Please generate detailed notes that:
-1. Cover all fundamental concepts related to this topic
-2. Include mathematical formulations using LaTeX syntax (use \\( \\) for inline math and \\[ \\] for display math)
-3. Provide clear explanations suitable for ${request.courseName} level
-4. Reference the provided books where applicable
-5. Include examples and problem-solving approaches based on the related questions
-6. Use proper LaTeX formatting for mathematical expressions, equations, and symbols
-7. Structure the content with clear headings and subheadings
-8. Include key theorems, definitions, and important results
+IMPORTANT: Generate notes specifically tailored for the ${request.examName} entrance exam. Different exams have different syllabi, difficulty levels, and focus areas even for the same topic.

+Please generate detailed, exam-specific notes that:
+1. **Exam-Specific Focus**: Tailor content specifically for ${request.examName} exam pattern, difficulty level, and syllabus requirements
+2. **Comprehensive Coverage**: Cover all fundamental concepts related to this topic as per ${request.examName} syllabus
+3. **Mathematical Formulations**: Include mathematical formulations using LaTeX syntax (use \\( \\) for inline math and \\[ \\] for display math)
+4. **Appropriate Level**: Provide explanations suitable for ${request.examName} entrance exam level
+5. **Book References**: Reference the provided books where applicable, citing specific chapters or sections
+6. **Question-Based Learning**: Include examples and problem-solving approaches based on the related questions from ${request.examName}
+7. **Proper Formatting**: Use proper LaTeX formatting for mathematical expressions, equations, and symbols
+8. **Structured Content**: Structure with clear headings and subheadings
+9. **Key Elements**: Include key theorems, definitions, formulas, and important results specific to ${request.examName}
+10. **Exam Tips**: Add specific tips, shortcuts, and important points for ${request.examName} exam
+11. **Previous Year Insights**: If applicable, mention common question patterns from ${request.examName}

+Structure the notes as follows:
+\\section{${request.topicName}}
+
+\\subsection{Introduction}
+Brief introduction tailored for ${request.examName}
+
+\\subsection{Key Concepts}
+Fundamental concepts with exam-specific focus
+
+\\subsection{Important Formulas}
+All relevant formulas for ${request.examName}
+
+\\subsection{Theorems and Definitions}
+Key theorems and definitions
+
+\\subsection{Problem-Solving Techniques}
+Methods and shortcuts for ${request.examName}
+
+\\subsection{Practice Problems}
+Sample problems based on related questions
+
+\\subsection{Exam Tips}
+Specific tips for ${request.examName}

 Format the response as clean LaTeX code that can be rendered with KaTeX. Use proper mathematical notation and ensure all LaTeX commands are KaTeX-compatible.
-
-Start with a title and organize the content logically with sections and subsections.
 `

   try {
@@ .. @@
         generationConfig: {
           temperature: 0.7,
           topK: 40,
           topP: 0.95,
-          maxOutputTokens: 8192,
+          maxOutputTokens: 12000,
         }
       })