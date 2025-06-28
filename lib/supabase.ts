import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: 'student' | 'teacher' | 'admin' | 'super_admin';
  school_id?: string;
  level?: 'JC' | 'O-Level' | 'A-Level';
  exam_board?: 'ZIMSEC' | 'Cambridge';
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface School {
  id: string;
  name: string;
  address?: string;
  contact_email?: string;
  contact_phone?: string;
  principal_name?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Subject {
  id: string;
  name: string;
  description?: string;
  level: 'JC' | 'O-Level' | 'A-Level';
  exam_board: 'ZIMSEC' | 'Cambridge';
  school_id?: string;
  icon: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SubjectTeacher {
  id: string;
  subject_id: string;
  name: string;
  email: string;
  phone?: string;
  qualification?: string;
  created_at: string;
}

export interface Term {
  id: string;
  subject_id: string;
  title: string;
  order_number: number;
  created_at: string;
}

export interface Week {
  id: string;
  term_id: string;
  title: string;
  order_number: number;
  created_at: string;
}

export interface Chapter {
  id: string;
  week_id: string;
  title: string;
  description?: string;
  order_number: number;
  is_continuation: boolean;
  original_chapter_id?: string;
  created_at: string;
}

export interface Content {
  id: string;
  chapter_id: string;
  title: string;
  type: 'video' | 'pdf' | 'quiz' | 'notes';
  description?: string;
  file_url?: string;
  file_size?: number;
  duration?: string;
  estimated_study_time?: string;
  order_number: number;
  status: 'draft' | 'published' | 'review' | 'archived';
  tags: string[];
  view_count: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface PastPaper {
  id: string;
  subject: string;
  year: number;
  month: string;
  paper_type: string;
  level: 'JC' | 'O-Level' | 'A-Level';
  exam_board: 'ZIMSEC' | 'Cambridge';
  duration_hours: number;
  total_marks: number;
  description?: string;
  question_paper_url: string;
  marking_scheme_url?: string;
  has_marking_scheme: boolean;
  file_size?: string;
  download_count: number;
  status: 'draft' | 'published' | 'review' | 'archived';
  uploaded_by?: string;
  created_at: string;
  updated_at: string;
}

export interface Textbook {
  id: string;
  title: string;
  publisher: string;
  edition?: string;
  publication_year: number;
  isbn?: string;
  subject: string;
  level: 'JC' | 'O-Level' | 'A-Level';
  exam_board: 'ZIMSEC' | 'Cambridge';
  description?: string;
  cover_image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface TextbookAuthor {
  id: string;
  textbook_id: string;
  author_name: string;
  order_number: number;
}

export interface Syllabus {
  id: string;
  subject: string;
  level: 'JC' | 'O-Level' | 'A-Level';
  exam_board: 'ZIMSEC' | 'Cambridge';
  year: number;
  overview: string;
  total_topics: number;
  syllabus_file_url?: string;
  assessment_file_url?: string;
  specimen_file_url?: string;
  created_at: string;
  updated_at: string;
}

export interface SyllabusPaper {
  id: string;
  syllabus_id: string;
  paper_name: string;
  order_number: number;
  created_at: string;
}

export interface SyllabusPaperTopic {
  id: string;
  paper_id: string;
  topic_name: string;
  order_number: number;
  created_at: string;
}