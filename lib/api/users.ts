import { supabase } from '@/lib/supabase';
import { Database } from '@/lib/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export const usersApi = {
  // Get all users with pagination and filtering
  async getUsers(options: {
    page?: number;
    limit?: number;
    search?: string;
    level?: string;
    examBoard?: string;
    role?: string;
  } = {}) {
    const { page = 1, limit = 50, search, level, examBoard, role } = options;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('profiles')
      .select(`
        *,
        schools (
          id,
          name
        )
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    if (level) {
      query = query.eq('level', level);
    }

    if (examBoard) {
      query = query.eq('exam_board', examBoard);
    }

    if (role) {
      query = query.eq('role', role);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      users: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };
  },

  // Get user by ID
  async getUserById(id: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        schools (
          id,
          name
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create new user
  async createUser(userData: ProfileInsert) {
    const { data, error } = await supabase
      .from('profiles')
      .insert(userData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update user
  async updateUser(id: string, updates: ProfileUpdate) {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete user
  async deleteUser(id: string) {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Get user statistics
  async getUserStats() {
    const { data: totalUsers, error: totalError } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true });

    const { data: activeUsers, error: activeError } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('is_active', true);

    const { data: adminUsers, error: adminError } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .in('role', ['admin', 'super_admin']);

    if (totalError || activeError || adminError) {
      throw totalError || activeError || adminError;
    }

    return {
      total: totalUsers?.length || 0,
      active: activeUsers?.length || 0,
      admins: adminUsers?.length || 0,
    };
  },

  // Bulk update users
  async bulkUpdateUsers(userIds: string[], updates: ProfileUpdate) {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .in('id', userIds)
      .select();

    if (error) throw error;
    return data;
  },
};