import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: 'student' | 'teacher' | 'admin' | 'super_admin';
          school_id: string | null;
          level: 'JC' | 'O-Level' | 'A-Level' | null;
          exam_board: 'ZIMSEC' | 'Cambridge' | null;
          is_active: boolean;
          last_login: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: 'student' | 'teacher' | 'admin' | 'super_admin';
          school_id?: string | null;
          level?: 'JC' | 'O-Level' | 'A-Level' | null;
          exam_board?: 'ZIMSEC' | 'Cambridge' | null;
          is_active?: boolean;
          last_login?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: 'student' | 'teacher' | 'admin' | 'super_admin';
          school_id?: string | null;
          level?: 'JC' | 'O-Level' | 'A-Level' | null;
          exam_board?: 'ZIMSEC' | 'Cambridge' | null;
          is_active?: boolean;
          last_login?: string | null;
        };
      };
      schools: {
        Row: {
          id: string;
          name: string;
          address: string | null;
          contact_email: string | null;
          contact_phone: string | null;
          principal_name: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          address?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          principal_name?: string | null;
          is_active?: boolean;
        };
        Update: {
          name?: string;
          address?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          principal_name?: string | null;
          is_active?: boolean;
        };
      };
      subjects: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          level: 'JC' | 'O-Level' | 'A-Level';
          exam_board: 'ZIMSEC' | 'Cambridge';
          school_id: string | null;
          icon: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          description?: string | null;
          level: 'JC' | 'O-Level' | 'A-Level';
          exam_board: 'ZIMSEC' | 'Cambridge';
          school_id?: string | null;
          icon?: string;
          is_active?: boolean;
        };
        Update: {
          name?: string;
          description?: string | null;
          level?: 'JC' | 'O-Level' | 'A-Level';
          exam_board?: 'ZIMSEC' | 'Cambridge';
          school_id?: string | null;
          icon?: string;
          is_active?: boolean;
        };
      };
      content: {
        Row: {
          id: string;
          chapter_id: string;
          title: string;
          type: 'video' | 'pdf' | 'quiz' | 'notes';
          description: string | null;
          file_url: string | null;
          file_size: number | null;
          duration: string | null;
          estimated_study_time: string | null;
          order_number: number;
          status: 'draft' | 'published' | 'review' | 'archived';
          tags: string[];
          view_count: number;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          chapter_id: string;
          title: string;
          type: 'video' | 'pdf' | 'quiz' | 'notes';
          description?: string | null;
          file_url?: string | null;
          file_size?: number | null;
          duration?: string | null;
          estimated_study_time?: string | null;
          order_number: number;
          status?: 'draft' | 'published' | 'review' | 'archived';
          tags?: string[];
          view_count?: number;
          created_by?: string | null;
        };
        Update: {
          chapter_id?: string;
          title?: string;
          type?: 'video' | 'pdf' | 'quiz' | 'notes';
          description?: string | null;
          file_url?: string | null;
          file_size?: number | null;
          duration?: string | null;
          estimated_study_time?: string | null;
          order_number?: number;
          status?: 'draft' | 'published' | 'review' | 'archived';
          tags?: string[];
          view_count?: number;
          created_by?: string | null;
        };
      };
      past_papers: {
        Row: {
          id: string;
          subject: string;
          year: number;
          month: string;
          paper_type: string;
          level: 'JC' | 'O-Level' | 'A-Level';
          exam_board: 'ZIMSEC' | 'Cambridge';
          duration_hours: number;
          total_marks: number;
          description: string | null;
          question_paper_url: string;
          marking_scheme_url: string | null;
          has_marking_scheme: boolean;
          file_size: string | null;
          download_count: number;
          status: 'draft' | 'published' | 'review' | 'archived';
          uploaded_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          subject: string;
          year: number;
          month: string;
          paper_type: string;
          level: 'JC' | 'O-Level' | 'A-Level';
          exam_board: 'ZIMSEC' | 'Cambridge';
          duration_hours: number;
          total_marks: number;
          description?: string | null;
          question_paper_url: string;
          marking_scheme_url?: string | null;
          has_marking_scheme?: boolean;
          file_size?: string | null;
          download_count?: number;
          status?: 'draft' | 'published' | 'review' | 'archived';
          uploaded_by?: string | null;
        };
        Update: {
          subject?: string;
          year?: number;
          month?: string;
          paper_type?: string;
          level?: 'JC' | 'O-Level' | 'A-Level';
          exam_board?: 'ZIMSEC' | 'Cambridge';
          duration_hours?: number;
          total_marks?: number;
          description?: string | null;
          question_paper_url?: string;
          marking_scheme_url?: string | null;
          has_marking_scheme?: boolean;
          file_size?: string | null;
          download_count?: number;
          status?: 'draft' | 'published' | 'review' | 'archived';
          uploaded_by?: string | null;
        };
      };
    };
  };
};