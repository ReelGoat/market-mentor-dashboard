
-- Add direction column to trades table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'trades' 
        AND column_name = 'direction'
    ) THEN
        ALTER TABLE public.trades ADD COLUMN direction text DEFAULT 'buy';
    END IF;
END $$;
