-- Create store settings table
CREATE TABLE public.store_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  is_closed boolean NOT NULL DEFAULT false,
  closed_message text DEFAULT 'We are closed',
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can view settings
CREATE POLICY "Anyone can view store settings"
ON public.store_settings
FOR SELECT
USING (true);

-- Only staff/admins can update
CREATE POLICY "Staff and admins can update store settings"
ON public.store_settings
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'staff'::app_role));

-- Insert default row
INSERT INTO public.store_settings (is_closed) VALUES (false);