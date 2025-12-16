-- Drop existing admin-only policies
DROP POLICY IF EXISTS "Admins can delete daily menu items" ON public.daily_menu_items;
DROP POLICY IF EXISTS "Admins can insert daily menu items" ON public.daily_menu_items;
DROP POLICY IF EXISTS "Admins can update daily menu items" ON public.daily_menu_items;

-- Create new policies that allow both admin and staff
CREATE POLICY "Staff and admins can delete daily menu items"
ON public.daily_menu_items
FOR DELETE
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'staff'));

CREATE POLICY "Staff and admins can insert daily menu items"
ON public.daily_menu_items
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'staff'));

CREATE POLICY "Staff and admins can update daily menu items"
ON public.daily_menu_items
FOR UPDATE
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'staff'));