import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      exams: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string | null
          updated_at: string | null
        }
      }
      courses: {
        Row: {
          id: string
          exam_id: string | null
          name: string
          description: string | null
          created_at: string | null
          updated_at: string | null
        }
      }
      subjects: {
        Row: {
          id: string
          course_id: string | null
          name: string
          description: string | null
          created_at: string | null
          updated_at: string | null
        }
      }
      units: {
        Row: {
          id: string
          subject_id: string | null
          name: string
          description: string | null
          created_at: string | null
          updated_at: string | null
        }
      }
      chapters: {
        Row: {
          id: string
          unit_id: string | null
          course_id: string | null
          name: string
          description: string | null
          notes: string | null
          created_at: string | null
          updated_at: string | null
        }
      }
      topics: {
        Row: {
          id: string
          chapter_id: string | null
          name: string
          description: string | null
          notes: string | null
          created_at: string | null
          updated_at: string | null
        }
      }
      questions_topic_wise: {
        Row: {
          id: string
          question_id: string | null
          topic_id: string | null
          topic_name: string | null
          question_statement: string | null
          options: string[] | null
          is_primary: boolean | null
          confidence_score: number | null
          created_at: string | null
          updated_at: string | null
        }
      }
    }
  }
}