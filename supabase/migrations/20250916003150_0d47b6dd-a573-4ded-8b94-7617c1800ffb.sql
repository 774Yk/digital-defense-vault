-- Update the user's role to SuperAdmin to have full access
UPDATE profiles 
SET role = 'SuperAdmin', updated_at = now()
WHERE user_id = '794a8cea-0d45-42af-800d-b62ac06d1df8';

-- Create a function to promote users to admin roles
CREATE OR REPLACE FUNCTION public.promote_user_role(target_email text, new_role text)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE profiles 
  SET role = new_role, updated_at = now()
  FROM auth.users 
  WHERE profiles.user_id = auth.users.id 
  AND auth.users.email = target_email
  AND new_role IN ('User', 'Editor', 'Admin', 'SuperAdmin');
$$;

-- Create initial system settings record if it doesn't exist
INSERT INTO settings (
  site_title,
  contact_email,
  primary_color,
  secondary_color,
  default_language,
  download_policy,
  social_links
) VALUES (
  'CyberSec Platform',
  'admin@cybersec-platform.com',
  '#00ff88',
  '#0088ff',
  'EN',
  true,
  '{"github": "", "linkedin": "", "twitter": ""}'::jsonb
)
ON CONFLICT (id) DO NOTHING;