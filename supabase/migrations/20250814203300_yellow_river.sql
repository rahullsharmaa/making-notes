/*
  # Add exam-specific notes storage

  1. New Tables
    - `exam_topic_notes` - Store notes specific to exam-topic combinations
      - `id` (uuid, primary key)
      - `exam_id` (uuid, foreign key to exams)
      - `topic_id` (uuid, foreign key to topics)
      - `notes` (text, LaTeX formatted notes)
      - `book_references` (text array, list of books used)
      - `question_count` (integer, number of related questions)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `exam_topic_notes` table
    - Add policies for authenticated users to manage their notes

  3. Indexes
    - Add indexes for efficient querying by exam_id and topic_id
*/

CREATE TABLE IF NOT EXISTS exam_topic_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id uuid REFERENCES exams(id) ON DELETE CASCADE,
  topic_id uuid REFERENCES topics(id) ON DELETE CASCADE,
  notes text,
  book_references text[] DEFAULT '{}',
  question_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(exam_id, topic_id)
);

ALTER TABLE exam_topic_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read exam topic notes"
  ON exam_topic_notes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert exam topic notes"
  ON exam_topic_notes
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update exam topic notes"
  ON exam_topic_notes
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete exam topic notes"
  ON exam_topic_notes
  FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_exam_topic_notes_exam_id ON exam_topic_notes(exam_id);
CREATE INDEX IF NOT EXISTS idx_exam_topic_notes_topic_id ON exam_topic_notes(topic_id);
CREATE INDEX IF NOT EXISTS idx_exam_topic_notes_updated_at ON exam_topic_notes(updated_at);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_exam_topic_notes_updated_at
  BEFORE UPDATE ON exam_topic_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();