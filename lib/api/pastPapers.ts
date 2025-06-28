import { supabase } from '@/lib/supabase';
import { Database } from '@/lib/supabase';

type PastPaper = Database['public']['Tables']['past_papers']['Row'];
type PastPaperInsert = Database['public']['Tables']['past_papers']['Insert'];
type PastPaperUpdate = Database['public']['Tables']['past_papers']['Update'];

export const pastPapersApi = {
  // Get all past papers with pagination and filtering
  async getPastPapers(options: {
    page?: number;
    limit?: number;
    search?: string;
    subject?: string;
    level?: string;
    year?: number;
    examBoard?: string;
  } = {}) {
    const { page = 1, limit = 50, search, subject, level, year, examBoard } = options;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('past_papers')
      .select(`
        *,
        profiles!past_papers_uploaded_by_fkey (
          id,
          full_name
        )
      `, { count: 'exact' })
      .order('year', { ascending: false })
      .order('month', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (search) {
      query = query.or(`subject.ilike.%${search}%,paper_type.ilike.%${search}%`);
    }

    if (subject) {
      query = query.eq('subject', subject);
    }

    if (level) {
      query = query.eq('level', level);
    }

    if (year) {
      query = query.eq('year', year);
    }

    if (examBoard) {
      query = query.eq('exam_board', examBoard);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      pastPapers: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };
  },

  // Get past paper by ID
  async getPastPaperById(id: string) {
    const { data, error } = await supabase
      .from('past_papers')
      .select(`
        *,
        profiles!past_papers_uploaded_by_fkey (
          id,
          full_name
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create new past paper
  async createPastPaper(paperData: PastPaperInsert) {
    const { data, error } = await supabase
      .from('past_papers')
      .insert(paperData)
      .select(`
        *,
        profiles!past_papers_uploaded_by_fkey (
          id,
          full_name
        )
      `)
      .single();

    if (error) throw error;
    return data;
  },

  // Update past paper
  async updatePastPaper(id: string, updates: PastPaperUpdate) {
    const { data, error } = await supabase
      .from('past_papers')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select(`
        *,
        profiles!past_papers_uploaded_by_fkey (
          id,
          full_name
        )
      `)
      .single();

    if (error) throw error;
    return data;
  },

  // Delete past paper
  async deletePastPaper(id: string) {
    const { error } = await supabase
      .from('past_papers')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Get past papers statistics
  async getPastPapersStats() {
    const { data: totalPapers, error: totalError } = await supabase
      .from('past_papers')
      .select('id', { count: 'exact', head: true });

    const { data: withMarkingScheme, error: markingError } = await supabase
      .from('past_papers')
      .select('id', { count: 'exact', head: true })
      .eq('has_marking_scheme', true);

    // Get total downloads
    const { data: totalDownloads, error: downloadsError } = await supabase
      .from('past_papers')
      .select('download_count');

    // Get unique years
    const { data: years, error: yearsError } = await supabase
      .from('past_papers')
      .select('year')
      .order('year', { ascending: false });

    if (totalError || markingError || downloadsError || yearsError) {
      throw totalError || markingError || downloadsError || yearsError;
    }

    const totalDownloadCount = totalDownloads?.reduce((sum, paper) => sum + (paper.download_count || 0), 0) || 0;
    const uniqueYears = [...new Set(years?.map(y => y.year) || [])];

    return {
      total: totalPapers?.length || 0,
      withMarkingScheme: withMarkingScheme?.length || 0,
      totalDownloads: totalDownloadCount,
      yearsAvailable: uniqueYears.length,
      yearRange: uniqueYears.length > 0 ? {
        min: Math.min(...uniqueYears),
        max: Math.max(...uniqueYears)
      } : null,
    };
  },

  // Increment download count
  async incrementDownloadCount(id: string) {
    const { error } = await supabase.rpc('increment_download_count', {
      past_paper_id: id
    });

    if (error) throw error;
  },

  // Get subjects with paper counts
  async getSubjectsWithCounts() {
    const { data, error } = await supabase
      .from('past_papers')
      .select('subject')
      .eq('status', 'published');

    if (error) throw error;

    const subjectCounts = data?.reduce((acc: Record<string, number>, paper) => {
      acc[paper.subject] = (acc[paper.subject] || 0) + 1;
      return acc;
    }, {}) || {};

    return Object.entries(subjectCounts).map(([subject, count]) => ({
      subject,
      count,
    }));
  },
};