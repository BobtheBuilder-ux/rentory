import { useState, useEffect, useCallback } from 'react';
import { onSnapshot, collection, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function useRealtime(collectionName, queryParams = {}, callback) {
  useEffect(() => {
    let q = collection(db, collectionName);

    // Build query based on params
    if (queryParams.where) {
      queryParams.where.forEach(([field, operator, value]) => {
        q = query(q, where(field, operator, value));
      });
    }

    if (queryParams.orderBy) {
      queryParams.orderBy.forEach(([field, direction = 'asc']) => {
        q = query(q, orderBy(field, direction));
      });
    }

    // Set up realtime listener
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(items);
    }, (error) => {
      console.error(`Realtime ${collectionName} error:`, error);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [collectionName, JSON.stringify(queryParams), callback]);
}

// Message-specific hook
export function useMessages(conversationId, callback) {
  return useRealtime('messages', {
    where: [['conversation_id', '==', conversationId]],
    orderBy: [['created_at', 'asc']]
  }, callback);
}

// Conversation-specific hook
export function useConversations(userId, callback) {
  return useRealtime('conversations', {
    where: [['participants', 'array-contains', userId]],
    orderBy: [['last_message_at', 'desc']]
  }, callback);
}

// Property applications hook
export function useApplications(userId, userType = 'tenant', callback) {
  const field = userType === 'tenant' ? 'applicant_id' : 'landlord_id';
  return useRealtime('applications', {
    where: [[field, '==', userId]],
    orderBy: [['created_at', 'desc']]
  }, callback);
}

// Property updates hook
export function usePropertyUpdates(propertyId, callback) {
  return useRealtime('properties', {
    where: [['id', '==', propertyId]]
  }, callback);
}