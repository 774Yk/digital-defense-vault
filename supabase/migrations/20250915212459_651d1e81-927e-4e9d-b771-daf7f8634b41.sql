-- Only fix the files table policies that don't exist
-- First check if we need to create any policies for files table
DO $$
BEGIN
  -- Drop existing policies if they exist to ensure clean state
  BEGIN
    DROP POLICY "Users can view active files" ON files;
  EXCEPTION
    WHEN undefined_object THEN NULL;
  END;
  
  BEGIN
    DROP POLICY "Admins can manage files" ON files;
  EXCEPTION
    WHEN undefined_object THEN NULL;
  END;
  
  BEGIN
    DROP POLICY "Authenticated users can upload files" ON files;
  EXCEPTION
    WHEN undefined_object THEN NULL;
  END;
  
  BEGIN
    DROP POLICY "Users can manage their own files" ON files;
  EXCEPTION
    WHEN undefined_object THEN NULL;
  END;
  
  BEGIN
    DROP POLICY "Anyone can view active files" ON files;
  EXCEPTION
    WHEN undefined_object THEN NULL;
  END;
  
  BEGIN
    DROP POLICY "Admins can manage all files" ON files;
  EXCEPTION
    WHEN undefined_object THEN NULL;
  END;
END $$;

-- Create fresh policies for files
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