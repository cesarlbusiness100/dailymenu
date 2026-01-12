-- Drop and recreate the trigger function to include all allowed emails
CREATE OR REPLACE FUNCTION public.handle_new_user_admin_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Assign admin role to primary admin emails
  IF NEW.email IN ('clope063@mater.colegia.org', 'nlove001@mater.colegia.org', 'yalvarez@materbrickell.com') THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  -- Assign staff role to all other allowed staff emails
  ELSIF NEW.email IN ('mveit001@mater.colegia.org', 'tdiaz006@mater.colegia.org', 'cagui026@mater.colegia.org', 'mavil017@mater.colegia.org', 'lkirb004@mater.colegia.org', 'drold001@mater.colegia.org') THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'staff')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

-- Ensure the trigger exists (recreate if needed)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_admin_role();