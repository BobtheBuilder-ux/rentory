import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database operations
export const db = {
  // Properties
  getProperties: async (filters = {}) => {
    try {
      let query = supabase.from('properties').select('*');
      
      if (filters.city) query = query.ilike('city', `%${filters.city}%`);
      if (filters.state) query = query.eq('state', filters.state);
      if (filters.property_type) query = query.eq('property_type', filters.property_type);
      if (filters.min_price) query = query.gte('price', filters.min_price);
      if (filters.max_price) query = query.lte('price', filters.max_price);
      if (filters.bedrooms) query = query.gte('bedrooms', filters.bedrooms);
      if (filters.bathrooms) query = query.gte('bathrooms', filters.bathrooms);
      
      const { data, error } = await query;
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  getProperty: async (id) => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  createProperty: async (propertyData) => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .insert(propertyData)
        .select()
        .single();
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  updateProperty: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  deleteProperty: async (id) => {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);
      return { error };
    } catch (error) {
      return { error };
    }
  },

  // Applications
  getApplications: async (userId, userType = 'tenant') => {
    try {
      const field = userType === 'tenant' ? 'applicant_id' : 'landlord_id';
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq(field, userId)
        .order('created_at', { ascending: false });
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  createApplication: async (applicationData) => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .insert(applicationData)
        .select()
        .single();
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  updateApplication: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Conversations
  getConversations: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          participant_1_profile:profiles!conversations_participant_1_fkey(*),
          participant_2_profile:profiles!conversations_participant_2_fkey(*),
          properties(*)
        `)
        .or(`participant_1.eq.${userId},participant_2.eq.${userId}`)
        .order('last_message_at', { ascending: false });
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  createConversation: async (participant1, participant2, propertyId = null) => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          participant_1: participant1,
          participant_2: participant2,
          property_id: propertyId,
          participants: [participant1, participant2]
        })
        .select()
        .single();
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Messages
  getMessages: async (conversationId) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          profiles(*)
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  sendMessage: async (conversationId, senderId, content) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: senderId,
          content: content
        })
        .select()
        .single();
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Saved Properties
  getSavedProperties: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('saved_properties')
        .select(`
          *,
          properties(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  saveProperty: async (userId, propertyId) => {
    try {
      const { data, error } = await supabase
        .from('saved_properties')
        .insert({
          user_id: userId,
          property_id: propertyId
        })
        .select()
        .single();
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }
};