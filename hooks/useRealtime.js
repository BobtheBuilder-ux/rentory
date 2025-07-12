import { useState, useEffect, useCallback } from 'react';
import { realtime } from '@/lib/supabase';

export const useRealtimeMessages = (conversationId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!conversationId) return;

    let subscription;

    const setupSubscription = () => {
      subscription = realtime.subscribeToMessages(conversationId, (payload) => {
        if (payload.eventType === 'INSERT') {
          setMessages(prev => [...prev, payload.new]);
        }
      });
    };

    setupSubscription();

    return () => {
      if (subscription) {
        realtime.unsubscribe(subscription);
      }
    };
  }, [conversationId]);

  const addMessage = useCallback((message) => {
    setMessages(prev => [...prev, message]);
  }, []);

  return {
    messages,
    loading,
    addMessage,
    setMessages
  };
};

export const useRealtimeApplications = (propertyId) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!propertyId) return;

    let subscription;

    const setupSubscription = () => {
      subscription = realtime.subscribeToApplications(propertyId, (payload) => {
        if (payload.eventType === 'INSERT') {
          setApplications(prev => [...prev, payload.new]);
        } else if (payload.eventType === 'UPDATE') {
          setApplications(prev => 
            prev.map(app => 
              app.id === payload.new.id ? payload.new : app
            )
          );
        } else if (payload.eventType === 'DELETE') {
          setApplications(prev => 
            prev.filter(app => app.id !== payload.old.id)
          );
        }
      });
    };

    setupSubscription();

    return () => {
      if (subscription) {
        realtime.unsubscribe(subscription);
      }
    };
  }, [propertyId]);

  return {
    applications,
    loading,
    setApplications
  };
};

export const useRealtimeNotifications = (userId) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const addNotification = useCallback((notification) => {
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);
  }, []);

  const markAsRead = useCallback((notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    setUnreadCount(0);
  }, []);

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead
  };
};