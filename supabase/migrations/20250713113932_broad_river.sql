/*
  # Fix RLS Recursion in Admin Users Table

  1. Remove problematic recursive policy
  2. Add simple, non-recursive policies for admin_users table
  3. Ensure proper access control without infinite recursion
*/

-- Drop the problematic recursive policy
DROP POLICY IF EXISTS "Admins can view other admins" ON admin_users;

-- Create new non-recursive policies for admin_users
CREATE POLICY "Users can view own admin record" ON admin_users 
  FOR SELECT TO authenticated 
  USING (user_id = auth.uid());

CREATE POLICY "Super admins can view all admin records" ON admin_users 
  FOR SELECT TO authenticated 
  USING (
    user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM admin_users au 
      WHERE au.user_id = auth.uid() 
      AND au.admin_level = 'super'
      AND au.id != admin_users.id  -- Prevent self-reference
    )
  );

-- Update the existing super admin management policy to be more specific
DROP POLICY IF EXISTS "Super admins can manage all admin users" ON admin_users;

CREATE POLICY "Super admins can manage admin users" ON admin_users 
  FOR ALL TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      WHERE au.user_id = auth.uid() 
      AND au.admin_level = 'super'
      AND au.id != admin_users.id  -- Prevent self-reference in updates/deletes
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users au 
      WHERE au.user_id = auth.uid() 
      AND au.admin_level = 'super'
    )
  );