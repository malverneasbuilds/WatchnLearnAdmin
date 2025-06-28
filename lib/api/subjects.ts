import { supabase } from '@/lib/supabase';
import type { Subject, SubjectTeacher } from '@/lib/supabase';

export const subjectsApi = {
  // Get all subjects
  async getAll() {
    const { data, error } = await supabase
      .from('subjects')
      .select(`
        *,
        subject_teachers(*),
        school:schools(name)
      `)
      .eq('is_active', true)
      .order('name');

    return { data, error };
  },

  // Get subject by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('subjects')
      .select(`
        *,
        subject_teachers(*),
        school:schools(name)
      `)
      .eq('id', id)
      .single();

    return { data, error };
  },

  // Create new subject
  async create(subject: Omit<Subject, 'id' | 'created_at' | 'updated_at'>, teachers: Omit<SubjectTeacher, 'id' | 'subject_id' | 'created_at'>[]) {
    const { data: subjectData, error: subjectError } = await supabase
      .from('subjects')
      .insert(subject)
      .select()
      .single();

    if (subjectError) return { data: null, error: subjectError };

    // Add teachers if provided
    if (teachers.length > 0) {
      const teachersWithSubjectId = teachers.map(teacher => ({
        ...teacher,
        subject_id: subjectData.id,
      }));

      const { error: teachersError } = await supabase
        .from('subject_teachers')
        .insert(teachersWithSubjectId);

      if (teachersError) {
        // Rollback subject creation if teachers insertion fails
        await supabase.from('subjects').delete().eq('id', subjectData.id);
        return { data: null, error: teachersError };
      }
    }

    return { data: subjectData, error: null };
  },

  // Update subject
  async update(id: string, updates: Partial<Subject>) {
    const { data, error } = await supabase
      .from('subjects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  },

  // Delete subject
  async delete(id: string) {
    const { error } = await supabase
      .from('subjects')
      .update({ is_active: false })
      .eq('id', id);

    return { error };
  },

  // Get subjects with enrollment stats
  async getWithStats() {
    const { data, error } = await supabase
      .from('subjects')
      .select(`
        *,
        subject_teachers(*),
        school:schools(name),
        enrollments:user_enrollments(count),
        content_count:terms(
          weeks(
            chapters(
              content(count)
            )
          )
        )
      `)
      .eq('is_active', true);

    return { data, error };
  },
};