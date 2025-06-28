/*
  # Initial Schema for WatchnLearn Admin System

  1. New Tables
    - `profiles` - User profiles extending Supabase auth
    - `schools` - Educational institutions
    - `subjects` - Academic subjects
    - `subject_teachers` - Teachers for each subject
    - `terms` - Academic terms within subjects
    - `weeks` - Weekly divisions within terms
    - `chapters` - Chapter organization within weeks
    - `content` - Educational content/topics
    - `content_views` - Content viewing tracking
    - `past_papers` - Examination papers
    - `past_paper_downloads` - Download tracking
    - `textbooks` - Textbook information
    - `textbook_authors` - Authors for textbooks
    - `syllabi` - Syllabus documents
    - `syllabus_papers` - Papers within syllabi
    - `syllabus_paper_topics` - Topics within syllabus papers
    - `user_enrollments` - User subject enrollments
    - `user_progress` - User learning progress
    - `system_settings` - System configuration
    - `audit_logs` - System audit trail
    - `analytics_events` - Analytics tracking

  2. Security
    - Enable RLS on all tables
    - Add policies for admin access
    - Add policies for user data access
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin', 'super_admin')),
  school_id UUID,
  level TEXT CHECK (level IN ('JC', 'O-Level', 'A-Level')),
  exam_board TEXT CHECK (exam_board IN ('ZIMSEC', 'Cambridge')),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Schools table
CREATE TABLE IF NOT EXISTS schools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  principal_name TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key constraint for profiles.school_id
ALTER TABLE profiles ADD CONSTRAINT profiles_school_id_fkey 
  FOREIGN KEY (school_id) REFERENCES schools(id);

-- Subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  level TEXT NOT NULL CHECK (level IN ('JC', 'O-Level', 'A-Level')),
  exam_board TEXT NOT NULL CHECK (exam_board IN ('ZIMSEC', 'Cambridge')),
  school_id UUID REFERENCES schools(id),
  icon TEXT DEFAULT 'BookOpen',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(name, level, exam_board, school_id)
);

-- Subject teachers table
CREATE TABLE IF NOT EXISTS subject_teachers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  qualification TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Terms table
CREATE TABLE IF NOT EXISTS terms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  order_number INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(subject_id, order_number)
);

-- Weeks table
CREATE TABLE IF NOT EXISTS weeks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  term_id UUID REFERENCES terms(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  order_number INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(term_id, order_number)
);

-- Chapters table
CREATE TABLE IF NOT EXISTS chapters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  week_id UUID REFERENCES weeks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_number INTEGER NOT NULL,
  is_continuation BOOLEAN DEFAULT false,
  original_chapter_id UUID REFERENCES chapters(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(week_id, order_number)
);

-- Content/Topics table
CREATE TABLE IF NOT EXISTS content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('video', 'pdf', 'quiz', 'notes')),
  description TEXT,
  file_url TEXT,
  file_size BIGINT,
  duration TEXT,
  estimated_study_time TEXT,
  order_number INTEGER NOT NULL,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'review', 'archived')),
  tags TEXT[] DEFAULT '{}',
  view_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(chapter_id, order_number)
);

-- Content views tracking
CREATE TABLE IF NOT EXISTS content_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id UUID REFERENCES content(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ DEFAULT NOW(),
  duration_watched INTEGER,
  completed BOOLEAN DEFAULT false
);

-- Past papers table
CREATE TABLE IF NOT EXISTS past_papers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject TEXT NOT NULL,
  year INTEGER NOT NULL,
  month TEXT NOT NULL,
  paper_type TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('JC', 'O-Level', 'A-Level')),
  exam_board TEXT NOT NULL CHECK (exam_board IN ('ZIMSEC', 'Cambridge')),
  duration_hours DECIMAL(3,1) NOT NULL,
  total_marks INTEGER NOT NULL,
  description TEXT,
  question_paper_url TEXT NOT NULL,
  marking_scheme_url TEXT,
  has_marking_scheme BOOLEAN DEFAULT false,
  file_size TEXT,
  download_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'review', 'archived')),
  uploaded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Past paper downloads tracking
CREATE TABLE IF NOT EXISTS past_paper_downloads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  past_paper_id UUID REFERENCES past_papers(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  file_type TEXT CHECK (file_type IN ('question_paper', 'marking_scheme')),
  downloaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Textbooks table
CREATE TABLE IF NOT EXISTS textbooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  publisher TEXT NOT NULL,
  edition TEXT,
  publication_year INTEGER NOT NULL,
  isbn TEXT,
  subject TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('JC', 'O-Level', 'A-Level')),
  exam_board TEXT NOT NULL CHECK (exam_board IN ('ZIMSEC', 'Cambridge')),
  description TEXT,
  cover_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Textbook authors table
CREATE TABLE IF NOT EXISTS textbook_authors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  textbook_id UUID REFERENCES textbooks(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  order_number INTEGER NOT NULL,
  UNIQUE(textbook_id, order_number)
);

-- Syllabi table
CREATE TABLE IF NOT EXISTS syllabi (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('JC', 'O-Level', 'A-Level')),
  exam_board TEXT NOT NULL CHECK (exam_board IN ('ZIMSEC', 'Cambridge')),
  year INTEGER NOT NULL,
  overview TEXT NOT NULL,
  total_topics INTEGER DEFAULT 0,
  syllabus_file_url TEXT,
  assessment_file_url TEXT,
  specimen_file_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(subject, level, exam_board, year)
);

-- Syllabus papers table
CREATE TABLE IF NOT EXISTS syllabus_papers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  syllabus_id UUID REFERENCES syllabi(id) ON DELETE CASCADE,
  paper_name TEXT NOT NULL,
  order_number INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(syllabus_id, order_number)
);

-- Syllabus paper topics table
CREATE TABLE IF NOT EXISTS syllabus_paper_topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  paper_id UUID REFERENCES syllabus_papers(id) ON DELETE CASCADE,
  topic_name TEXT NOT NULL,
  order_number INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(paper_id, order_number)
);

-- User subject enrollments
CREATE TABLE IF NOT EXISTS user_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  UNIQUE(user_id, subject_id)
);

-- User progress tracking
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content_id UUID REFERENCES content(id) ON DELETE CASCADE,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  completed_at TIMESTAMPTZ,
  last_accessed TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, content_id)
);

-- System settings table
CREATE TABLE IF NOT EXISTS system_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value JSONB,
  description TEXT,
  updated_by UUID REFERENCES profiles(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics events table
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  event_type TEXT NOT NULL,
  event_data JSONB,
  session_id TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE subject_teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE weeks ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE past_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE past_paper_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE textbooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE textbook_authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE syllabi ENABLE ROW LEVEL SECURITY;
ALTER TABLE syllabus_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE syllabus_paper_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles: Users can read their own profile, admins can read all
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.id = auth.uid() 
      AND p.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can manage all profiles" ON profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.id = auth.uid() 
      AND p.role IN ('admin', 'super_admin')
    )
  );

-- Content: Published content is readable by enrolled users
CREATE POLICY "Users can read published content" ON content
  FOR SELECT USING (
    status = 'published' AND
    EXISTS (
      SELECT 1 FROM user_enrollments ue
      JOIN chapters c ON c.id = content.chapter_id
      JOIN weeks w ON w.id = c.week_id
      JOIN terms t ON t.id = w.term_id
      WHERE ue.user_id = auth.uid() 
      AND ue.subject_id = t.subject_id
      AND ue.is_active = true
    )
  );

-- Admin access: Super admins and admins can manage all data
CREATE POLICY "Admins can manage all content" ON content
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.id = auth.uid() 
      AND p.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can manage all schools" ON schools
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.id = auth.uid() 
      AND p.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can manage all subjects" ON subjects
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.id = auth.uid() 
      AND p.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can manage all past papers" ON past_papers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.id = auth.uid() 
      AND p.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can manage all textbooks" ON textbooks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.id = auth.uid() 
      AND p.role IN ('admin', 'super_admin')
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_school_id ON profiles(school_id);
CREATE INDEX IF NOT EXISTS idx_subjects_level_board ON subjects(level, exam_board);
CREATE INDEX IF NOT EXISTS idx_terms_subject_id ON terms(subject_id);
CREATE INDEX IF NOT EXISTS idx_weeks_term_id ON weeks(term_id);
CREATE INDEX IF NOT EXISTS idx_chapters_week_id ON chapters(week_id);
CREATE INDEX IF NOT EXISTS idx_content_chapter_id ON content(chapter_id);
CREATE INDEX IF NOT EXISTS idx_content_status ON content(status);
CREATE INDEX IF NOT EXISTS idx_content_type ON content(type);
CREATE INDEX IF NOT EXISTS idx_past_papers_subject_level ON past_papers(subject, level);
CREATE INDEX IF NOT EXISTS idx_past_papers_year_month ON past_papers(year, month);
CREATE INDEX IF NOT EXISTS idx_past_papers_exam_board ON past_papers(exam_board);
CREATE INDEX IF NOT EXISTS idx_textbooks_subject_level ON textbooks(subject, level);
CREATE INDEX IF NOT EXISTS idx_textbooks_publication_year ON textbooks(publication_year);
CREATE INDEX IF NOT EXISTS idx_content_views_user_id ON content_views(user_id);
CREATE INDEX IF NOT EXISTS idx_content_views_content_id ON content_views(content_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_enrollments_user_id ON user_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type_date ON analytics_events(event_type, created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource_type, resource_id);

-- Functions and Triggers

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON subjects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_updated_at BEFORE UPDATE ON content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_past_papers_updated_at BEFORE UPDATE ON past_papers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_textbooks_updated_at BEFORE UPDATE ON textbooks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_content_view_count(content_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE content 
  SET view_count = view_count + 1 
  WHERE id = content_id;
END;
$$ language 'plpgsql';

-- Function to increment download count for past papers
CREATE OR REPLACE FUNCTION increment_download_count(past_paper_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE past_papers 
  SET download_count = download_count + 1 
  WHERE id = past_paper_id;
END;
$$ language 'plpgsql';

-- Insert default admin user (will be created after auth signup)
-- This is just a placeholder - actual user creation happens through auth
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
  ('maintenance_mode', 'false', 'Enable/disable maintenance mode'),
  ('user_registration', 'true', 'Allow new user registrations'),
  ('email_notifications', 'true', 'Send system email notifications'),
  ('backup_enabled', 'true', 'Enable automatic backups'),
  ('auto_backup_interval', '24', 'Backup interval in hours'),
  ('max_file_size', '100', 'Maximum file size in MB'),
  ('session_timeout', '30', 'Session timeout in minutes')
ON CONFLICT (setting_key) DO NOTHING;