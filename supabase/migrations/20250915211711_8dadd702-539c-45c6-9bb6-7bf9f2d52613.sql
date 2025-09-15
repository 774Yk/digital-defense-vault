-- Fix infinite recursion in profiles RLS policies
-- Drop all existing policies on profiles
DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- Create a security definer function to check admin roles safely
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('SuperAdmin', 'Admin')
  );
$$;

-- Create proper RLS policies without recursion
CREATE POLICY "Users can view their own profile" 
ON profiles FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON profiles FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id);

-- Admin policy using the security definer function
CREATE POLICY "Admins can manage all profiles" 
ON profiles FOR ALL 
TO authenticated 
USING (public.is_admin());

-- Fix RLS policies for files table to prevent similar issues
DROP POLICY IF EXISTS "Users can view active files" ON files;
DROP POLICY IF EXISTS "Admins can manage files" ON files;
DROP POLICY IF EXISTS "Authenticated users can upload files" ON files;

CREATE POLICY "Anyone can view active files" 
ON files FOR SELECT 
USING (is_active = true);

CREATE POLICY "Users can manage their own files" 
ON files FOR ALL 
TO authenticated 
USING (auth.uid() = uploaded_by);

CREATE POLICY "Admins can manage all files" 
ON files FOR ALL 
TO authenticated 
USING (public.is_admin());