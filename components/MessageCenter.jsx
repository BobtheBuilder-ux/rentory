'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRealtime } from '@/hooks/useRealtime';
import { messages } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar } from '@/components/ui/avatar';
import LiveChat from './LiveChat';

export default function MessageCenter() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);

  // Subscribe to conversations using our realtime hook
  useConversations(user?.uid, (conversations) => {
    setConversations(conversations);
  });

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  const getRecipientId = (conversation) => {
    return conversation.participants.find(id => id !== user?.uid);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-white rounded-lg shadow">
      {/* Conversations List */}
      <div className="w-1/3 border-r">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Messages</h2>
        </div>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => handleSelectConversation(conversation)}
              className={`w-full p-4 flex items-center space-x-3 hover:bg-gray-50 transition-colors ${
                selectedConversation?.id === conversation.id ? 'bg-gray-50' : ''
              }`}
            >
              <Avatar
                className="h-10 w-10"
                src={conversation.recipient_profile?.avatar_url}
              />
              <div className="flex-1 text-left">
                <p className="font-medium">
                  {conversation.recipient_profile?.first_name} {conversation.recipient_profile?.last_name}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {conversation.last_message}
                </p>
              </div>
              {conversation.unread_count > 0 && (
                <div className="h-6 w-6 rounded-full bg-green-600 text-white flex items-center justify-center text-xs">
                  {conversation.unread_count}
                </div>
              )}
            </button>
          ))}
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1">
        {selectedConversation ? (
          <LiveChat
            conversationId={selectedConversation.id}
            recipientId={getRecipientId(selectedConversation)}
          />
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Select a conversation
              </h3>
              <p className="text-gray-500">
                Choose a conversation from the list to start chatting
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}