import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

// Properties
export const properties = {
  getAll: async (filters = {}) => {
    try {
      let q = collection(db, 'properties');
      
      // Apply filters
      if (filters.city) {
        q = query(q, where('city', '>=', filters.city), where('city', '<=', filters.city + '\uf8ff'));
      }
      if (filters.state) {
        q = query(q, where('state', '==', filters.state));
      }
      if (filters.property_type) {
        q = query(q, where('property_type', '==', filters.property_type));
      }
      if (filters.min_price) {
        q = query(q, where('price', '>=', filters.min_price));
      }
      if (filters.max_price) {
        q = query(q, where('price', '<=', filters.max_price));
      }
      if (filters.bedrooms) {
        q = query(q, where('bedrooms', '>=', filters.bedrooms));
      }
      if (filters.bathrooms) {
        q = query(q, where('bathrooms', '>=', filters.bathrooms));
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting properties:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const docRef = doc(db, 'properties', id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('Property not found');
      }

      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } catch (error) {
      console.error('Error getting property:', error);
      throw error;
    }
  },

  create: async (data) => {
    try {
      const docRef = await addDoc(collection(db, 'properties'), {
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
      return {
        id: docRef.id,
        ...data
      };
    } catch (error) {
      console.error('Error creating property:', error);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const docRef = doc(db, 'properties', id);
      await updateDoc(docRef, {
        ...data,
        updated_at: new Date().toISOString()
      });

      return {
        id,
        ...data
      };
    } catch (error) {
      console.error('Error updating property:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      await deleteDoc(doc(db, 'properties', id));
    } catch (error) {
      console.error('Error deleting property:', error);
      throw error;
    }
  }
};

// Users and Profiles
export const users = {
  getProfile: async (userId) => {
    try {
      const docRef = doc(db, 'profiles', userId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return null;
      }

      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  },

  updateProfile: async (userId, data) => {
    try {
      const docRef = doc(db, 'profiles', userId);
      await updateDoc(docRef, {
        ...data,
        updated_at: new Date().toISOString()
      });

      return {
        id: userId,
        ...data
      };
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }
};

// Applications
export const applications = {
  getAll: async (userId, userType = 'tenant') => {
    try {
      let q;
      if (userType === 'tenant') {
        q = query(collection(db, 'applications'), where('applicant_id', '==', userId));
      } else {
        // For landlords, get applications for their properties
        q = query(collection(db, 'applications'), where('landlord_id', '==', userId));
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting applications:', error);
      throw error;
    }
  },

  create: async (data) => {
    try {
      const docRef = await addDoc(collection(db, 'applications'), {
        ...data,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      return {
        id: docRef.id,
        ...data
      };
    } catch (error) {
      console.error('Error creating application:', error);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const docRef = doc(db, 'applications', id);
      await updateDoc(docRef, {
        ...data,
        updated_at: new Date().toISOString()
      });

      return {
        id,
        ...data
      };
    } catch (error) {
      console.error('Error updating application:', error);
      throw error;
    }
  }
};

// Messages and Conversations
export const messages = {
  getConversations: async (userId) => {
    try {
      const q = query(
        collection(db, 'conversations'),
        where('participants', 'array-contains', userId)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting conversations:', error);
      throw error;
    }
  },

  getMessages: async (conversationId) => {
    try {
      const q = query(
        collection(db, 'messages'),
        where('conversation_id', '==', conversationId)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting messages:', error);
      throw error;
    }
  },

  sendMessage: async (data) => {
    try {
      const docRef = await addDoc(collection(db, 'messages'), {
        ...data,
        created_at: new Date().toISOString()
      });

      // Update conversation's last message timestamp
      await updateDoc(doc(db, 'conversations', data.conversation_id), {
        last_message_at: new Date().toISOString()
      });

      return {
        id: docRef.id,
        ...data
      };
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  createConversation: async (data) => {
    try {
      const docRef = await addDoc(collection(db, 'conversations'), {
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_message_at: new Date().toISOString()
      });

      return {
        id: docRef.id,
        ...data
      };
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  }
};

// Saved Properties
export const savedProperties = {
  getAll: async (userId) => {
    try {
      const q = query(
        collection(db, 'saved_properties'),
        where('user_id', '==', userId)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting saved properties:', error);
      throw error;
    }
  },

  save: async (data) => {
    try {
      const docRef = await addDoc(collection(db, 'saved_properties'), {
        ...data,
        created_at: new Date().toISOString()
      });

      return {
        id: docRef.id,
        ...data
      };
    } catch (error) {
      console.error('Error saving property:', error);
      throw error;
    }
  },

  unsave: async (userId, propertyId) => {
    try {
      const q = query(
        collection(db, 'saved_properties'),
        where('user_id', '==', userId),
        where('property_id', '==', propertyId)
      );

      const snapshot = await getDocs(q);
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Error unsaving property:', error);
      throw error;
    }
  }
};