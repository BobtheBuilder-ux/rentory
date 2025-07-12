'use client';

import { useState, useEffect } from 'react';
import { Plus, Eye, MessageCircle, Calendar, Settings, Home, TrendingUp, Users, Building, DollarSign, Edit, Trash2, Star, MapPin, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function LandlordDashboard() {
  const [user, setUser] = useState({
    name: 'Sarah Williams',
    email: 'sarah@example.com',
    phone: '+234 803 987 6543',
    type: 'landlord',
    avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150',
    verified: true,
    rating: 4.8,
    reviews: 25,
    memberSince: '2022'
  });

  const [stats, setStats] = useState({
    totalProperties: 8,
    activeListings: 6,
    totalViews: 1247,
    monthlyRevenue: 15600000,
    pendingApplications: 12,
    occupancyRate: 85
  });

  const [properties, setProperties] = useState([
    {
      id: 1,
      title: "Modern 3-Bedroom Apartment",
      location: "Victoria Island, Lagos",
      price: 2500000,
      image: "https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=300",
      bedrooms: 3,
      bathrooms: 2,
      type: "Apartment",
      status: "Available",
      views: 245,
      applications: 8,
      dateAdded: "2024-01-15",
      featured: true
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
      status: "Rented",
      views: 189,
      applications: 15,
      dateAdded: "2024-01-12",
      featured: false
    },
    {
      id: 3,
      title: "Executive 5-Bedroom Villa",
      location: "Banana Island, Lagos",
      price: 8500000,
      image: "https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=300",
      bedrooms: 5,
      bathrooms: 4,
      type: "Villa",
      status: "Available",
      views: 312,
      applications: 12,
      dateAdded: "2024-01-08",
      featured: true
    }
  ]);

  const [applications, setApplications] = useState([
    {
      id: 1,
      applicantName: "John Doe",
      applicantEmail: "john@example.com",
      applicantPhone: "+234 803 123 4567",
      property: "Modern 3-Bedroom Apartment",
      status: "Pending",
      appliedDate: "2024-01-20",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100",
      score: 85
    },
    {
      id: 2,
      applicantName: "Jane Smith",
      applicantEmail: "jane@example.com",
      applicantPhone: "+234 803 234 5678",
      property: "Executive 5-Bedroom Villa",
      status: "Approved",
      appliedDate: "2024-01-18",
      avatar: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=100",
      score: 92
    },
    {
      id: 3,
      applicantName: "Mike Johnson",
      applicantEmail: "mike@example.com",
      applicantPhone: "+234 803 345 6789",
      property: "Modern 3-Bedroom Apartment",
      status: "Under Review",
      appliedDate: "2024-01-16",
      avatar: "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=100",
      score: 78
    }
  ]);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "John Doe",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100",
      message: "I'm interested in viewing your 3-bedroom apartment on Victoria Island. When would be a good time?",
      time: "2 hours ago",
      unread: true,
      property: "Modern 3-Bedroom Apartment"
    },
    {
      id: 2,
      sender: "Jane Smith",
      avatar: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=100",
      message: "Thank you for approving my application. I'm ready to proceed with the lease signing.",
      time: "5 hours ago",
      unread: true,
      property: "Executive 5-Bedroom Villa"
    },
    {
      id: 3,
      sender: "Mike Johnson",
      avatar: "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=100",
      message: "I have a question about the parking arrangements for the apartment.",
      time: "1 day ago",
      unread: false,
      property: "Modern 3-Bedroom Apartment"
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'Rented':
        return 'bg-blue-100 text-blue-800';
      case 'Under Maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getApplicationStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Under Review':
        return 'bg-blue-100 text-blue-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleApplicationAction = (applicationId, action) => {
    setApplications(prev =>
      prev.map(app =>
        app.id === applicationId
          ? { ...app, status: action === 'approve' ? 'Approved' : 'Rejected' }
          : app
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
                  <div className="flex items-center text-gray-600">
                    <span>Landlord Dashboard</span>
                    <span className="mx-2">•</span>
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    <span>{user.rating} ({user.reviews} reviews)</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Property
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Building className="h-8 w-8 text-blue-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Properties</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalProperties}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Home className="h-8 w-8 text-green-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Listings</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.activeListings}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Eye className="h-8 w-8 text-purple-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Views</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <DollarSign className="h-8 w-8 text-yellow-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                    <p className="text-xl font-bold text-gray-900">{formatPrice(stats.monthlyRevenue)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-indigo-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Applications</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.pendingApplications}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-red-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.occupancyRate}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="properties" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="properties">My Properties</TabsTrigger>
                  <TabsTrigger value="applications">Applications</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>

                <TabsContent value="properties" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900">Your Properties</h2>
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Property
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {properties.map((property) => (
                      <Card key={property.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-4">
                            <img
                              src={property.image}
                              alt={property.title}
                              className="w-24 h-24 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-gray-900">{property.title}</h3>
                                <div className="flex items-center space-x-2">
                                  <Badge className={getStatusColor(property.status)}>
                                    {property.status}
                                  </Badge>
                                  {property.featured && (
                                    <Badge variant="outline" className="border-yellow-400 text-yellow-600">
                                      Featured
                                    </Badge>
                                  )}
                                </div>
                              </div>
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
                              <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
                                <div className="flex items-center space-x-4">
                                  <span>{property.views} views</span>
                                  <span>{property.applications} applications</span>
                                </div>
                                <span>Listed {formatDate(property.dateAdded)}</span>
                              </div>
                            </div>
                            <div className="flex flex-col space-y-2">
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="applications" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900">Rental Applications</h2>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{applications.length} total</Badge>
                      <Badge className="bg-yellow-100 text-yellow-800">
                        {applications.filter(app => app.status === 'Pending').length} pending
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {applications.map((application) => (
                      <Card key={application.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={application.avatar} alt={application.applicantName} />
                                <AvatarFallback>{application.applicantName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold text-gray-900">{application.applicantName}</h3>
                                <p className="text-sm text-gray-600">{application.property}</p>
                                <div className="flex items-center mt-1 text-sm text-gray-500">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  Applied {formatDate(application.appliedDate)}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="text-center">
                                <p className="text-sm font-medium text-gray-600">Score</p>
                                <p className="text-lg font-bold text-green-600">{application.score}%</p>
                              </div>
                              <Badge className={getApplicationStatusColor(application.status)}>
                                {application.status}
                              </Badge>
                              {application.status === 'Pending' && (
                                <div className="flex space-x-2">
                                  <Button
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={() => handleApplicationAction(application.id, 'approve')}
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-red-600 hover:text-red-700"
                                    onClick={() => handleApplicationAction(application.id, 'reject')}
                                  >
                                    Reject
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900">Property Analytics</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Monthly Revenue</CardTitle>
                        <CardDescription>Total rental income this month</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-green-600 mb-2">
                          {formatPrice(stats.monthlyRevenue)}
                        </div>
                        <Progress value={75} className="mb-2" />
                        <p className="text-sm text-gray-600">+12% from last month</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Occupancy Rate</CardTitle>
                        <CardDescription>Properties currently occupied</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-blue-600 mb-2">
                          {stats.occupancyRate}%
                        </div>
                        <Progress value={stats.occupancyRate} className="mb-2" />
                        <p className="text-sm text-gray-600">6 of 8 properties occupied</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Property Views</CardTitle>
                        <CardDescription>Total views across all properties</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-purple-600 mb-2">
                          {stats.totalViews.toLocaleString()}
                        </div>
                        <Progress value={60} className="mb-2" />
                        <p className="text-sm text-gray-600">+8% from last month</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Application Rate</CardTitle>
                        <CardDescription>Applications per property view</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-yellow-600 mb-2">
                          3.2%
                        </div>
                        <Progress value={32} className="mb-2" />
                        <p className="text-sm text-gray-600">Above average conversion</p>
                      </CardContent>
                    </Card>
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
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Property
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message Center
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Account Settings
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
                          <p className="text-xs text-gray-500 mb-1">{message.property}</p>
                          <p className="text-xs text-gray-600 truncate">{message.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{message.time}</p>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full" size="sm">
                      <MessageCircle className="h-4 w-4 mr-2" />
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