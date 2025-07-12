import { supabase } from './supabase';

// Admin-specific database operations
export const adminDb = {
  // Create a new agent
  createAgent: async (agentData) => {
    try {
      const { data, error } = await supabase.rpc('create_agent', {
        p_email: agentData.email,
        p_password: agentData.password,
        p_first_name: agentData.firstName,
        p_last_name: agentData.lastName,
        p_phone: agentData.phone,
        p_agency_name: agentData.agencyName,
        p_license_number: agentData.licenseNumber,
        p_territory: agentData.territory || []
      });

      return { data, error };
    } catch (error) {
      console.error('Error creating agent:', error);
      return { data: null, error };
    }
  },

  // Get all agents
  getAgents: async () => {
    try {
      const { data, error } = await supabase
        .from('agents')
        .select(`
          *,
          profiles:profile_id(first_name, last_name, email, phone, avatar_url),
          agent_assignments(
            id,
            landlord_id,
            profiles:landlord_id(first_name, last_name, email)
          )
        `)
        .order('created_at', { ascending: false });

      return { data, error };
    } catch (error) {
      console.error('Error fetching agents:', error);
      return { data: null, error };
    }
  },

  // Assign agent to landlord
  assignAgentToLandlord: async (agentId, landlordId, assignmentType = 'full', permissions = ['view', 'edit', 'create']) => {
    try {
      const { data, error } = await supabase.rpc('assign_agent_to_landlord', {
        p_agent_id: agentId,
        p_landlord_id: landlordId,
        p_assignment_type: assignmentType,
        p_permissions: permissions
      });

      return { data, error };
    } catch (error) {
      console.error('Error assigning agent:', error);
      return { data: null, error };
    }
  },

  // Get all landlords
  getLandlords: async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          properties(count),
          agent_assignments(
            id,
            agent_id,
            agents:agent_id(agent_code, agency_name, profiles:profile_id(first_name, last_name))
          )
        `)
        .eq('user_type', 'landlord')
        .order('created_at', { ascending: false });

      return { data, error };
    } catch (error) {
      console.error('Error fetching landlords:', error);
      return { data: null, error };
    }
  },

  // Get admin dashboard stats
  getAdminStats: async () => {
    try {
      const [
        { count: totalUsers },
        { count: totalProperties },
        { count: totalAgents },
        { count: totalLandlords },
        { count: totalRenters },
        { count: pendingApplications }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('properties').select('*', { count: 'exact', head: true }),
        supabase.from('agents').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('user_type', 'landlord'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('user_type', 'renter'),
        supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'pending')
      ]);

      return {
        data: {
          totalUsers,
          totalProperties,
          totalAgents,
          totalLandlords,
          totalRenters,
          pendingApplications
        },
        error: null
      };
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      return { data: null, error };
    }
  },

  // Update agent status
  updateAgentStatus: async (agentId, status) => {
    try {
      const { data, error } = await supabase
        .from('agents')
        .update({ status })
        .eq('id', agentId)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error updating agent status:', error);
      return { data: null, error };
    }
  },

  // Remove agent assignment
  removeAgentAssignment: async (agentId, landlordId) => {
    try {
      const { error } = await supabase
        .from('agent_assignments')
        .delete()
        .eq('agent_id', agentId)
        .eq('landlord_id', landlordId);

      return { error };
    } catch (error) {
      console.error('Error removing agent assignment:', error);
      return { error };
    }
  }
};

// Agent-specific database operations
export const agentDb = {
  // Get agent dashboard data
  getDashboard: async (agentId = null) => {
    try {
      const { data, error } = await supabase.rpc('get_agent_dashboard', {
        p_agent_id: agentId
      });

      return { data, error };
    } catch (error) {
      console.error('Error fetching agent dashboard:', error);
      return { data: null, error };
    }
  },

  // Get agent's assigned landlords
  getAssignedLandlords: async (agentId) => {
    try {
      const { data, error } = await supabase
        .from('agent_assignments')
        .select(`
          *,
          profiles:landlord_id(*),
          properties:landlord_id(count)
        `)
        .eq('agent_id', agentId);

      return { data, error };
    } catch (error) {
      console.error('Error fetching assigned landlords:', error);
      return { data: null, error };
    }
  },

  // Get properties managed by agent
  getManagedProperties: async (agentId) => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          property_images(*),
          profiles:landlord_id(first_name, last_name, email, phone)
        `)
        .or(`agent_id.eq.${agentId},landlord_id.in.(${
          // Get landlord IDs assigned to this agent
          await supabase
            .from('agent_assignments')
            .select('landlord_id')
            .eq('agent_id', agentId)
            .then(({ data }) => data?.map(a => a.landlord_id).join(',') || '')
        })`)
        .order('created_at', { ascending: false });

      return { data, error };
    } catch (error) {
      console.error('Error fetching managed properties:', error);
      return { data: null, error };
    }
  }
};

export default { adminDb, agentDb };