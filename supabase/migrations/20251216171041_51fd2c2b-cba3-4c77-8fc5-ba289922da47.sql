-- Add 'staff' role to the enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'staff';

-- Update the trigger function to also assign staff role to the new emails
CREATE OR REPLACE FUNCTION public.handle_new_user_admin_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if the new user's email is in the admin list
  IF NEW.email IN ('clope063@mater.colegia.org', 'nlove001@mater.colegia.org') THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  -- Check if the new user's email is in the staff list
  ELSIF NEW.email IN (
    'mveit001@mater.colegia.org',
    'tdiaz006@mater.colegia.org',
    'cagui026@mater.colegia.org',
    'mavil017@mater.colegia.org',
    'lkirb004@mater.colegia.org',
    'drold001@mater.colegia.org'
  ) THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'staff')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;