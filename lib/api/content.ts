import { supabase } from '@/lib/supabase';
import { Database } from '@/lib/supabase';

type Content = Database['public']['Tables']['content']['Row'];
type ContentInsert = Database['public']['Tables']['content']['Insert'];
type ContentUpdate = Database['public']['Tables']['content']['Update'];

export const contentApi = {
  // Get all content with pagination and filtering
  async getContent(options: {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
    status?: string;
    subjectId?: string;
  } = {}) {
    const { page = 1, limit = 50, search, type, status, subjectId } = options;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('content')
      .select(`
        *,
        chapters (
          id,
          title,
          weeks (
            id,
            title,
            terms (
              id,
              title,
              subjects (
                id,
                name,
                level,
                exam_board
              )
            )
          )
        ),
        profiles!content_created_by_fkey (
          id,
          full_name
        )
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    if (type) {
      query = query.eq('type', type);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      content: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };
  },

  // Get content by ID
  async getContentById(id: string) {
    const { data, error } = await supabase
      .from('content')
      .select(`
        *,
        chapters (
          id,
          title,
          weeks (
            id,
            title,
            terms (
              id,
              title,
              subjects (
                id,
                name,
                level,
                exam_board
              )
            )
          )
        ),
        profiles!content_created_by_fkey (
          id,
          full_name
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create new content
  async createContent(contentData: ContentInsert) {
    const { data, error } = await supabase
      .from('content')
      .insert(contentData)
      .select(`
        *,
        chapters (
          id,
          title,
          weeks (
            id,
            title,
            terms (
              id,
              title,
              subjects (
                id,
                name,
                level,
                exam_board
              )
            )
          )
        )
      `)
      .single();

    if (error) throw error;
    return data;
  },

  // Update content
  async updateContent(id: string, updates: ContentUpdate) {
    const { data, error } = await supabase
      .from('content')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select(`
        *,
        chapters (
          id,
          title,
          weeks (
            id,
            title,
            terms (
              id,
              title,
              subjects (
                id,
                name,
                level,
                exam_board
              )
            )
          )
        )
      `)
      .single();

    if (error) throw error;
    return data;
  },

  // Delete content
  async deleteContent(id: string) {
    const { error } = await supabase
      .from('content')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Get content statistics
  async getContentStats() {
    const { data: totalContent, error: totalError } = await supabase
      .from('content')
      .select('id', { count: 'exact', head: true });

    const { data: publishedContent, error: publishedError } = await supabase
      .from('content')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'published');

    const { data: draftContent, error: draftError } = await supabase
      .from('content')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'draft');

    const { data: reviewContent, error: reviewError } = await supabase
      .from('content')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'review');

    if (totalError || publishedError || draftError || reviewError) {
      throw totalError || publishedError || draftError || reviewError;
    }

    return {
      total: totalContent?.length || 0,
      published: publishedContent?.length || 0,
      draft: draftContent?.length || 0,
      review: reviewContent?.length || 0,
    };
  },

  // Increment view count
  async incrementViewCount(id: string) {
    const { error } = await supabase.rpc('increment_content_view_count', {
      content_id: id
    });

    if (error) throw error;
  },
};