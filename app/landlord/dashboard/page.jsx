'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Eye, MessageCircle, Calendar, Settings, Home, TrendingUp, Users, Building, DollarSign, Edit, Trash2, Star, MapPin, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';

export default function LandlordDashboard() {
  const router = useRouter();
  const { isAuthenticated, isLandlord, loading, profile } = useAuth();

  const [stats, setStats] = useState({
    totalProperties: 8,
    activeListings: 6,
    totalViews: 1247,
    monthlyRevenue: 15600000,
    pendingApplications: 12,
    occupancyRate: 85
  });

  const [properties, setProperties] = useState([]);
  const [applications, setApplications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (!loading && !isLandlord) {
      router.push('/dashboard');
      return;
    }

    if (isLandlord && profile) {
      loadDashboardData();
    }
  }, [loading, isAuthenticated, isLandlord, profile, router]);

  const loadDashboardData = async () => {
    try {
      setDataLoading(true);
      
      let propertiesData = { properties: [] }; // Initialize with default empty
      // Load properties
      const propertiesResponse = await fetch(`/api/properties?landlord_id=${profile.id}`);
      if (propertiesResponse.ok) {
        propertiesData = await propertiesResponse.json();
        setProperties(propertiesData.properties || []);
      }

      let applicationsData = []; // Initialize with default empty
      // Load applications
      const applicationsResponse = await fetch(`/api/applications?user_id=${profile.id}&user_type=landlord`);
      if (applicationsResponse.ok) {
        applicationsData = await applicationsResponse.json();
        setApplications(applicationsData || []);
      }

      // Load messages
      const messagesResponse = await fetch(`/api/conversations?user_id=${profile.id}`);
      if (messagesResponse.ok) {
        const messagesData = await messagesResponse.json();
        setMessages(messagesData.slice(0, 3) || []);
      }

      // Calculate stats from fetched data
      const updatedProperties = propertiesData.properties || [];
      const updatedApplications = applicationsData || [];

      setStats(prev => ({
        ...prev,
        totalProperties: updatedProperties.length,
        activeListings: updatedProperties.filter(p => p.status === 'available').length,
        pendingApplications: updatedApplications.filter(a => a.status === 'pending').length
      }));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setDataLoading(false);
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

  const handleDeleteProperty = async (propertyId) => {
    try {
      const response = await fetch(`/api/properties/${propertyId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setProperties(prev => prev.filter(property => property.id !== propertyId));
        // Optionally update stats if needed, though it might be recalculated on next load
      } else {
        console.error('Failed to delete property');
        // Handle error, e.g., show a toast message
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      // Handle error
    }
  };

  const handleApplicationAction = async (applicationId, action) => {
    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: action === 'approve' ? 'Approved' : 'Rejected' }),
      });
      if (response.ok) {
        setApplications(prev =>
          prev.map(app =>
            app.id === applicationId
              ? { ...app, status: action === 'approve' ? 'Approved' : 'Rejected' }
              : app
          )
        );
      } else {
        console.error('Failed to update application status');
        // Handle error, e.g., show a toast message
      }
    } catch (error) {
      console.error('Error updating application status:', error);
      // Handle error
    }
  };

  if (loading || dataLoading) {
    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: action === 'approve' ? 'Approved' : 'Rejected' }),
      });
      if (response.ok) {
        setApplications(prev =>
          prev.map(app =>
            app.id === applicationId
              ? { ...app, status: action === 'approve' ? 'Approved' : 'Rejected' }
              : app
          )
        );
      } else {
        console.error('Failed to update application status');
        // Handle error, e.g., show a toast message
      }
    } catch (error) {
      console.error('Error updating application status:', error);
      // Handle error
    }
  };

  const handleDeleteProperty = (propertyId) => {
    router.push(`/landlord/delete-property/${propertyId}`);
  };

  if (loading || dataLoading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading landlord dashboard...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!isAuthenticated || !isLandlord) {
    return null; // Will redirect
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
                  <div className="flex items-center text-gray-600">
                    <span>Landlord Dashboard</span>
                    <span className="mx-2">•</span>
                    <span>{properties.length} properties</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button className="bg-green-600 hover:bg-green-700" onClick={() => router.push('/list-property')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Property
                </Button>
                <Button variant="outline" size="sm" onClick={() => router.push('/landlord/settings')}>
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
                    <Button className="bg-green-600 hover:bg-green-700" onClick={() => router.push('/list-property')}>
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
                              <Button size="sm" variant="outline" onClick={() => router.push(`/landlord/edit-property/${property.id}`)}>
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => router.push(`/property/${property.id}`)}>
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700" onClick={() => handleDeleteProperty(property.id)}>
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
                  <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/landlord/analytics')}>
                    <TrendingUp className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/messages')}>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message Center
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/landlord/settings')}>
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
                    <Button variant="outline" className="w-full" size="sm" onClick={() => router.push('/messages')}>
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
