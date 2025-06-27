# WatchnLearn Admin System - Supabase Database Design

## Overview
This document outlines the complete database schema for the WatchnLearn educational platform admin system using Supabase (PostgreSQL).

## Database Schema

### 1. Authentication & Users
```sql
-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin', 'super_admin')),
  school_id UUID REFERENCES schools(id),
  level TEXT CHECK (level IN ('JC', 'O-Level', 'A-Level')),
  exam_board TEXT CHECK (exam_board IN ('ZIMSEC', 'Cambridge')),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin users table
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  permissions TEXT[] DEFAULT '{}',
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2. Schools & Educational Structure
```sql
-- Schools table
CREATE TABLE schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  principal_name TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subjects table
CREATE TABLE subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
CREATE TABLE subject_teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  qualification TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Terms table
CREATE TABLE terms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  order_number INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(subject_id, order_number)
);

-- Weeks table
CREATE TABLE weeks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  term_id UUID REFERENCES terms(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  order_number INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(term_id, order_number)
);

-- Chapters table
CREATE TABLE chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_id UUID REFERENCES weeks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_number INTEGER NOT NULL,
  is_continuation BOOLEAN DEFAULT false,
  original_chapter_id UUID REFERENCES chapters(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(week_id, order_number)
);
```

### 3. Content Management
```sql
-- Content/Topics table
CREATE TABLE content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('video', 'pdf', 'quiz', 'notes')),
  description TEXT,
  file_url TEXT,
  file_size BIGINT,
  duration TEXT, -- e.g., "15 minutes"
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
CREATE TABLE content_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID REFERENCES content(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ DEFAULT NOW(),
  duration_watched INTEGER, -- in seconds
  completed BOOLEAN DEFAULT false
);
```

### 4. Past Papers
```sql
-- Past papers table
CREATE TABLE past_papers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject TEXT NOT NULL,
  year INTEGER NOT NULL,
  month TEXT NOT NULL,
  paper_type TEXT NOT NULL, -- Paper 1, Paper 2, etc.
  level TEXT NOT NULL CHECK (level IN ('JC', 'O-Level', 'A-Level')),
  exam_board TEXT NOT NULL CHECK (exam_board IN ('ZIMSEC', 'Cambridge')),
  duration_hours DECIMAL(3,1) NOT NULL, -- e.g., 2.5 hours
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
CREATE TABLE past_paper_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  past_paper_id UUID REFERENCES past_papers(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  file_type TEXT CHECK (file_type IN ('question_paper', 'marking_scheme')),
  downloaded_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 5. Textbooks
```sql
-- Textbooks table
CREATE TABLE textbooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
CREATE TABLE textbook_authors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  textbook_id UUID REFERENCES textbooks(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  order_number INTEGER NOT NULL,
  UNIQUE(textbook_id, order_number)
);
```

### 6. Syllabus Management
```sql
-- Syllabi table
CREATE TABLE syllabi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
CREATE TABLE syllabus_papers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  syllabus_id UUID REFERENCES syllabi(id) ON DELETE CASCADE,
  paper_name TEXT NOT NULL,
  order_number INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(syllabus_id, order_number)
);

-- Syllabus paper topics table
CREATE TABLE syllabus_paper_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paper_id UUID REFERENCES syllabus_papers(id) ON DELETE CASCADE,
  topic_name TEXT NOT NULL,
  order_number INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(paper_id, order_number)
);
```

### 7. User Enrollments & Progress
```sql
-- User subject enrollments
CREATE TABLE user_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  UNIQUE(user_id, subject_id)
);

-- User progress tracking
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content_id UUID REFERENCES content(id) ON DELETE CASCADE,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  completed_at TIMESTAMPTZ,
  last_accessed TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, content_id)
);
```

### 8. System & Analytics
```sql
-- System settings table
CREATE TABLE system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value JSONB,
  description TEXT,
  updated_by UUID REFERENCES profiles(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit logs table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  event_type TEXT NOT NULL,
  event_data JSONB,
  session_id TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Row Level Security (RLS) Policies

### Enable RLS on all tables
```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
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
```

### Sample RLS Policies
```sql
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
CREATE POLICY "Admins can manage all data" ON content
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.id = auth.uid() 
      AND p.role IN ('admin', 'super_admin')
    )
  );
```

## Indexes for Performance

```sql
-- User and authentication indexes
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_school_id ON profiles(school_id);

-- Content hierarchy indexes
CREATE INDEX idx_subjects_level_board ON subjects(level, exam_board);
CREATE INDEX idx_terms_subject_id ON terms(subject_id);
CREATE INDEX idx_weeks_term_id ON weeks(term_id);
CREATE INDEX idx_chapters_week_id ON chapters(week_id);
CREATE INDEX idx_content_chapter_id ON content(chapter_id);
CREATE INDEX idx_content_status ON content(status);
CREATE INDEX idx_content_type ON content(type);

-- Past papers indexes
CREATE INDEX idx_past_papers_subject_level ON past_papers(subject, level);
CREATE INDEX idx_past_papers_year_month ON past_papers(year, month);
CREATE INDEX idx_past_papers_exam_board ON past_papers(exam_board);

-- Textbooks indexes
CREATE INDEX idx_textbooks_subject_level ON textbooks(subject, level);
CREATE INDEX idx_textbooks_publication_year ON textbooks(publication_year);

-- User activity indexes
CREATE INDEX idx_content_views_user_id ON content_views(user_id);
CREATE INDEX idx_content_views_content_id ON content_views(content_id);
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_enrollments_user_id ON user_enrollments(user_id);

-- Analytics indexes
CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_type_date ON analytics_events(event_type, created_at);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
```

## Functions and Triggers

```sql
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

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_content_view_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE content 
  SET view_count = view_count + 1 
  WHERE id = NEW.content_id;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to increment view count when content is viewed
CREATE TRIGGER increment_view_count_trigger
  AFTER INSERT ON content_views
  FOR EACH ROW EXECUTE FUNCTION increment_content_view_count();

-- Function to increment download count for past papers
CREATE OR REPLACE FUNCTION increment_download_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE past_papers 
  SET download_count = download_count + 1 
  WHERE id = NEW.past_paper_id;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to increment download count
CREATE TRIGGER increment_download_count_trigger
  AFTER INSERT ON past_paper_downloads
  FOR EACH ROW EXECUTE FUNCTION increment_download_count();
```

## Storage Buckets (Supabase Storage)

```sql
-- Create storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('content-files', 'content-files', false),
  ('past-papers', 'past-papers', false),
  ('marking-schemes', 'marking-schemes', false),
  ('textbook-covers', 'textbook-covers', true),
  ('syllabus-files', 'syllabus-files', false),
  ('user-avatars', 'user-avatars', true);

-- Storage policies
CREATE POLICY "Authenticated users can upload content files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'content-files' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Users can view published content files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'content-files' AND
    auth.role() = 'authenticated'
  );
```

This database design provides a comprehensive foundation for the WatchnLearn admin system with proper relationships, security, and scalability considerations using Supabase/PostgreSQL.