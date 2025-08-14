/*
  # Add notes column to chapters table

  1. Changes
    - Add `notes` column to `chapters` table to store merged chapter notes
    - Column allows NULL values initially for existing chapters
    - Uses TEXT type to accommodate large merged note content

  2. Security
    - No changes to existing RLS policies
    - Column inherits existing table permissions
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chapters' AND column_name = 'notes'
  ) THEN
    ALTER TABLE chapters ADD COLUMN notes TEXT;
  END IF;
END $$;