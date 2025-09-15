-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  role TEXT NOT NULL DEFAULT 'User' CHECK (role IN ('SuperAdmin', 'Admin', 'Editor', 'User')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  two_fa_secret TEXT,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create courses table
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  language TEXT NOT NULL DEFAULT 'EN',
  level TEXT NOT NULL CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
  cover_image_url TEXT,
  tags TEXT[] DEFAULT '{}',
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create lessons table
CREATE TABLE public.lessons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content_html TEXT,
  video_url TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tools table
CREATE TABLE public.tools (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  source_type TEXT NOT NULL CHECK (source_type IN ('github', 'local')),
  github_repo_url TEXT,
  version TEXT,
  is_downloadable BOOLEAN NOT NULL DEFAULT true,
  tags TEXT[] DEFAULT '{}',
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create files table
CREATE TABLE public.files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  source TEXT NOT NULL CHECK (source IN ('uploaded', 'github_release')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create vulnerabilities table
CREATE TABLE public.vulnerabilities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('XSS', 'XXE', 'SQLi', 'PathTraversal', 'InfoDisclosure', 'CSRF', 'RCE')),
  severity TEXT NOT NULL CHECK (severity IN ('Low', 'Medium', 'High', 'Critical')),
  description_html TEXT,
  proof_of_concept_html TEXT,
  remediation_html TEXT,
  tags TEXT[] DEFAULT '{}',
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create dos_articles table
CREATE TABLE public.dos_articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content_html TEXT,
  legal_note_html TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create settings table
CREATE TABLE public.settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  site_title TEXT NOT NULL DEFAULT 'CyberSec Platform',
  logo_url TEXT,
  primary_color TEXT NOT NULL DEFAULT '#00ff88',
  secondary_color TEXT NOT NULL DEFAULT '#0088ff',
  contact_email TEXT NOT NULL DEFAULT 'Yassenalhajere@gmail.com',
  social_links JSONB DEFAULT '{}',
  download_policy BOOLEAN NOT NULL DEFAULT true,
  default_language TEXT NOT NULL DEFAULT 'EN',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create audit_logs table
CREATE TABLE public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vulnerabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dos_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() 
      AND role IN ('SuperAdmin', 'Admin')
    )
  );

-- RLS Policies for public content (courses, tools, vulnerabilities, dos_articles)
CREATE POLICY "Anyone can view published courses" ON public.courses
  FOR SELECT USING (is_published = true);

CREATE POLICY "Creators and admins can manage courses" ON public.courses
  FOR ALL USING (
    auth.uid() = created_by OR
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() 
      AND role IN ('SuperAdmin', 'Admin', 'Editor')
    )
  );

CREATE POLICY "Anyone can view lessons of published courses" ON public.lessons
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.courses 
      WHERE id = course_id AND is_published = true
    )
  );

CREATE POLICY "Creators and admins can manage lessons" ON public.lessons
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.courses 
      WHERE id = course_id AND created_by = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() 
      AND role IN ('SuperAdmin', 'Admin', 'Editor')
    )
  );

CREATE POLICY "Anyone can view downloadable tools" ON public.tools
  FOR SELECT USING (is_downloadable = true);

CREATE POLICY "Creators and admins can manage tools" ON public.tools
  FOR ALL USING (
    auth.uid() = created_by OR
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() 
      AND role IN ('SuperAdmin', 'Admin', 'Editor')
    )
  );

CREATE POLICY "Anyone can view vulnerabilities" ON public.vulnerabilities
  FOR SELECT USING (true);

CREATE POLICY "Creators and admins can manage vulnerabilities" ON public.vulnerabilities
  FOR ALL USING (
    auth.uid() = created_by OR
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() 
      AND role IN ('SuperAdmin', 'Admin', 'Editor')
    )
  );

CREATE POLICY "Anyone can view DOS articles" ON public.dos_articles
  FOR SELECT USING (true);

CREATE POLICY "Creators and admins can manage DOS articles" ON public.dos_articles
  FOR ALL USING (
    auth.uid() = created_by OR
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() 
      AND role IN ('SuperAdmin', 'Admin', 'Editor')
    )
  );

CREATE POLICY "Anyone can view settings" ON public.settings
  FOR SELECT USING (true);

CREATE POLICY "Only admins can update settings" ON public.settings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() 
      AND role IN ('SuperAdmin', 'Admin')
    )
  );

CREATE POLICY "Admins can view audit logs" ON public.audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() 
      AND role IN ('SuperAdmin', 'Admin')
    )
  );

CREATE POLICY "System can insert audit logs" ON public.audit_logs
  FOR INSERT WITH CHECK (true);

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at
  BEFORE UPDATE ON public.lessons
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tools_updated_at
  BEFORE UPDATE ON public.tools
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vulnerabilities_updated_at
  BEFORE UPDATE ON public.vulnerabilities
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_dos_articles_updated_at
  BEFORE UPDATE ON public.dos_articles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON public.settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, role)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email), 
    'User'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert default settings
INSERT INTO public.settings (site_title, contact_email, social_links) 
VALUES (
  'CyberSec Educational Platform',
  'Yassenalhajere@gmail.com',
  '{
    "twitter": "https://twitter.com",
    "instagram": "https://instagram.com", 
    "facebook": "https://facebook.com",
    "telegram": "https://telegram.org",
    "github": "https://github.com",
    "tryhackme": "https://tryhackme.com"
  }'::jsonb
);

-- Create indexes for better performance
CREATE INDEX idx_courses_slug ON public.courses(slug);
CREATE INDEX idx_courses_published ON public.courses(is_published);
CREATE INDEX idx_tools_slug ON public.tools(slug);
CREATE INDEX idx_vulnerabilities_slug ON public.vulnerabilities(slug);
CREATE INDEX idx_dos_articles_slug ON public.dos_articles(slug);
CREATE INDEX idx_lessons_course_id ON public.lessons(course_id);
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at);