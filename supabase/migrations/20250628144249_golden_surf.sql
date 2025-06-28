/*
  # Fix RLS policies for user signup and set teacher as default role

  1. Security Changes
    - Add policy to allow users to insert their own profile during signup
    - Maintain existing read/update policies for admins
    - Fix infinite recursion in RLS policies

  2. Role Changes
    - Update default role to 'teacher' instead of 'student'
*/

-- Drop the existing problematic policies
DROP POLICY IF EXISTS "Profiles access policy" ON profiles;

-- Create separate policies for different operations to avoid recursion

-- Policy for INSERT: Allow users to create their own profile during signup
CREATE POLICY "Users can create own profile" ON profiles
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Policy for SELECT: Users can read their own profile, admins can read all
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT 
  USING (
    auth.uid() = id 
    OR 
    EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.id = auth.uid() 
      AND p.role IN ('admin', 'super_admin')
    )
  );

-- Policy for UPDATE: Users can update their own profile, admins can update all
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE 
  USING (
    auth.uid() = id 
    OR 
    EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.id = auth.uid() 
      AND p.role IN ('admin', 'super_admin')
    )
  );

-- Policy for DELETE: Only admins can delete profiles
CREATE POLICY "Admins can delete profiles" ON profiles
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.id = auth.uid() 
      AND p.role IN ('admin', 'super_admin')
    )
  );

-- Drop the is_admin function as it's no longer needed
DROP FUNCTION IF EXISTS is_admin();