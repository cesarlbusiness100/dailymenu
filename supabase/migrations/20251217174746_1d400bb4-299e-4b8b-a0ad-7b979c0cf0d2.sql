-- Add column to track if item is shown on today's daily menu
ALTER TABLE public.daily_menu_items 
ADD COLUMN on_daily_menu boolean NOT NULL DEFAULT false;

-- Set existing available items to be on the daily menu
UPDATE public.daily_menu_items SET on_daily_menu = true WHERE available = true;