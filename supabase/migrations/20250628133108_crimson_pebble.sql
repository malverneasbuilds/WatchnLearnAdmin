/*
  # Fix RLS Infinite Recursion in Profiles Table

  1. Problem
    - RLS policies on profiles table cause infinite recursion
    - Policies check user role by querying profiles table itself
    - Creates circular dependency during policy evaluation

  2. Solution
    - Create SECURITY DEFINER function to bypass RLS when checking admin status
    - Replace existing policies with non-recursive ones
    - Function can query profiles table without triggering RLS

  3. Changes
    - Drop existing problematic policies on profiles table
    - Create is_admin() function with SECURITY DEFINER
    - Add new comprehensive policy using the function
*/

-- Drop existing problematic policies on profiles table
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;

-- Create a SECURITY DEFINER function to check if current user is admin
-- This function bypasses RLS when querying profiles table
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  );
END;
$$;

-- Create new comprehensive policy for profiles table
CREATE POLICY "Profiles access policy" ON profiles
  FOR ALL USING (
    -- Users can access their own profile
    auth.uid() = id 
    OR 
    -- Admins can access all profiles (using SECURITY DEFINER function)
    is_admin()
  );

-- Grant execute permission on the function to authenticated users
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;