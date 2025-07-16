'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useMessages } from '@/hooks/useRealtime';
import { supabase } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar } from '@/components/ui/avatar';
import { Send } from 'lucide-react';

export default function LiveChat({ conversationId, recipientId }) {
  const { user, profile } = useAuth();
  const [messageText, setMessageText] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const scrollRef = useRef(null);

  // Subscribe to messages using our realtime hook
  useMessages(conversationId, (messages) => {
    setChatMessages(messages);
  });

  // Auto scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content: messageText,
        });

      if (error) throw error;

      setMessageText('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow">
      {/* Chat Header */}
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Chat</h3>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {chatMessages.map((message) => {
            const isOwn = message.sender_id === user?.uid;
            return (
              <div
                key={message.id}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start max-w-[70%] ${isOwn ? 'flex-row-reverse' : ''}`}>
                  <Avatar
                    className="h-8 w-8 mr-2"
                    src={message.profiles?.avatar_url}
                  />
                  <div
                    className={`rounded-lg p-3 ${
                      isOwn
                        ? 'bg-green-600 text-white ml-2'
                        : 'bg-gray-100 text-gray-900 mr-2'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <span className="text-xs mt-1 block opacity-70">
                      {new Date(message.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex space-x-2">
          <Input
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
