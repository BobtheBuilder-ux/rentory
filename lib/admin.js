import { db, auth } from './firebase-admin';

// Admin-specific database operations
export const adminDb = {
  // Create a new agent
  createAgent: async (agentData) => {
    try {
      const userRecord = await auth.createUser({
        email: agentData.email,
        password: agentData.password,
        displayName: `${agentData.firstName} ${agentData.lastName}`,
        phoneNumber: agentData.phone,
      });

      await auth.setCustomUserClaims(userRecord.uid, { role: 'agent' });

      const agentRef = db.collection('agents').doc(userRecord.uid);
      await agentRef.set({
        ...agentData,
        profile_id: userRecord.uid,
        created_at: new Date().toISOString(),
      });

      const agentProfile = await agentRef.get();
      return { data: { id: agentProfile.id, ...agentProfile.data() }, error: null };
    } catch (error) {
      console.error('Error creating agent:', error);
      return { data: null, error };
    }
  },

  // Get all agents
  getAgents: async () => {
    try {
      const snapshot = await db.collection('agents').orderBy('created_at', 'desc').get();
      const agents = await Promise.all(snapshot.docs.map(async (doc) => {
        const agent = { id: doc.id, ...doc.data() };
        const profileSnap = await db.collection('profiles').doc(agent.profile_id).get();
        agent.profiles = profileSnap.exists ? profileSnap.data() : null;
        const assignmentsSnap = await db.collection('agent_assignments').where('agent_id', '==', doc.id).get();
        agent.agent_assignments = await Promise.all(assignmentsSnap.docs.map(async (assignmentDoc) => {
          const assignment = { id: assignmentDoc.id, ...assignmentDoc.data() };
          const landlordSnap = await db.collection('profiles').doc(assignment.landlord_id).get();
          assignment.profiles = landlordSnap.exists ? landlordSnap.data() : null;
          return assignment;
        }));
        return agent;
      }));
      return { data: agents, error: null };
    } catch (error) {
      console.error('Error fetching agents:', error);
      return { data: null, error };
    }
  },

  // Assign agent to landlord
  assignAgentToLandlord: async (agentId, landlordId, assignmentType = 'full', permissions = ['view', 'edit', 'create']) => {
    try {
      const assignmentRef = await db.collection('agent_assignments').add({
        agent_id: agentId,
        landlord_id: landlordId,
        assignment_type: assignmentType,
        permissions: permissions,
        created_at: new Date().toISOString(),
      });
      const assignment = await assignmentRef.get();
      return { data: { id: assignment.id, ...assignment.data() }, error: null };
    } catch (error) {
      console.error('Error assigning agent:', error);
      return { data: null, error };
    }
  },

  // Get all landlords
  getLandlords: async () => {
    try {
      const snapshot = await db.collection('profiles').where('user_type', '==', 'landlord').orderBy('created_at', 'desc').get();
      const landlords = await Promise.all(snapshot.docs.map(async (doc) => {
        const landlord = { id: doc.id, ...doc.data() };
        const propertiesSnap = await db.collection('properties').where('landlord_id', '==', doc.id).get();
        landlord.properties = { count: propertiesSnap.size };
        const assignmentsSnap = await db.collection('agent_assignments').where('landlord_id', '==', doc.id).get();
        landlord.agent_assignments = await Promise.all(assignmentsSnap.docs.map(async (assignmentDoc) => {
          const assignment = { id: assignmentDoc.id, ...assignmentDoc.data() };
          const agentSnap = await db.collection('agents').doc(assignment.agent_id).get();
          if (agentSnap.exists) {
            const agentData = agentSnap.data();
            const profileSnap = await db.collection('profiles').doc(agentData.profile_id).get();
            assignment.agents = { ...agentData, profiles: profileSnap.exists ? profileSnap.data() : null };
          }
          return assignment;
        }));
        return landlord;
      }));
      return { data: landlords, error: null };
    } catch (error) {
      console.error('Error fetching landlords:', error);
      return { data: null, error };
    }
  },

  // Get admin dashboard stats
  getAdminStats: async () => {
    try {
      const usersSnapshot = await auth.listUsers();
      const propertiesSnapshot = await db.collection('properties').get();
      const agentsSnapshot = await db.collection('agents').get();
      const landlordsSnapshot = await db.collection('profiles').where('user_type', '==', 'landlord').get();
      const rentersSnapshot = await db.collection('profiles').where('user_type', '==', 'renter').get();
      const pendingApplicationsSnapshot = await db.collection('applications').where('status', '==', 'pending').get();

      return {
        data: {
          totalUsers: usersSnapshot.users.length,
          totalProperties: propertiesSnapshot.size,
          totalAgents: agentsSnapshot.size,
          totalLandlords: landlordsSnapshot.size,
          totalRenters: rentersSnapshot.size,
          pendingApplications: pendingApplicationsSnapshot.size
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
      const agentRef = db.collection('agents').doc(agentId);
      await agentRef.update({ status });
      const updatedAgent = await agentRef.get();
      return { data: { id: updatedAgent.id, ...updatedAgent.data() }, error: null };
    } catch (error) {
      console.error('Error updating agent status:', error);
      return { data: null, error };
    }
  },

  // Remove agent assignment
  removeAgentAssignment: async (agentId, landlordId) => {
    try {
      const snapshot = await db.collection('agent_assignments')
        .where('agent_id', '==', agentId)
        .where('landlord_id', '==', landlordId)
        .get();
      
      if (snapshot.empty) {
        return { error: { message: "Assignment not found." } };
      }

      const batch = db.batch();
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      await batch.commit();

      return { error: null };
    } catch (error) {
      console.error('Error removing agent assignment:', error);
      return { error };
    }
  },

  // Verify landlord
  verifyLandlord: async (userId, status) => {
    try {
      // Update profile verification status
      await db.collection('profiles').doc(userId).update({
        verification_status: status,
        updated_at: new Date().toISOString()
      });

      // Set or remove custom claims based on verification status
      const customClaims = {
        verified: status === 'verified',
        role: 'landlord'
      };

      await auth.setCustomUserClaims(userId, customClaims);

      // Get the updated profile
      const profileSnap = await db.collection('profiles').doc(userId).get();
      return { data: { id: profileSnap.id, ...profileSnap.data() }, error: null };
    } catch (error) {
      console.error('Error verifying landlord:', error);
      return { data: null, error };
    }
  },

  // Get pending verifications
  getPendingVerifications: async () => {
    try {
      const snapshot = await db.collection('profiles')
        .where('user_type', '==', 'landlord')
        .where('verification_status', '==', 'pending')
        .orderBy('created_at', 'desc')
        .get();

      const verifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return { data: verifications, error: null };
    } catch (error) {
      console.error('Error getting pending verifications:', error);
      return { data: null, error };
    }
  },

  // Assign agent
  assignAgent: async (propertyId, agentId) => {
    try {
      await db.collection('properties').doc(propertyId).update({
        agent_id: agentId,
        updated_at: new Date().toISOString()
      });

      // Create notification for agent
      await db.collection('notifications').add({
        user_id: agentId,
        type: 'agent_assignment',
        property_id: propertyId,
        read: false,
        created_at: new Date().toISOString()
      });

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
      const assignedLandlordsSnap = await db.collection('agent_assignments').where('agent_id', '==', agentId).get();
      const landlordIds = assignedLandlordsSnap.docs.map(doc => doc.data().landlord_id);

      const propertiesSnap = await db.collection('properties').where('agent_id', '==', agentId).get();
      const managedPropertiesSnap = landlordIds.length > 0 ? await db.collection('properties').where('landlord_id', 'in', landlordIds).get() : { docs: [] };
      
      const applicationsSnap = await db.collection('applications').where('agent_id', '==', agentId).get();

      return {
        data: {
          assigned_landlords: assignedLandlordsSnap.size,
          managed_properties: propertiesSnap.size + managedPropertiesSnap.size,
          total_applications: applicationsSnap.size,
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
      const snapshot = await db.collection('agent_assignments').where('agent_id', '==', agentId).get();
      const landlords = await Promise.all(snapshot.docs.map(async (doc) => {
        const assignment = { id: doc.id, ...doc.data() };
        const profileSnap = await db.collection('profiles').doc(assignment.landlord_id).get();
        assignment.profiles = profileSnap.exists ? profileSnap.data() : null;
        const propertiesSnap = await db.collection('properties').where('landlord_id', '==', assignment.landlord_id).get();
        assignment.properties = { count: propertiesSnap.size };
        return assignment;
      }));
      return { data: landlords, error: null };
    } catch (error) {
      console.error('Error fetching assigned landlords:', error);
      return { data: null, error };
    }
  },

  // Get properties managed by agent
  getManagedProperties: async (agentId) => {
    try {
      const assignedLandlordsSnap = await db.collection('agent_assignments').where('agent_id', '==', agentId).get();
      const landlordIds = assignedLandlordsSnap.docs.map(doc => doc.data().landlord_id);

      const directPropertiesSnap = await db.collection('properties').where('agent_id', '==', agentId).get();
      const assignedPropertiesSnap = landlordIds.length > 0 ? await db.collection('properties').where('landlord_id', 'in', landlordIds).get() : { docs: [] };

      const allProperties = [...directPropertiesSnap.docs, ...assignedPropertiesSnap.docs];

      const properties = await Promise.all(allProperties.map(async (doc) => {
        const property = { id: doc.id, ...doc.data() };
        const imagesSnap = await db.collection('property_images').where('property_id', '==', doc.id).get();
        property.property_images = imagesSnap.docs.map(imgDoc => imgDoc.data());
        const landlordSnap = await db.collection('profiles').doc(property.landlord_id).get();
        property.profiles = landlordSnap.exists ? landlordSnap.data() : null;
        return property;
      }));

      return { data: properties, error: null };
    } catch (error) {
      console.error('Error fetching managed properties:', error);
      return { data: null, error };
    }
  }
};

export default { adminDb, agentDb };
