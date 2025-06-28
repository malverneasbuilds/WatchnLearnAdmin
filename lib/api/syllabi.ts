import { supabase } from '@/lib/supabase';
import type { Syllabus, SyllabusPaper, SyllabusPaperTopic } from '@/lib/supabase';

export const syllabiApi = {
  // Get all syllabi
  async getAll(filters?: {
    subject?: string;
    level?: string;
    exam_board?: string;
    search?: string;
  }) {
    let query = supabase
      .from('syllabi')
      .select(`
        *,
        papers:syllabus_papers(
          *,
          topics:syllabus_paper_topics(*)
        )
      `)
      .order('created_at', { ascending: false });

    // Apply filters
    if (filters?.subject) {
      query = query.eq('subject', filters.subject);
    }
    if (filters?.level) {
      query = query.eq('level', filters.level);
    }
    if (filters?.search) {
      query = query.or(`subject.ilike.%${filters.search}%,overview.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;
    return { data, error };
  },

  // Get syllabus by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('syllabi')
      .select(`
        *,
        papers:syllabus_papers(
          *,
          topics:syllabus_paper_topics(*)
        )
      `)
      .eq('id', id)
      .single();

    return { data, error };
  },

  // Create new syllabus
  async create(
    syllabus: Omit<Syllabus, 'id' | 'created_at' | 'updated_at'>,
    papers: Array<{
      name: string;
      topics: string[];
    }>
  ) {
    const { data: syllabusData, error: syllabusError } = await supabase
      .from('syllabi')
      .insert(syllabus)
      .select()
      .single();

    if (syllabusError) return { data: null, error: syllabusError };

    // Add papers and topics
    if (papers.length > 0) {
      for (let i = 0; i < papers.length; i++) {
        const paper = papers[i];
        
        const { data: paperData, error: paperError } = await supabase
          .from('syllabus_papers')
          .insert({
            syllabus_id: syllabusData.id,
            paper_name: paper.name,
            order_number: i + 1,
          })
          .select()
          .single();

        if (paperError) {
          // Rollback syllabus creation
          await supabase.from('syllabi').delete().eq('id', syllabusData.id);
          return { data: null, error: paperError };
        }

        // Add topics for this paper
        if (paper.topics.length > 0) {
          const topicsData = paper.topics.map((topic, index) => ({
            paper_id: paperData.id,
            topic_name: topic,
            order_number: index + 1,
          }));

          const { error: topicsError } = await supabase
            .from('syllabus_paper_topics')
            .insert(topicsData);

          if (topicsError) {
            // Rollback syllabus creation
            await supabase.from('syllabi').delete().eq('id', syllabusData.id);
            return { data: null, error: topicsError };
          }
        }
      }
    }

    return { data: syllabusData, error: null };
  },

  // Update syllabus
  async update(id: string, updates: Partial<Syllabus>) {
    const { data, error } = await supabase
      .from('syllabi')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  },

  // Delete syllabus
  async delete(id: string) {
    const { error } = await supabase
      .from('syllabi')
      .delete()
      .eq('id', id);

    return { error };
  },

  // Get syllabi statistics
  async getStats() {
    const { data: total, error: totalError } = await supabase
      .from('syllabi')
      .select('id', { count: 'exact' });

    return {
      total: total?.length || 0,
      error: totalError
    };
  },
};