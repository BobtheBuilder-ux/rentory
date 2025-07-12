'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Heart, MessageCircle, Calendar, Bell, Settings, Home, User, MapPin, Star, CheckCircle, Eye, TrendingUp, Users, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function Dashboard() {
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+234 803 123 4567',
    type: 'renter',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
    verified: true,
    memberSince: '2023'
  });

  const [stats, setStats] = useState({
    savedProperties: 12,
    applications: 3,
    messages: 8,
    viewedProperties: 45
  });

  const [savedProperties, setSavedProperties] = useState([
    {
      id: 1,
      title: "Modern 3-Bedroom Apartment",
      location: "Victoria Island, Lagos",
      price: 2500000,
      image: "https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=300",
      bedrooms: 3,
      bathrooms: 2,
      type: "Apartment",
      saved: true,
      dateAdded: "2024-01-15"
    },
    {
      id: 2,
      title: "Luxury 4-Bedroom Duplex",
      location: "Maitama, Abuja",
      price: 4200000,
      image: "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=300",
      bedrooms: 4,
      bathrooms: 3,
      type: "Duplex",
      saved: true,
      dateAdded: "2024-01-12"
    }
  ]);

  const [applications, setApplications] = useState([
    {
      id: 1,
      property: "Modern 3-Bedroom Apartment",
      location: "Victoria Island, Lagos",
      status: "Under Review",
      appliedDate: "2024-01-20",
      landlord: "John Smith",
      statusColor: "bg-yellow-100 text-yellow-800"
    },
    {
      id: 2,
      property: "Luxury 4-Bedroom Duplex",
      location: "Maitama, Abuja",
      status: "Approved",
      appliedDate: "2024-01-18",
      landlord: "Jane Doe",
      statusColor: "bg-green-100 text-green-800"
    },
    {
      id: 3,
      property: "Cozy 2-Bedroom Flat",
      location: "GRA, Port Harcourt",
      status: "Rejected",
      appliedDate: "2024-01-15",
      landlord: "Mike Johnson",
      statusColor: "bg-red-100 text-red-800"
    }
  ]);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "John Smith",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100",
      message: "Thank you for your interest in my property. When would you like to schedule a viewing?",
      time: "2 hours ago",
      unread: true
    },
    {
      id: 2,
      sender: "Jane Doe",
      avatar: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=100",
      message: "Your application has been approved! Please let me know when you can come for the lease signing.",
      time: "1 day ago",
      unread: true
    },
    {
      id: 3,
      sender: "Mike Johnson",
      avatar: "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=100",
      message: "I'm sorry, but we've decided to go with another applicant. Best of luck with your search!",
      time: "3 days ago",
      unread: false
    }
  ]);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "application",
      title: "Application Update",
      message: "Your application for 'Modern 3-Bedroom Apartment' is under review",
      time: "1 hour ago",
      read: false
    },
    {
      id: 2,
      type: "message",
      title: "New Message",
      message: "You have a new message from John Smith",
      time: "2 hours ago",
      read: false
    },
    {
      id: 3,
      type: "property",
      title: "New Property Match",
      message: "A new property matching your criteria has been listed",
      time: "1 day ago",
      read: true
    }
  ]);

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
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Welcome back, {user.name}!
                  </h1>
                  <p className="text-gray-600">
                    {user.type === 'renter' ? 'Find your perfect home' : 'Manage your properties'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                  {notifications.filter(n => !n.read).length > 0 && (
                    <Badge className="ml-2 bg-red-500">
                      {notifications.filter(n => !n.read).length}
                    </Badge>
                  )}
                </Button>
                <Button variant="outline" size="sm">
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
                    <Button variant="outline" size="sm">
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
                        <Button className="bg-green-600 hover:bg-green-700">
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
                                <Button size="sm" className="bg-green-600 hover:bg-green-700">
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
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      New Application
                    </Button>
                  </div>
                  
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
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="activity" className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                  
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
                  <Button className="w-full justify-start bg-green-600 hover:bg-green-700">
                    <Search className="h-4 w-4 mr-2" />
                    Search Properties
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Search Alert
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
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
                    <Button variant="outline" className="w-full" size="sm">
                      View All Messages
                    </Button>
                  </div>
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