import { supabase } from '@/lib/supabase';
import type { Textbook, TextbookAuthor } from '@/lib/supabase';

export const textbooksApi = {
  // Get all textbooks
  async getAll(filters?: {
    subject?: string;
    level?: string;
    exam_board?: string;
    search?: string;
  }) {
    let query = supabase
      .from('textbooks')
      .select(`
        *,
        authors:textbook_authors(author_name, order_number)
      `)
      .order('created_at', { ascending: false });

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
    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,publisher.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;
    return { data, error };
  },

  // Get textbook by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('textbooks')
      .select(`
        *,
        authors:textbook_authors(author_name, order_number)
      `)
      .eq('id', id)
      .single();

    return { data, error };
  },

  // Create new textbook
  async create(
    textbook: Omit<Textbook, 'id' | 'created_at' | 'updated_at'>, 
    authors: string[]
  ) {
    const { data: textbookData, error: textbookError } = await supabase
      .from('textbooks')
      .insert(textbook)
      .select()
      .single();

    if (textbookError) return { data: null, error: textbookError };

    // Add authors
    if (authors.length > 0) {
      const authorsData = authors.map((author, index) => ({
        textbook_id: textbookData.id,
        author_name: author,
        order_number: index + 1,
      }));

      const { error: authorsError } = await supabase
        .from('textbook_authors')
        .insert(authorsData);

      if (authorsError) {
        // Rollback textbook creation if authors insertion fails
        await supabase.from('textbooks').delete().eq('id', textbookData.id);
        return { data: null, error: authorsError };
      }
    }

    return { data: textbookData, error: null };
  },

  // Update textbook
  async update(id: string, updates: Partial<Textbook>) {
    const { data, error } = await supabase
      .from('textbooks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  },

  // Delete textbook
  async delete(id: string) {
    const { error } = await supabase
      .from('textbooks')
      .delete()
      .eq('id', id);

    return { error };
  },

  // Get textbooks statistics
  async getStats() {
    const { data: total, error: totalError } = await supabase
      .from('textbooks')
      .select('id', { count: 'exact' });

    const { data: subjects, error: subjectsError } = await supabase
      .from('textbooks')
      .select('subject')
      .then(({ data, error }) => ({
        data: data ? [...new Set(data.map(t => t.subject))] : [],
        error
      }));

    const { data: publishers, error: publishersError } = await supabase
      .from('textbooks')
      .select('publisher')
      .then(({ data, error }) => ({
        data: data ? [...new Set(data.map(t => t.publisher))] : [],
        error
      }));

    return {
      total: total?.length || 0,
      subjects: subjects?.length || 0,
      publishers: publishers?.length || 0,
      error: totalError || subjectsError || publishersError
    };
  },
};