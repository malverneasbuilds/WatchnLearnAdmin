import { supabase } from '@/lib/supabase';
import type { Profile } from '@/lib/supabase';

export const usersApi = {
  // Get all users with pagination
  async getAll(page = 1, limit = 50, filters?: {
    level?: string;
    exam_board?: string;
    school_id?: string;
    search?: string;
  }) {
    let query = supabase
      .from('profiles')
      .select(`
        *,
        school:schools(name),
        enrollments:user_enrollments(
          subject:subjects(name)
        )
      `, { count: 'exact' })
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    // Apply filters
    if (filters?.level) {
      query = query.eq('level', filters.level);
    }
    if (filters?.exam_board) {
      query = query.eq('exam_board', filters.exam_board);
    }
    if (filters?.school_id) {
      query = query.eq('school_id', filters.school_id);
    }
    if (filters?.search) {
      query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
    }

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    return { 
      data, 
      error, 
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    };
  },

  // Get user by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        school:schools(name),
        enrollments:user_enrollments(
          subject:subjects(name, level, exam_board)
        )
      `)
      .eq('id', id)
      .single();

    return { data, error };
  },

  // Update user
  async update(id: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  },

  // Suspend user
  async suspend(id: string) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ is_active: false })
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  },

  // Activate user
  async activate(id: string) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ is_active: true })
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  },

  // Delete user (soft delete)
  async delete(id: string) {
    const { error } = await supabase
      .from('profiles')
      .update({ is_active: false })
      .eq('id', id);

    return { error };
  },

  // Get user statistics
  async getStats() {
    const { data: totalUsers, error: totalError } = await supabase
      .from('profiles')
      .select('id', { count: 'exact' })
      .eq('is_active', true);

    const { data: activeUsers, error: activeError } = await supabase
      .from('profiles')
      .select('id', { count: 'exact' })
      .eq('is_active', true)
      .gte('last_login', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    const { data: schools, error: schoolsError } = await supabase
      .from('schools')
      .select('id', { count: 'exact' })
      .eq('is_active', true);

    return {
      totalUsers: totalUsers?.length || 0,
      activeUsers: activeUsers?.length || 0,
      totalSchools: schools?.length || 0,
      error: totalError || activeError || schoolsError
    };
  },
};