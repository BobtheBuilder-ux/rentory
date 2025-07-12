/*
  # Admin System Setup

  1. New Tables
    - `admin_users` - System administrators
    - `agents` - Real estate agents created by admins
    - `agent_assignments` - Agent-landlord relationships

  2. Enhanced User Types
    - Add 'admin' and 'agent' to user_type enum
    - Update policies for new user types

  3. Admin Functions
    - Function to create agents
    - Function to assign agents to landlords
    - Admin dashboard queries

  4. Security
    - Admin-only policies for agent management
    - Agent policies for property management
*/

-- Add new user types to existing enum
ALTER TYPE user_type ADD VALUE IF NOT EXISTS 'admin';
ALTER TYPE user_type ADD VALUE IF NOT EXISTS 'agent';

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  admin_level text DEFAULT 'standard' CHECK (admin_level IN ('super', 'standard')),
  permissions jsonb DEFAULT '[]',
  created_by uuid REFERENCES admin_users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Agents table
CREATE TABLE IF NOT EXISTS agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  agent_code text UNIQUE NOT NULL,
  license_number text,
  agency_name text,
  commission_rate numeric DEFAULT 5.0,
  territory jsonb DEFAULT '[]', -- Array of states/cities they cover
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_by uuid REFERENCES admin_users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Agent assignments (agents can manage multiple landlords)
CREATE TABLE IF NOT EXISTS agent_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid REFERENCES agents(id) ON DELETE CASCADE,
  landlord_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  assigned_by uuid REFERENCES admin_users(id),
  assignment_type text DEFAULT 'full' CHECK (assignment_type IN ('full', 'limited')),
  permissions jsonb DEFAULT '["view", "edit", "create"]',
  created_at timestamptz DEFAULT now(),
  UNIQUE(agent_id, landlord_id)
);

-- Add agent_id to properties table for tracking
ALTER TABLE properties ADD COLUMN IF NOT EXISTS agent_id uuid REFERENCES agents(id);

-- Enable RLS on new tables
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_assignments ENABLE ROW LEVEL SECURITY;

-- Admin policies
CREATE POLICY "Super admins can manage all admin users" ON admin_users 
  FOR ALL TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      WHERE au.user_id = auth.uid() AND au.admin_level = 'super'
    )
  );

CREATE POLICY "Admins can view other admins" ON admin_users 
  FOR SELECT TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      WHERE au.user_id = auth.uid()
    )
  );

-- Agent policies
CREATE POLICY "Admins can manage agents" ON agents 
  FOR ALL TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      WHERE au.user_id = auth.uid()
    )
  );

CREATE POLICY "Agents can view their own profile" ON agents 
  FOR SELECT TO authenticated 
  USING (user_id = auth.uid());

CREATE POLICY "Agents can update their own profile" ON agents 
  FOR UPDATE TO authenticated 
  USING (user_id = auth.uid());

-- Agent assignment policies
CREATE POLICY "Admins can manage agent assignments" ON agent_assignments 
  FOR ALL TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      WHERE au.user_id = auth.uid()
    )
  );

CREATE POLICY "Agents can view their assignments" ON agent_assignments 
  FOR SELECT TO authenticated 
  USING (
    agent_id IN (
      SELECT id FROM agents WHERE user_id = auth.uid()
    )
  );

-- Update properties policies for agents
CREATE POLICY "Agents can manage assigned landlord properties" ON properties 
  FOR ALL TO authenticated 
  USING (
    agent_id IN (
      SELECT id FROM agents WHERE user_id = auth.uid()
    ) OR
    landlord_id IN (
      SELECT aa.landlord_id FROM agent_assignments aa
      JOIN agents a ON aa.agent_id = a.id
      WHERE a.user_id = auth.uid()
    )
  );

-- Functions for admin operations
CREATE OR REPLACE FUNCTION create_agent(
  p_email text,
  p_password text,
  p_first_name text,
  p_last_name text,
  p_phone text,
  p_agency_name text DEFAULT NULL,
  p_license_number text DEFAULT NULL,
  p_territory jsonb DEFAULT '[]'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id uuid;
  v_profile_id uuid;
  v_agent_id uuid;
  v_agent_code text;
  v_admin_id uuid;
BEGIN
  -- Check if caller is admin
  SELECT id INTO v_admin_id 
  FROM admin_users 
  WHERE user_id = auth.uid();
  
  IF v_admin_id IS NULL THEN
    RAISE EXCEPTION 'Only admins can create agents';
  END IF;

  -- Generate unique agent code
  v_agent_code := 'AGT' || LPAD(FLOOR(RANDOM() * 999999)::text, 6, '0');
  
  -- Check if agent code exists, regenerate if needed
  WHILE EXISTS (SELECT 1 FROM agents WHERE agent_code = v_agent_code) LOOP
    v_agent_code := 'AGT' || LPAD(FLOOR(RANDOM() * 999999)::text, 6, '0');
  END LOOP;

  -- Create auth user (this would typically be done via Supabase Auth API)
  -- For now, we'll create the profile and agent record assuming user exists
  
  -- Create profile
  INSERT INTO profiles (
    email, first_name, last_name, phone, user_type
  ) VALUES (
    p_email, p_first_name, p_last_name, p_phone, 'agent'
  ) RETURNING id INTO v_profile_id;

  -- Create agent record
  INSERT INTO agents (
    profile_id, agent_code, agency_name, license_number, territory, created_by
  ) VALUES (
    v_profile_id, v_agent_code, p_agency_name, p_license_number, p_territory, v_admin_id
  ) RETURNING id INTO v_agent_id;

  RETURN jsonb_build_object(
    'success', true,
    'agent_id', v_agent_id,
    'agent_code', v_agent_code,
    'profile_id', v_profile_id
  );
END;
$$;

-- Function to assign agent to landlord
CREATE OR REPLACE FUNCTION assign_agent_to_landlord(
  p_agent_id uuid,
  p_landlord_id uuid,
  p_assignment_type text DEFAULT 'full',
  p_permissions jsonb DEFAULT '["view", "edit", "create"]'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_admin_id uuid;
BEGIN
  -- Check if caller is admin
  SELECT id INTO v_admin_id 
  FROM admin_users 
  WHERE user_id = auth.uid();
  
  IF v_admin_id IS NULL THEN
    RAISE EXCEPTION 'Only admins can assign agents';
  END IF;

  -- Create assignment
  INSERT INTO agent_assignments (
    agent_id, landlord_id, assigned_by, assignment_type, permissions
  ) VALUES (
    p_agent_id, p_landlord_id, v_admin_id, p_assignment_type, p_permissions
  )
  ON CONFLICT (agent_id, landlord_id) 
  DO UPDATE SET
    assignment_type = p_assignment_type,
    permissions = p_permissions,
    assigned_by = v_admin_id;

  RETURN jsonb_build_object('success', true);
END;
$$;

-- Function to get agent dashboard data
CREATE OR REPLACE FUNCTION get_agent_dashboard(p_agent_id uuid DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_agent_id uuid;
  v_result jsonb;
BEGIN
  -- If no agent_id provided, get current user's agent record
  IF p_agent_id IS NULL THEN
    SELECT id INTO v_agent_id 
    FROM agents 
    WHERE user_id = auth.uid();
  ELSE
    v_agent_id := p_agent_id;
  END IF;

  IF v_agent_id IS NULL THEN
    RAISE EXCEPTION 'Agent not found';
  END IF;

  -- Build dashboard data
  SELECT jsonb_build_object(
    'agent_info', (
      SELECT jsonb_build_object(
        'id', a.id,
        'agent_code', a.agent_code,
        'agency_name', a.agency_name,
        'status', a.status,
        'territory', a.territory
      )
      FROM agents a WHERE a.id = v_agent_id
    ),
    'assigned_landlords', (
      SELECT COALESCE(jsonb_agg(
        jsonb_build_object(
          'id', p.id,
          'name', p.first_name || ' ' || p.last_name,
          'email', p.email,
          'phone', p.phone
        )
      ), '[]'::jsonb)
      FROM agent_assignments aa
      JOIN profiles p ON aa.landlord_id = p.id
      WHERE aa.agent_id = v_agent_id
    ),
    'managed_properties', (
      SELECT COALESCE(jsonb_agg(
        jsonb_build_object(
          'id', pr.id,
          'title', pr.title,
          'status', pr.status,
          'price', pr.price,
          'location', pr.city || ', ' || pr.state
        )
      ), '[]'::jsonb)
      FROM properties pr
      WHERE pr.agent_id = v_agent_id
         OR pr.landlord_id IN (
           SELECT aa.landlord_id FROM agent_assignments aa WHERE aa.agent_id = v_agent_id
         )
    ),
    'stats', (
      SELECT jsonb_build_object(
        'total_properties', COUNT(pr.id),
        'available_properties', COUNT(pr.id) FILTER (WHERE pr.status = 'available'),
        'rented_properties', COUNT(pr.id) FILTER (WHERE pr.status = 'rented'),
        'total_landlords', (
          SELECT COUNT(*) FROM agent_assignments aa WHERE aa.agent_id = v_agent_id
        )
      )
      FROM properties pr
      WHERE pr.agent_id = v_agent_id
         OR pr.landlord_id IN (
           SELECT aa.landlord_id FROM agent_assignments aa WHERE aa.agent_id = v_agent_id
         )
    )
  ) INTO v_result;

  RETURN v_result;
END;
$$;

-- Create default super admin (you'll need to update this with actual user_id after creating the user)
-- This is a placeholder - you'll need to run this after creating the admin user account
/*
INSERT INTO admin_users (user_id, profile_id, admin_level, permissions)
SELECT 
  au.id,
  p.id,
  'super',
  '["manage_users", "manage_agents", "manage_properties", "view_analytics", "system_settings"]'::jsonb
FROM auth.users au
JOIN profiles p ON p.user_id = au.id
WHERE au.email = 'admin@rentory.ng'
ON CONFLICT (user_id) DO NOTHING;
*/

-- Add updated_at triggers for new tables
CREATE TRIGGER update_admin_users_updated_at 
  BEFORE UPDATE ON admin_users 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agents_updated_at 
  BEFORE UPDATE ON agents 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_agents_user_id ON agents(user_id);
CREATE INDEX IF NOT EXISTS idx_agents_agent_code ON agents(agent_code);
CREATE INDEX IF NOT EXISTS idx_agent_assignments_agent_id ON agent_assignments(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_assignments_landlord_id ON agent_assignments(landlord_id);
CREATE INDEX IF NOT EXISTS idx_properties_agent_id ON properties(agent_id);