import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Admin-specific database operations
export const adminDb = {
  // Create a new agent
  createAgent: async (agentData) => {
    try {
      const { data: userRecord, error: userError } = await supabase.auth.admin.createUser({
        email: agentData.email,
        password: agentData.password,
        user_metadata: {
          first_name: agentData.firstName,
          last_name: agentData.lastName,
          phone: agentData.phone,
          user_type: 'agent'
        }
      });

      if (userError) throw userError;

      const { data: agentData, error: agentError } = await supabase
        .from('agents')
        .insert({
          id: userRecord.user.id,
        ...agentData,
        created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (agentError) throw agentError;

      return { data: agentData, error: null };
    } catch (error) {
      console.error('Error creating agent:', error);
      return { data: null, error };
    }
  },

  // Get all agents
  getAgents: async () => {
    try {
      const { data: agents, error } = await supabase
        .from('agents')
        .select(`
          *,
          profiles(*),
          agent_assignments(
            *,
            profiles(*)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { data: agents || [], error: null };
    } catch (error) {
      console.error('Error fetching agents:', error);
      return { data: null, error };
    }
  },

  // Assign agent to landlord
  assignAgentToLandlord: async (agentId, landlordId, assignmentType = 'full', permissions = ['view', 'edit', 'create']) => {
    try {
      const { data: assignment, error } = await supabase
        .from('agent_assignments')
        .insert({
        agent_id: agentId,
        landlord_id: landlordId,
        assignment_type: assignmentType,
        permissions: permissions,
        created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      return { data: assignment, error: null };
    } catch (error) {
      console.error('Error assigning agent:', error);
      return { data: null, error };
    }
  },

  // Get all landlords
  getLandlords: async () => {
    try {
      const { data: landlords, error } = await supabase
        .from('profiles')
        .select(`
          *,
          properties(count),
          agent_assignments(
            *,
            agents(
              *,
              profiles(*)
            )
          )
        `)
        .eq('user_type', 'landlord')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { data: landlords || [], error: null };
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
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('user_type', 'tenant'),
        supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'pending')
      ]);

      return {
        data: {
          totalUsers: totalUsers || 0,
          totalProperties: totalProperties || 0,
          totalAgents: totalAgents || 0,
          totalLandlords: totalLandlords || 0,
          totalRenters: totalRenters || 0,
          pendingApplications: pendingApplications || 0
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
      const { data: updatedAgent, error } = await supabase
        .from('agents')
        .update({ status })
        .eq('id', agentId)
        .select()
        .single();

      if (error) throw error;

      return { data: updatedAgent, error: null };
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

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error('Error removing agent assignment:', error);
      return { error };
    }
  },

  // Verify landlord
  verifyLandlord: async (userId, status) => {
    try {
      const { data: updatedProfile, error } = await supabase
        .from('profiles')
        .update({
        verification_status: status,
        updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      return { data: updatedProfile, error: null };
    } catch (error) {
      console.error('Error verifying landlord:', error);
      return { data: null, error };
    }
  },

  // Get pending verifications
  getPendingVerifications: async () => {
    try {
      const { data: verifications, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_type', 'landlord')
        .eq('verification_status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { data: verifications || [], error: null };
    } catch (error) {
      console.error('Error getting pending verifications:', error);
      return { data: null, error };
    }
  },

  // Assign agent
  assignAgent: async (propertyId, agentId) => {
    try {
      const { error: propertyError } = await supabase
        .from('properties')
        .update({
        agent_id: agentId,
        updated_at: new Date().toISOString()
        })
        .eq('id', propertyId);

      if (propertyError) throw propertyError;

      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
        user_id: agentId,
        type: 'agent_assignment',
        property_id: propertyId,
        read: false,
        created_at: new Date().toISOString()
        });

      if (notificationError) throw notificationError;

      return { error: null };
    } catch (error) {
      console.error('Error assigning agent:', error);
      return { error };
    }
  }
};

// Agent-specific database operations
export const agentDb = {
  // Get agent dashboard data
  getDashboard: async (agentId = null) => {
    try {
      const { data: assignments } = await supabase
        .from('agent_assignments')
        .select('landlord_id')
        .eq('agent_id', agentId);

      const landlordIds = assignments?.map(a => a.landlord_id) || [];

      const [
        { count: directProperties },
        { count: managedProperties },
        { count: totalApplications }
      ] = await Promise.all([
        supabase.from('properties').select('*', { count: 'exact', head: true }).eq('agent_id', agentId),
        landlordIds.length > 0 
          ? supabase.from('properties').select('*', { count: 'exact', head: true }).in('owner_id', landlordIds)
          : Promise.resolve({ count: 0 }),
        supabase.from('applications').select('*', { count: 'exact', head: true }).eq('agent_id', agentId)
      ]);

      return {
        data: {
          assigned_landlords: assignments?.length || 0,
          managed_properties: (directProperties || 0) + (managedProperties || 0),
          total_applications: totalApplications || 0,
        },
        error: null
      };
    } catch (error) {
      console.error('Error fetching agent dashboard:', error);
      return { data: null, error };
    }
  },

  // Get agent's assigned landlords
  getAssignedLandlords: async (agentId) => {
    try {
      const { data: assignments, error } = await supabase
        .from('agent_assignments')
        .select(`
          *,
          profiles(*),
          properties(count)
        `)
        .eq('agent_id', agentId);

      if (error) throw error;

      return { data: assignments || [], error: null };
    } catch (error) {
      console.error('Error fetching assigned landlords:', error);
      return { data: null, error };
    }
  },

  // Get properties managed by agent
  getManagedProperties: async (agentId) => {
    try {
      const { data: assignments } = await supabase
        .from('agent_assignments')
        .select('landlord_id')
        .eq('agent_id', agentId);

      const landlordIds = assignments?.map(a => a.landlord_id) || [];

      let query = supabase
        .from('properties')
        .select(`
          *,
          profiles(*)
        `);

      if (landlordIds.length > 0) {
        query = query.or(`agent_id.eq.${agentId},owner_id.in.(${landlordIds.join(',')})`);
      } else {
        query = query.eq('agent_id', agentId);
      }

      const { data: properties, error } = await query;

      if (error) throw error;

      return { data: properties || [], error: null };
    } catch (error) {
      console.error('Error fetching managed properties:', error);
      return { data: null, error };
    }
  }
};

export default { adminDb, agentDb };
