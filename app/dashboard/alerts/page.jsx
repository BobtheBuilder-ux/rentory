'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Plus, Search, MapPin, Home, DollarSign, Trash2, Edit, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';

export default function AlertsPage() {
  const router = useRouter();
  const { user, profile, isAuthenticated, loading } = useAuth();
  const { toast } = useToast();

  const [alerts, setAlerts] = useState([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingAlert, setEditingAlert] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    propertyType: '',
    minPrice: [0],
    maxPrice: [50000000],
    bedrooms: '',
    bathrooms: '',
    keywords: '',
    emailNotifications: true,
    pushNotifications: true,
    frequency: 'immediate'
  });

  const propertyTypes = [
    'Apartment',
    'House',
    'Duplex',
    'Bungalow',
    'Flat',
    'Studio',
    'Penthouse',
    'Townhouse'
  ];

  const locations = [
    'Lagos Island',
    'Victoria Island',
    'Ikoyi',
    'Lekki',
    'Ajah',
    'Surulere',
    'Ikeja',
    'Maryland',
    'Gbagada',
    'Yaba',
    'Abuja',
    'Port Harcourt'
  ];

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (profile && user) {
      loadAlerts();
    }
  }, [loading, isAuthenticated, profile, user, router]);

  const loadAlerts = async () => {
    try {
      const response = await fetch(`/api/alerts?user_id=${profile.id}`);
      if (response.ok) {
        const data = await response.json();
        setAlerts(data);
      }
    } catch (error) {
      console.error('Error loading alerts:', error);
    }
  };

  const handleCreateAlert = async () => {
    try {
      const alertData = {
        ...formData,
        user_id: profile.id,
        min_price: formData.minPrice[0],
        max_price: formData.maxPrice[0],
        created_at: new Date().toISOString(),
        is_active: true
      };

      const response = await fetch('/api/alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(alertData),
      });

      if (response.ok) {
        const newAlert = await response.json();
        setAlerts(prev => [...prev, newAlert]);
        setIsCreateDialogOpen(false);
        resetForm();
        toast({
          title: 'Success',
          description: 'Search alert created successfully!',
        });
      } else {
        throw new Error('Failed to create alert');
      }
    } catch (error) {
      console.error('Error creating alert:', error);
      toast({
        title: 'Error',
        description: 'Failed to create search alert. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateAlert = async () => {
    try {
      const alertData = {
        ...formData,
        min_price: formData.minPrice[0],
        max_price: formData.maxPrice[0],
        updated_at: new Date().toISOString()
      };

      const response = await fetch(`/api/alerts/${editingAlert.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(alertData),
      });

      if (response.ok) {
        const updatedAlert = await response.json();
        setAlerts(prev => prev.map(alert => 
          alert.id === editingAlert.id ? updatedAlert : alert
        ));
        setEditingAlert(null);
        resetForm();
        toast({
          title: 'Success',
          description: 'Search alert updated successfully!',
        });
      } else {
        throw new Error('Failed to update alert');
      }
    } catch (error) {
      console.error('Error updating alert:', error);
      toast({
        title: 'Error',
        description: 'Failed to update search alert. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteAlert = async (alertId) => {
    try {
      const response = await fetch(`/api/alerts/${alertId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setAlerts(prev => prev.filter(alert => alert.id !== alertId));
        toast({
          title: 'Success',
          description: 'Search alert deleted successfully!',
        });
      } else {
        throw new Error('Failed to delete alert');
      }
    } catch (error) {
      console.error('Error deleting alert:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete search alert. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const toggleAlertStatus = async (alertId, isActive) => {
    try {
      const response = await fetch(`/api/alerts/${alertId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: isActive }),
      });

      if (response.ok) {
        setAlerts(prev => prev.map(alert => 
          alert.id === alertId ? { ...alert, is_active: isActive } : alert
        ));
        toast({
          title: 'Success',
          description: `Alert ${isActive ? 'activated' : 'deactivated'} successfully!`,
        });
      }
    } catch (error) {
      console.error('Error toggling alert status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      location: '',
      propertyType: '',
      minPrice: [0],
      maxPrice: [50000000],
      bedrooms: '',
      bathrooms: '',
      keywords: '',
      emailNotifications: true,
      pushNotifications: true,
      frequency: 'immediate'
    });
  };

  const openEditDialog = (alert) => {
    setEditingAlert(alert);
    setFormData({
      name: alert.name,
      location: alert.location,
      propertyType: alert.propertyType,
      minPrice: [alert.min_price],
      maxPrice: [alert.max_price],
      bedrooms: alert.bedrooms,
      bathrooms: alert.bathrooms,
      keywords: alert.keywords,
      emailNotifications: alert.emailNotifications,
      pushNotifications: alert.pushNotifications,
      frequency: alert.frequency
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading alerts...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Search Alerts</h1>
                <p className="text-gray-600">Get notified when properties matching your criteria become available</p>
              </div>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Alert
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create Search Alert</DialogTitle>
                    <DialogDescription>
                      Set up criteria to get notified when matching properties are listed
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Alert Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., 3-bedroom apartment in Lekki"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Select value={formData.location} onValueChange={(value) => setFormData(prev => ({ ...prev, location: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                          <SelectContent>
                            {locations.map((location) => (
                              <SelectItem key={location} value={location}>{location}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="propertyType">Property Type</Label>
                        <Select value={formData.propertyType} onValueChange={(value) => setFormData(prev => ({ ...prev, propertyType: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {propertyTypes.map((type) => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label>Price Range</Label>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Min: {formatPrice(formData.minPrice[0])}</span>
                          <span>Max: {formatPrice(formData.maxPrice[0])}</span>
                        </div>
                        <div className="space-y-2">
                          <Slider
                            value={formData.minPrice}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, minPrice: value }))}
                            max={50000000}
                            step={100000}
                            className="w-full"
                          />
                          <Slider
                            value={formData.maxPrice}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, maxPrice: value }))}
                            max={50000000}
                            step={100000}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="bedrooms">Bedrooms</Label>
                        <Select value={formData.bedrooms} onValueChange={(value) => setFormData(prev => ({ ...prev, bedrooms: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Any" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="4">4</SelectItem>
                            <SelectItem value="5+">5+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="bathrooms">Bathrooms</Label>
                        <Select value={formData.bathrooms} onValueChange={(value) => setFormData(prev => ({ ...prev, bathrooms: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Any" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="4">4</SelectItem>
                            <SelectItem value="5+">5+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="keywords">Keywords (optional)</Label>
                      <Textarea
                        id="keywords"
                        value={formData.keywords}
                        onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
                        placeholder="e.g., swimming pool, parking, furnished"
                        rows={2}
                      />
                    </div>

                    <div className="space-y-3">
                      <Label>Notification Preferences</Label>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Email notifications</span>
                        <Switch
                          checked={formData.emailNotifications}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, emailNotifications: checked }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Push notifications</span>
                        <Switch
                          checked={formData.pushNotifications}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, pushNotifications: checked }))}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="frequency">Notification Frequency</Label>
                      <Select value={formData.frequency} onValueChange={(value) => setFormData(prev => ({ ...prev, frequency: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="immediate">Immediate</SelectItem>
                          <SelectItem value="daily">Daily digest</SelectItem>
                          <SelectItem value="weekly">Weekly digest</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateAlert} className="bg-green-600 hover:bg-green-700">
                      Create Alert
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {alerts.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <AlertCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No search alerts yet</h3>
                <p className="text-gray-600 mb-6">Create your first search alert to get notified when properties matching your criteria become available</p>
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => setIsCreateDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Alert
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {alerts.map((alert) => (
                <Card key={alert.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{alert.name}</h3>
                          <Badge variant={alert.is_active ? "default" : "secondary"}>
                            {alert.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {alert.location || "Any location"}
                          </div>
                          <div className="flex items-center">
                            <Home className="h-4 w-4 mr-1" />
                            {alert.propertyType || "Any type"}
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            {formatPrice(alert.min_price)} - {formatPrice(alert.max_price)}
                          </div>
                        </div>

                        {alert.bedrooms && (
                          <div className="mt-2 text-sm text-gray-600">
                            {alert.bedrooms} bedrooms • {alert.bathrooms} bathrooms
                          </div>
                        )}

                        {alert.keywords && (
                          <div className="mt-2 text-sm text-gray-600">
                            Keywords: {alert.keywords}
                          </div>
                        )}

                        <div className="mt-3 text-xs text-gray-500">
                          Created {new Date(alert.created_at).toLocaleDateString()} • 
                          Notifications: {alert.frequency}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <Switch
                          checked={alert.is_active}
                          onCheckedChange={(checked) => toggleAlertStatus(alert.id, checked)}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(alert)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteAlert(alert.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Edit Dialog */}
        <Dialog open={!!editingAlert} onOpenChange={() => setEditingAlert(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Search Alert</DialogTitle>
              <DialogDescription>
                Update your search criteria
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Alert Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., 3-bedroom apartment in Lekki"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-location">Location</Label>
                  <Select value={formData.location} onValueChange={(value) => setFormData(prev => ({ ...prev, location: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>{location}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="edit-propertyType">Property Type</Label>
                  <Select value={formData.propertyType} onValueChange={(value) => setFormData(prev => ({ ...prev, propertyType: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {propertyTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Price Range</Label>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Min: {formatPrice(formData.minPrice[0])}</span>
                    <span>Max: {formatPrice(formData.maxPrice[0])}</span>
                  </div>
                  <div className="space-y-2">
                    <Slider
                      value={formData.minPrice}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, minPrice: value }))}
                      max={50000000}
                      step={100000}
                      className="w-full"
                    />
                    <Slider
                      value={formData.maxPrice}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, maxPrice: value }))}
                      max={50000000}
                      step={100000}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-bedrooms">Bedrooms</Label>
                  <Select value={formData.bedrooms} onValueChange={(value) => setFormData(prev => ({ ...prev, bedrooms: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5+">5+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="edit-bathrooms">Bathrooms</Label>
                  <Select value={formData.bathrooms} onValueChange={(value) => setFormData(prev => ({ ...prev, bathrooms: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5+">5+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="edit-keywords">Keywords (optional)</Label>
                <Textarea
                  id="edit-keywords"
                  value={formData.keywords}
                  onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
                  placeholder="e.g., swimming pool, parking, furnished"
                  rows={2}
                />
              </div>

              <div className="space-y-3">
                <Label>Notification Preferences</Label>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Email notifications</span>
                  <Switch
                    checked={formData.emailNotifications}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, emailNotifications: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Push notifications</span>
                  <Switch
                    checked={formData.pushNotifications}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, pushNotifications: checked }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="edit-frequency">Notification Frequency</Label>
                <Select value={formData.frequency} onValueChange={(value) => setFormData(prev => ({ ...prev, frequency: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate</SelectItem>
                    <SelectItem value="daily">Daily digest</SelectItem>
                    <SelectItem value="weekly">Weekly digest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingAlert(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateAlert} className="bg-green-600 hover:bg-green-700">
                Update Alert
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Footer />
    </>
  );
}
