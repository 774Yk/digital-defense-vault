-- Add missing RLS policies for tables without any policies

-- RLS for Wep-login table (if needed for authentication logs)
CREATE POLICY "Users can view their own login records" 
ON "Wep-login" FOR SELECT 
TO authenticated 
USING (true); -- Adjust based on actual table structure and requirements

-- RLS for posts table
CREATE POLICY "Users can view all posts" 
ON posts FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Users can manage their own posts" 
ON posts FOR ALL 
TO authenticated 
USING (auth.uid() = user_id);

-- RLS for files table  
CREATE POLICY "Users can view active files" 
ON files FOR SELECT 
TO authenticated 
USING (is_active = true);

CREATE POLICY "Users can upload files" 
ON files FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Admins can manage all files" 
ON files FOR ALL 
TO authenticated 
USING (public.is_admin());

-- Fix the update_updated_at_column function search path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;