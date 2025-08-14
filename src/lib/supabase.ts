import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
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
      exam_topic_notes: {
        Row: {
          id: string
          exam_id: string | null
          topic_id: string | null
          notes: string | null
          book_references: string[] | null
          question_count: number | null
          created_at: string | null
          updated_at: string | null
        }
      }
    }
  }
}