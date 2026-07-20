
-- Portfolio projects
CREATE TABLE public.portfolio_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  client text,
  service text,
  location text,
  completion_date date,
  description text,
  cover_image_path text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.portfolio_projects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.portfolio_projects TO authenticated;
GRANT ALL ON public.portfolio_projects TO service_role;
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view projects" ON public.portfolio_projects FOR SELECT USING (true);
CREATE POLICY "Admins insert projects" ON public.portfolio_projects FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update projects" ON public.portfolio_projects FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete projects" ON public.portfolio_projects FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Portfolio project images
CREATE TABLE public.portfolio_project_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.portfolio_projects(id) ON DELETE CASCADE,
  storage_path text NOT NULL,
  caption text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.portfolio_project_images TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.portfolio_project_images TO authenticated;
GRANT ALL ON public.portfolio_project_images TO service_role;
ALTER TABLE public.portfolio_project_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view project images" ON public.portfolio_project_images FOR SELECT USING (true);
CREATE POLICY "Admins insert project images" ON public.portfolio_project_images FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update project images" ON public.portfolio_project_images FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete project images" ON public.portfolio_project_images FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

CREATE INDEX portfolio_project_images_project_id_idx ON public.portfolio_project_images (project_id, sort_order);

-- Contact submissions: reply fields + admin update policy
ALTER TABLE public.contact_submissions
  ADD COLUMN IF NOT EXISTS admin_reply text,
  ADD COLUMN IF NOT EXISTS replied_at timestamptz,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'new';

CREATE POLICY "Admins update submissions" ON public.contact_submissions FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- updated_at trigger (shared)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS update_portfolio_projects_updated_at ON public.portfolio_projects;
CREATE TRIGGER update_portfolio_projects_updated_at
  BEFORE UPDATE ON public.portfolio_projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-grant admin to the owner's email on signup
CREATE OR REPLACE FUNCTION public.grant_admin_to_owner()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF lower(NEW.email) = 'roaheedahashiru321@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_grant_admin ON auth.users;
CREATE TRIGGER on_auth_user_grant_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.grant_admin_to_owner();

-- Backfill if the account already exists
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE lower(email) = 'roaheedahashiru321@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;
