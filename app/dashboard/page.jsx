'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus, Heart, MessageCircle, Calendar, Bell, Settings, Home, User, MapPin, Star, CheckCircle, Eye, TrendingUp, Users, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';

export default function Dashboard() {
  const router = useRouter();
  const { user, profile, isAuthenticated, loading } = useAuth();

  const [stats, setStats] = useState({
    savedProperties: 12,
    applications: 3,
    messages: 8,
    viewedProperties: 45
  });

  const [savedProperties, setSavedProperties] = useState([]);
  const [applications, setApplications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (profile && user) {
      loadDashboardData();
    }
  }, [loading, isAuthenticated, profile, user, router]);

  const loadDashboardData = async () => {
    try {
      // Load saved properties
      const savedResponse = await fetch(`/api/saved-properties?user_id=${profile.id}`);
      if (savedResponse.ok) {
        const savedData = await savedResponse.json();
        setSavedProperties(savedData);
      }

      // Load applications
      const appsResponse = await fetch(`/api/applications?user_id=${profile.id}&user_type=${profile.user_type}`);
      if (appsResponse.ok) {
        const appsData = await appsResponse.json();
        setApplications(appsData);
      }

      // Load conversations/messages
      const messagesResponse = await fetch(`/api/conversations?user_id=${profile.id}`);
      if (messagesResponse.ok) {
        const messagesData = await messagesResponse.json();
        setMessages(messagesData.slice(0, 3)); // Show only recent messages
      }

      // Update stats
      setStats({
        savedProperties: savedProperties.length,
        applications: applications.length,
        messages: messages.filter(m => m.unread).length,
        viewedProperties: 45 // This would come from analytics
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const removeSavedProperty = (propertyId) => {
    setSavedProperties(prev => prev.filter(prop => prop.id !== propertyId));
    setStats(prev => ({ ...prev, savedProperties: prev.savedProperties - 1 }));
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="h-12 w-12 mr-4">
                  <AvatarImage src={profile?.avatar_url} alt={profile?.first_name} />
                  <AvatarFallback>
                    {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Welcome back, {profile?.first_name}!
                  </h1>
                  <p className="text-gray-600">
                    {profile?.user_type === 'renter' ? 'Find your perfect home' : 'Manage your properties'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/notifications')}>
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                  {notifications.filter(n => !n.read).length > 0 && (
                    <Badge className="ml-2 bg-red-500">
                      {notifications.filter(n => !n.read).length}
                    </Badge>
                  )}
                </Button>
                <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/settings')}>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Heart className="h-8 w-8 text-red-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Saved Properties</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.savedProperties}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Building className="h-8 w-8 text-blue-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Applications</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.applications}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <MessageCircle className="h-8 w-8 text-green-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Messages</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.messages}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Eye className="h-8 w-8 text-purple-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Properties Viewed</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.viewedProperties}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="saved" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="saved">Saved Properties</TabsTrigger>
                  <TabsTrigger value="applications">Applications</TabsTrigger>
                  <TabsTrigger value="activity">Recent Activity</TabsTrigger>
                </TabsList>

                <TabsContent value="saved" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900">Your Saved Properties</h2>
                    <Button variant="outline" size="sm" onClick={() => router.push('/search')}>
                      <Search className="h-4 w-4 mr-2" />
                      Browse More
                    </Button>
                  </div>
                  
                  {savedProperties.length === 0 ? (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No saved properties yet</h3>
                        <p className="text-gray-600 mb-4">Start browsing and save properties you're interested in</p>
                        <Button className="bg-green-600 hover:bg-green-700" onClick={() => router.push('/search')}>
                          <Search className="h-4 w-4 mr-2" />
                          Browse Properties
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {savedProperties.map((property) => (
                        <Card key={property.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-4">
                              <img
                                src={property.image}
                                alt={property.title}
                                className="w-24 h-24 rounded-lg object-cover"
                              />
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900">{property.title}</h3>
                                <div className="flex items-center text-gray-600 text-sm mt-1">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  {property.location}
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                  <div>
                                    <span className="text-lg font-bold text-green-600">{formatPrice(property.price)}</span>
                                    <span className="text-sm text-gray-500 ml-1">per year</span>
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {property.bedrooms} bed • {property.bathrooms} bath
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col space-y-2">
                                <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => router.push(`/property/${property.id}`)}>
                                  View Details
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeSavedProperty(property.id)}
                                >
                                  <Heart className="h-4 w-4 mr-1 text-red-500 fill-current" />
                                  Remove
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="applications" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900">Your Applications</h2>
                    <Button variant="outline" size="sm" onClick={() => router.push('/list-property')}>
                      <Plus className="h-4 w-4 mr-2" />
                      New Application
                    </Button>
                  </div>
                  
                  {applications.length === 0 ? (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <Building className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                        <p className="text-gray-600 mb-4">Start applying for properties you're interested in</p>
                        <Button className="bg-green-600 hover:bg-green-700" onClick={() => router.push('/search')}>
                          <Search className="h-4 w-4 mr-2" />
                          Browse Properties
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {applications.map((application) => (
                        <Card key={application.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900">{application.property}</h3>
                                <div className="flex items-center text-gray-600 text-sm mt-1">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  {application.location}
                                </div>
                                <div className="flex items-center mt-2 text-sm text-gray-600">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  Applied on {formatDate(application.appliedDate)}
                                </div>
                                <div className="flex items-center mt-1 text-sm text-gray-600">
                                  <User className="h-4 w-4 mr-1" />
                                  Landlord: {application.landlord}
                                </div>
                              </div>
                              <div className="flex items-center space-x-3">
                                <Badge className={application.statusColor}>
                                  {application.status}
                                </Badge>
                                <Button variant="outline" size="sm" onClick={() => router.push(`/property/${application.property_id}`)}>
                                  View Details
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="activity" className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                  
                  {notifications.length === 0 ? (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No recent activity</h3>
                        <p className="text-gray-600">Your recent activity will appear here</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {notifications.map((notification) => (
                        <Card key={notification.id} className={`hover:shadow-md transition-shadow ${!notification.read ? 'bg-blue-50' : ''}`}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
                              </div>
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markNotificationAsRead(notification.id)}
                                >
                                  Mark as Read
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1">
              {/* Quick Actions */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start bg-green-600 hover:bg-green-700" onClick={() => router.push('/search')}>
                    <Search className="h-4 w-4 mr-2" />
                    Search Properties
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/dashboard/alerts')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Search Alert
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/contact')}>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/dashboard/settings')}>
                    <Settings className="h-4 w-4 mr-2" />
                    Update Profile
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Messages */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Messages</CardTitle>
                </CardHeader>
                <CardContent>
                  {messages.length === 0 ? (
                    <div className="text-center py-4">
                      <MessageCircle className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">No messages yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.slice(0, 3).map((message) => (
                        <div key={message.id} className="flex items-start space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={message.avatar} alt={message.sender} />
                            <AvatarFallback>{message.sender.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900">{message.sender}</p>
                              {message.unread && (
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 truncate">{message.message}</p>
                            <p className="text-xs text-gray-400 mt-1">{message.time}</p>
                          </div>
                        </div>
                      ))}
                      <Button variant="outline" className="w-full" size="sm" onClick={() => router.push('/messages')}>
                        View All Messages
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
