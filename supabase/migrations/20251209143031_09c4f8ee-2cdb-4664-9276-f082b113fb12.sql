-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Policy for users to view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Create daily_menu_items table
CREATE TABLE public.daily_menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    available BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on daily_menu_items
ALTER TABLE public.daily_menu_items ENABLE ROW LEVEL SECURITY;

-- Anyone can read daily menu items (public)
CREATE POLICY "Anyone can view daily menu items"
ON public.daily_menu_items
FOR SELECT
USING (true);

-- Only admins can insert daily menu items
CREATE POLICY "Admins can insert daily menu items"
ON public.daily_menu_items
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can update daily menu items
CREATE POLICY "Admins can update daily menu items"
ON public.daily_menu_items
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete daily menu items
CREATE POLICY "Admins can delete daily menu items"
ON public.daily_menu_items
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Insert default menu items
INSERT INTO public.daily_menu_items (name, available, display_order) VALUES
('Tequeños', true, 1),
('Empanadas', true, 2),
('Milkshakes', true, 3),
('Chick-fil-A Items', true, 4);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_daily_menu_items_updated_at
BEFORE UPDATE ON public.daily_menu_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();