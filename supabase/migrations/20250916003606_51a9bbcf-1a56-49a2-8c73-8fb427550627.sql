-- Create RPC function to get user emails (admin only)
CREATE OR REPLACE FUNCTION public.get_user_emails()
RETURNS TABLE(id uuid, email text)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT auth.users.id, auth.users.email
  FROM auth.users
  WHERE EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role IN ('SuperAdmin', 'Admin')
  );
$$;