import { useState, useEffect } from 'react';
import { supabase } from '@/lib/db';

export function useRealtime(tableName, queryParams = {}, callback) {
  useEffect(() => {
    let query = supabase.from(tableName).select('*');

    // Build query based on params
    if (queryParams.where) {
      queryParams.where.forEach(([field, operator, value]) => {
        if (operator === '==') {
          query = query.eq(field, value);
        } else if (operator === 'array-contains') {
          query = query.contains(field, [value]);
        }
      });
    }

    if (queryParams.orderBy) {
      queryParams.orderBy.forEach(([field, direction = 'asc']) => {
        query = query.order(field, { ascending: direction === 'asc' });
      });
    }

    // Set up realtime subscription
    const subscription = query
      .on('*', (payload) => {
        // Handle real-time updates
        loadData();
      })
      .subscribe();

    // Initial data load
    const loadData = async () => {
      const { data, error } = await query;
      if (!error && data) {
        callback(data);
      }
    };

    loadData();

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [tableName, JSON.stringify(queryParams), callback]);
}

// Alternative implementation using Supabase realtime channels
export function useRealtimeChannel(tableName, queryParams = {}, callback) {
  useEffect(() => {
    // Set up realtime channel
    const channel = supabase
      .channel(`realtime-${tableName}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: tableName
      }, (payload) => {
        // Reload data when changes occur
        loadData();
      })
      .subscribe();

    // Initial data load
    const loadData = async () => {
      let query = supabase.from(tableName).select('*');

      // Apply filters
      if (queryParams.where) {
        queryParams.where.forEach(([field, operator, value]) => {
          if (operator === '==') {
            query = query.eq(field, value);
          } else if (operator === 'array-contains') {
            query = query.contains(field, [value]);
          }
        });
      }

      // Apply ordering
      if (queryParams.orderBy) {
        queryParams.orderBy.forEach(([field, direction = 'asc']) => {
          query = query.order(field, { ascending: direction === 'asc' });
        });
      }

      const { data, error } = await query;
      if (!error && data) {
      callback(items);
      } else if (error) {
        console.error(`Realtime ${tableName} error:`, error);
      }
    };

    loadData();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [tableName, JSON.stringify(queryParams), callback]);
}

// Message-specific hook
export function useMessages(conversationId, callback) {
  return useRealtimeChannel('messages', {
    where: [['conversation_id', '==', conversationId]],
    orderBy: [['created_at', 'asc']]
  }, callback);
}

// Conversation-specific hook
export function useConversations(userId, callback) {
  return useRealtimeChannel('conversations', {
    where: [['participants', 'array-contains', userId]],
    orderBy: [['last_message_at', 'desc']]
  }, callback);
}

// Property applications hook
export function useApplications(userId, userType = 'tenant', callback) {
  const field = userType === 'tenant' ? 'applicant_id' : 'landlord_id';
  return useRealtimeChannel('applications', {
    where: [[field, '==', userId]],
    orderBy: [['created_at', 'desc']]
  }, callback);
}

// Property updates hook
export function usePropertyUpdates(propertyId, callback) {
  return useRealtimeChannel('properties', {
    where: [['id', '==', propertyId]]
  }, callback);
}