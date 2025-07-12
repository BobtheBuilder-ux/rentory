'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import MessageCenter from '@/components/MessageCenter';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/supabase';

export default function MessagesPage() {
  const { user, profile } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      loadConversations();
    }
  }, [profile]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const { data, error } = await db.getConversations(profile.id);
      if (error) throw error;
      
      setConversations(data || []);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredConversations = conversations.filter(conversation => {
    const otherParticipant = conversation.participant_1 === profile?.id 
      ? conversation.participant_2_profile 
      : conversation.participant_1_profile;
    
    const participantName = `${otherParticipant?.first_name} ${otherParticipant?.last_name}`.toLowerCase();
    const propertyTitle = conversation.properties?.title?.toLowerCase() || '';
    
    return participantName.includes(searchTerm.toLowerCase()) || 
           propertyTitle.includes(searchTerm.toLowerCase());
  });

  const formatLastMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  if (!user) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Card className="max-w-md w-full">
            <CardContent className="p-8 text-center">
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Sign in to view messages
              </h2>
              <p className="text-gray-600 mb-6">
                You need to be logged in to access your messages.
              </p>
              <Button className="bg-green-600 hover:bg-green-700">
                Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
            {/* Conversations List */}
            <div className="lg:col-span-1">
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <MessageCircle className="h-5 w-5 mr-2" />
                      Messages
                    </CardTitle>
                    <Button size="sm" variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search conversations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-0 overflow-y-auto">
                  {loading ? (
                    <div className="p-4 text-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto mb-2"></div>
                      <p className="text-sm text-gray-600">Loading conversations...</p>
                    </div>
                  ) : filteredConversations.length === 0 ? (
                    <div className="p-8 text-center">
                      <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations yet</h3>
                      <p className="text-gray-600 text-sm">
                        Start a conversation by contacting a property owner or renter.
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200">
                      {filteredConversations.map((conversation) => {
                        const otherParticipant = conversation.participant_1 === profile?.id 
                          ? conversation.participant_2_profile 
                          : conversation.participant_1_profile;
                        
                        const lastMessage = conversation.messages?.[conversation.messages.length - 1];
                        const isSelected = selectedConversation === conversation.id;
                        
                        return (
                          <div
                            key={conversation.id}
                            onClick={() => setSelectedConversation(conversation.id)}
                            className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                              isSelected ? 'bg-green-50 border-r-2 border-green-600' : ''
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={otherParticipant?.avatar_url} alt={otherParticipant?.first_name} />
                                <AvatarFallback>
                                  {otherParticipant?.first_name?.[0]}{otherParticipant?.last_name?.[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <h3 className="font-medium text-gray-900 truncate">
                                    {otherParticipant?.first_name} {otherParticipant?.last_name}
                                  </h3>
                                  {lastMessage && (
                                    <span className="text-xs text-gray-500">
                                      {formatLastMessageTime(conversation.last_message_at)}
                                    </span>
                                  )}
                                </div>
                                {conversation.properties && (
                                  <p className="text-sm text-gray-600 truncate">
                                    {conversation.properties.title}
                                  </p>
                                )}
                                {lastMessage && (
                                  <p className="text-sm text-gray-500 truncate">
                                    {lastMessage.content}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Message Center */}
            <div className="lg:col-span-2">
              {selectedConversation ? (
                <MessageCenter 
                  conversationId={selectedConversation}
                  onClose={() => setSelectedConversation(null)}
                />
              ) : (
                <Card className="h-full">
                  <CardContent className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Select a conversation
                      </h3>
                      <p className="text-gray-600">
                        Choose a conversation from the list to start messaging.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}