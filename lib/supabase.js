import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Auth helpers
export const auth = {
  signUp: async (email, password, userData) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    return { data, error };
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  getCurrentSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  },

  getUserProfile: async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        admin_users(*),
        agents(*)
      `)
      .eq('user_id', userId)
      .single();
    return { data, error };
  },
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback);
  }
};

// Database helpers
export const db = {
  // Properties
  getProperties: async (filters = {}) => {
    let query = supabase
      .from('properties')
      .select(`
        *,
        property_images(*),
        property_amenities(*),
        profiles:landlord_id(first_name, last_name, avatar_url, verification_status)
      `)
      .eq('status', 'available');

    if (filters.city) {
      query = query.ilike('city', `%${filters.city}%`);
    }
    if (filters.state) {
      query = query.ilike('state', `%${filters.state}%`);
    }
    if (filters.property_type) {
      query = query.eq('property_type', filters.property_type);
    }
    if (filters.min_price) {
      query = query.gte('price', filters.min_price);
    }
    if (filters.max_price) {
      query = query.lte('price', filters.max_price);
    }
    if (filters.bedrooms) {
      query = query.gte('bedrooms', filters.bedrooms);
    }
    if (filters.bathrooms) {
      query = query.gte('bathrooms', filters.bathrooms);
    }

    const { data, error } = await query;
    return { data, error };
  },

  getProperty: async (id) => {
    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        property_images(*),
        property_amenities(*),
        profiles:landlord_id(*),
        reviews(*, profiles:reviewer_id(first_name, last_name, avatar_url))
      `)
      .eq('id', id)
      .single();
    return { data, error };
  },

  createProperty: async (propertyData) => {
    const { data, error } = await supabase
      .from('properties')
      .insert(propertyData)
      .select()
      .single();
    return { data, error };
  },

  updateProperty: async (id, updates) => {
    const { data, error } = await supabase
      .from('properties')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  deleteProperty: async (id) => {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);
    return { error };
  },

  // Property Images
  addPropertyImages: async (propertyId, images) => {
    const imageData = images.map((image, index) => ({
      property_id: propertyId,
      image_url: image.url,
      alt_text: image.alt || '',
      is_primary: index === 0,
      display_order: index
    }));

    const { data, error } = await supabase
      .from('property_images')
      .insert(imageData);
    return { data, error };
  },

  // Property Amenities
  addPropertyAmenities: async (propertyId, amenities) => {
    const amenityData = amenities.map(amenity => ({
      property_id: propertyId,
      amenity
    }));

    const { data, error } = await supabase
      .from('property_amenities')
      .insert(amenityData);
    return { data, error };
  },

  // User Profile
  getProfile: async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    return { data, error };
  },

  updateProfile: async (userId, updates) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();
    return { data, error };
  },

  // Applications
  getApplications: async (userId, userType = 'renter') => {
    let query = supabase
      .from('applications')
      .select(`
        *,
        properties(*),
        profiles:applicant_id(*)
      `);

    if (userType === 'renter') {
      query = query.eq('applicant_id', userId);
    } else {
      query = query.in('property_id', 
        supabase.from('properties').select('id').eq('landlord_id', userId)
      );
    }

    const { data, error } = await query;
    return { data, error };
  },

  createApplication: async (applicationData) => {
    const { data, error } = await supabase
      .from('applications')
      .insert(applicationData)
      .select()
      .single();
    return { data, error };
  },

  updateApplication: async (id, updates) => {
    const { data, error } = await supabase
      .from('applications')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  // Saved Properties
  getSavedProperties: async (userId) => {
    const { data, error } = await supabase
      .from('saved_properties')
      .select(`
        *,
        properties(*, property_images(*), profiles:landlord_id(*))
      `)
      .eq('user_id', userId);
    return { data, error };
  },

  saveProperty: async (userId, propertyId) => {
    const { data, error } = await supabase
      .from('saved_properties')
      .insert({ user_id: userId, property_id: propertyId });
    return { data, error };
  },

  unsaveProperty: async (userId, propertyId) => {
    const { error } = await supabase
      .from('saved_properties')
      .delete()
      .eq('user_id', userId)
      .eq('property_id', propertyId);
    return { error };
  },

  // Messages and Conversations
  getConversations: async (userId) => {
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        participant_1_profile:participant_1(*),
        participant_2_profile:participant_2(*),
        properties(*),
        messages(content, created_at, sender_id)
      `)
      .or(`participant_1.eq.${userId},participant_2.eq.${userId}`)
      .order('last_message_at', { ascending: false });
    return { data, error };
  },

  getMessages: async (conversationId) => {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        profiles:sender_id(first_name, last_name, avatar_url)
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    return { data, error };
  },

  sendMessage: async (conversationId, senderId, content) => {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: senderId,
        content
      });

    // Update conversation last_message_at
    await supabase
      .from('conversations')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', conversationId);

    return { data, error };
  },

  createConversation: async (participant1, participant2, propertyId = null) => {
    const { data, error } = await supabase
      .from('conversations')
      .insert({
        participant_1: participant1,
        participant_2: participant2,
        property_id: propertyId
      })
      .select()
      .single();
    return { data, error };
  },

  // Reviews
  getPropertyReviews: async (propertyId) => {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        profiles:reviewer_id(first_name, last_name, avatar_url)
      `)
      .eq('property_id', propertyId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  createReview: async (reviewData) => {
    const { data, error } = await supabase
      .from('reviews')
      .insert(reviewData)
      .select()
      .single();
    return { data, error };
  }
};

// Real-time subscriptions
export const realtime = {
  subscribeToMessages: (conversationId, callback) => {
    return supabase
      .channel(`messages:${conversationId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      }, callback)
      .subscribe();
  },

  subscribeToApplications: (propertyId, callback) => {
    return supabase
      .channel(`applications:${propertyId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'applications',
        filter: `property_id=eq.${propertyId}`
      }, callback)
      .subscribe();
  },

  unsubscribe: (subscription) => {
    return supabase.removeChannel(subscription);
  }
};

export default supabase;