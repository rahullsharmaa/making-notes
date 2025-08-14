const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'

export interface GenerateNotesRequest {
  topicName: string
  examName: string
  courseName: string
  chapterName: string
  bookReferences: string[]
  relatedQuestions: string[]
}

export async function generateTopicNotes(request: GenerateNotesRequest): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file.')
  }

  const prompt = `
Generate comprehensive study notes for the following topic in LaTeX format suitable for KaTeX rendering:

**Topic**: ${request.topicName}
**Exam**: ${request.examName}
**Course**: ${request.courseName}
**Chapter**: ${request.chapterName}

**Reference Books**: ${request.bookReferences.join(', ')}

**Related Questions**: 
${request.relatedQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}

Please generate detailed notes that:
1. Cover all fundamental concepts related to this topic
2. Include mathematical formulations using LaTeX syntax (use \\( \\) for inline math and \\[ \\] for display math)
3. Provide clear explanations suitable for ${request.courseName} level
4. Reference the provided books where applicable
5. Include examples and problem-solving approaches based on the related questions
6. Use proper LaTeX formatting for mathematical expressions, equations, and symbols
7. Structure the content with clear headings and subheadings
8. Include key theorems, definitions, and important results

Format the response as clean LaTeX code that can be rendered with KaTeX. Use proper mathematical notation and ensure all LaTeX commands are KaTeX-compatible.

Start with a title and organize the content logically with sections and subsections.
`

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        }
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Gemini API error response:', errorText)
      throw new Error(`Gemini API error: ${response.status} - ${response.statusText}`)
    }

    const data = await response.json()
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      console.error('Invalid Gemini API response:', data)
      throw new Error('Invalid response from Gemini API. Please check your API key and try again.')
    }

    return data.candidates[0].content.parts[0].text
  } catch (error) {
    console.error('Error generating notes:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to generate notes. Please try again.')
  }
}