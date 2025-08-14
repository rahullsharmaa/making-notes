/*
  # Add notes column to topics table

  1. Changes
    - Add `notes` column to `topics` table to store generated LaTeX notes
    - Column allows NULL values initially for existing topics
    - Uses TEXT type to accommodate large note content

  2. Security
    - No changes to existing RLS policies
    - Column inherits existing table permissions
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'topics' AND column_name = 'notes'
  ) THEN
    ALTER TABLE topics ADD COLUMN notes TEXT;
  END IF;
END $$;