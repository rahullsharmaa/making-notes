# AI Notes Generator

A comprehensive study notes generation system that creates exam-specific notes using AI, tailored for different entrance exams.

## Features

- **Exam-Specific Notes**: Generate notes tailored to specific entrance exams
- **Hierarchical Selection**: Choose from Exam → Course → Subject → Unit → Chapter → Topic
- **Book References**: Add reference books to improve note quality
- **Previous Year Questions**: Integrate related questions for better context
- **LaTeX Support**: Mathematical formulations with KaTeX rendering
- **Save & Manage**: Save and retrieve exam-specific notes

## Key Differences

### Exam-Specific Approach
- **Different Exams, Different Notes**: The same topic will have different notes for different exams (e.g., JEE vs NEET vs GATE)
- **Exam-Tailored Content**: Notes are generated considering the specific exam's syllabus, difficulty level, and question patterns
- **Separate Storage**: Notes are stored separately for each exam-topic combination

### Architecture
- **Database**: Uses Supabase for data storage with exam-specific note tables
- **AI Integration**: Gemini AI for intelligent note generation
- **Frontend**: React with TypeScript and Tailwind CSS

## Setup

1. **Environment Variables**: Copy `.env.example` to `.env` and fill in your credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

2. **Database Setup**: Run the migrations in your Supabase project

3. **Install Dependencies**: `npm install`

4. **Start Development**: `npm run dev`

## Usage

1. **Select Hierarchy**: Choose your exam, course, subject, unit, chapter, and topic
2. **Add Books**: Add reference books relevant to your exam
3. **Generate Notes**: Click generate to create exam-specific notes
4. **Save & Review**: Save notes and switch between preview and LaTeX code view

## Database Schema

- `exams`: Different entrance exams
- `courses`: Courses for each exam
- `subjects`: Subjects within courses
- `units`: Units within subjects
- `chapters`: Chapters within units
- `topics`: Topics within chapters
- `exam_topic_notes`: Exam-specific notes for each topic
- `questions_topic_wise`: Related questions for context

## Technologies

- React + TypeScript
- Tailwind CSS
- Supabase (Database)
- Gemini AI (Note Generation)
- KaTeX (Math Rendering)