import { supabase } from './supabase';
import { User } from '@supabase/supabase-js';

export interface AuthUser extends User {
  profile?: {
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
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  // Update last login
  if (data.user) {
    await supabase
      .from('profiles')
      .update({ last_login: new Date().toISOString() })
      .eq('id', data.user.id);
  }

  return data;
};

export const signUp = async (email: string, password: string, fullName: string, role: string = 'admin') => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;

  // Create profile
  if (data.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        email,
        full_name: fullName,
        role: role as any,
      });

    if (profileError) throw profileError;
  }

  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return {
    ...user,
    profile,
  } as AuthUser;
};

export const updateProfile = async (userId: string, updates: any) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const isAdmin = (user: AuthUser | null): boolean => {
  return user?.profile?.role === 'admin' || user?.profile?.role === 'super_admin';
};

export const isSuperAdmin = (user: AuthUser | null): boolean => {
  return user?.profile?.role === 'super_admin';
};