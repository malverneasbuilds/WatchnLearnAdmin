import { supabase } from '@/lib/supabase';
import type { PastPaper } from '@/lib/supabase';

export const pastPapersApi = {
  // Get all past papers
  async getAll(filters?: {
    subject?: string;
    level?: string;
    exam_board?: string;
    year?: number;
    search?: string;
  }) {
    let query = supabase
      .from('past_papers')
      .select('*')
      .eq('status', 'published')
      .order('year', { ascending: false })
      .order('month');

    // Apply filters
    if (filters?.subject) {
      query = query.eq('subject', filters.subject);
    }
    if (filters?.level) {
      query = query.eq('level', filters.level);
    }
    if (filters?.exam_board) {
      query = query.eq('exam_board', filters.exam_board);
    }
    if (filters?.year) {
      query = query.eq('year', filters.year);
    }
    if (filters?.search) {
      query = query.or(`subject.ilike.%${filters.search}%,paper_type.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;
    return { data, error };
  },

  // Get past paper by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('past_papers')
      .select('*')
      .eq('id', id)
      .single();

    return { data, error };
  },

  // Create new past paper
  async create(pastPaper: Omit<PastPaper, 'id' | 'created_at' | 'updated_at' | 'download_count'>) {
    const { data, error } = await supabase
      .from('past_papers')
      .insert({
        ...pastPaper,
        download_count: 0,
      })
      .select()
      .single();

    return { data, error };
  },

  // Update past paper
  async update(id: string, updates: Partial<PastPaper>) {
    const { data, error } = await supabase
      .from('past_papers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  },

  // Delete past paper
  async delete(id: string) {
    const { error } = await supabase
      .from('past_papers')
      .update({ status: 'archived' })
      .eq('id', id);

    return { error };
  },

  // Get past papers statistics
  async getStats() {
    const { data: total, error: totalError } = await supabase
      .from('past_papers')
      .select('id', { count: 'exact' })
      .eq('status', 'published');

    const { data: downloads, error: downloadsError } = await supabase
      .from('past_papers')
      .select('download_count');

    const { data: withMarkingScheme, error: markingError } = await supabase
      .from('past_papers')
      .select('id', { count: 'exact' })
      .eq('status', 'published')
      .eq('has_marking_scheme', true);

    const totalDownloads = downloads?.reduce((sum, paper) => sum + (paper.download_count || 0), 0) || 0;

    return {
      total: total?.length || 0,
      totalDownloads,
      withMarkingScheme: withMarkingScheme?.length || 0,
      error: totalError || downloadsError || markingError
    };
  },

  // Record download
  async recordDownload(pastPaperId: string, userId: string, fileType: 'question_paper' | 'marking_scheme') {
    const { error } = await supabase
      .from('past_paper_downloads')
      .insert({
        past_paper_id: pastPaperId,
        user_id: userId,
        file_type: fileType,
      });

    return { error };
  },
};