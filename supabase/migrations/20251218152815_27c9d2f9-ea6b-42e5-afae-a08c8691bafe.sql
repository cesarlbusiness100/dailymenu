-- Update the trigger function to include yalvarez@materbrickell.com as admin
CREATE OR REPLACE FUNCTION public.handle_new_user_admin_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only assign admin role to these specific emails
  IF NEW.email IN ('clope063@mater.colegia.org', 'nlove001@mater.colegia.org', 'yalvarez@materbrickell.com') THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;