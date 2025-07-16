'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, Bell, Shield, LogOut, Camera, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { uploadProfileImage } from '@/lib/storage';

export default function SettingsPage() {
  const router = useRouter();
  const { user, profile, isAuthenticated, loading, refreshProfile } = useAuth();
  const { toast } = useToast();
  const supabase = createClientComponentClient();

  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    avatar_url: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    email_new_properties: true,
    email_application_updates: true,
    email_messages: true,
    email_promotions: false,
    push_new_properties: true,
    push_application_updates: true,
    push_messages: true,
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (profile) {
      setProfileData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone_number: profile.phone_number || '',
        avatar_url: profile.avatar_url || ''
      });
      setNotificationSettings({
        email_new_properties: profile.email_new_properties ?? true,
        email_application_updates: profile.email_application_updates ?? true,
        email_messages: profile.email_messages ?? true,
        email_promotions: profile.email_promotions ?? false,
        push_new_properties: profile.push_new_properties ?? true,
        push_application_updates: profile.push_application_updates ?? true,
        push_messages: profile.push_messages ?? true,
      });
    }
  }, [loading, isAuthenticated, profile, router]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id);

      if (error) throw error;

      await refreshProfile();
      toast({
        title: 'Success',
        description: 'Profile updated successfully!',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'New passwords do not match.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // This is a simplified password change flow.
      // A real implementation should verify the current password first.
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast({
        title: 'Success',
        description: 'Password changed successfully!',
      });
    } catch (error) {
      console.error('Error changing password:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to change password.',
        variant: 'destructive',
      });
    }
  };

  const handleNotificationChange = async (key, value) => {
    setNotificationSettings(prev => ({ ...prev, [key]: value }));
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ [key]: value })
        .eq('id', user.id);

      if (error) throw error;

      await refreshProfile();
      toast({
        title: 'Success',
        description: 'Notification settings updated.',
      });
    } catch (error) {
      console.error('Error updating notification settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to update notification settings.',
        variant: 'destructive',
      });
    }
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const { data, error } = await uploadProfileImage(user.id, file);
      if (error) throw error;

      setProfileData(prev => ({ ...prev, avatar_url: data.url }));

      // Update profile in Supabase
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: data.url
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      await refreshProfile();
      toast({
        title: 'Success',
        description: 'Avatar updated successfully!',
      });
    } catch (error) {
      console.error('Error updating avatar:', error);
      toast({
        title: 'Error',
        description: 'Failed to update avatar. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading settings...</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600">Manage your account and preferences</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col space-y-1">
                    <Button
                      variant={activeTab === 'profile' ? 'secondary' : 'ghost'}
                      className="justify-start"
                      onClick={() => setActiveTab('profile')}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Button>
                    <Button
                      variant={activeTab === 'security' ? 'secondary' : 'ghost'}
                      className="justify-start"
                      onClick={() => setActiveTab('security')}
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      Password & Security
                    </Button>
                    <Button
                      variant={activeTab === 'notifications' ? 'secondary' : 'ghost'}
                      className="justify-start"
                      onClick={() => setActiveTab('notifications')}
                    >
                      <Bell className="h-4 w-4 mr-2" />
                      Notifications
                    </Button>
                    <Separator className="my-2" />
                    <Button
                      variant="ghost"
                      className="justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsContent value="profile">
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Information</CardTitle>
                      <CardDescription>Update your personal details</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleProfileUpdate} className="space-y-6">
                        <div className="flex items-center space-x-6">
                          <Avatar className="h-20 w-20">
                            <AvatarImage src={profileData.avatar_url} alt={profile?.first_name} />
                            <AvatarFallback>
                              {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <Label htmlFor="avatar-upload" className="cursor-pointer bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700">
                              <Camera className="h-4 w-4 mr-2 inline" />
                              Change Avatar
                            </Label>
                            <Input id="avatar-upload" type="file" className="hidden" onChange={handleAvatarChange} accept="image/*" />
                            <p className="text-xs text-gray-500 mt-2">JPG, GIF or PNG. 1MB max.</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="first_name">First Name</Label>
                            <Input
                              id="first_name"
                              value={profileData.first_name}
                              onChange={(e) => setProfileData(prev => ({ ...prev, first_name: e.target.value }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="last_name">Last Name</Label>
                            <Input
                              id="last_name"
                              value={profileData.last_name}
                              onChange={(e) => setProfileData(prev => ({ ...prev, last_name: e.target.value }))}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input id="email" value={user?.email} disabled />
                          <p className="text-xs text-gray-500">Email cannot be changed.</p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone_number">Phone Number</Label>
                          <Input
                            id="phone_number"
                            value={profileData.phone_number}
                            onChange={(e) => setProfileData(prev => ({ ...prev, phone_number: e.target.value }))}
                          />
                        </div>

                        <div className="flex justify-end">
                          <Button type="submit" className="bg-green-600 hover:bg-green-700">Save Changes</Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="security">
                  <Card>
                    <CardHeader>
                      <CardTitle>Password & Security</CardTitle>
                      <CardDescription>Change your password and manage security settings</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handlePasswordChange} className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <div className="relative">
                            <Input
                              id="currentPassword"
                              type={showCurrentPassword ? 'text' : 'password'}
                              value={passwordData.currentPassword}
                              onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            >
                              {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <div className="relative">
                            <Input
                              id="newPassword"
                              type={showNewPassword ? 'text' : 'password'}
                              value={passwordData.newPassword}
                              onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                              {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <div className="relative">
                            <Input
                              id="confirmPassword"
                              type={showConfirmPassword ? 'text' : 'password'}
                              value={passwordData.confirmPassword}
                              onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <Button type="submit" className="bg-green-600 hover:bg-green-700">Change Password</Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="notifications">
                  <Card>
                    <CardHeader>
                      <CardTitle>Notification Settings</CardTitle>
                      <CardDescription>Choose how you want to be notified</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h3 className="text-md font-medium mb-4">Email Notifications</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label>New Properties</Label>
                              <p className="text-sm text-gray-500">Get notified about new properties matching your search alerts.</p>
                            </div>
                            <Switch
                              checked={notificationSettings.email_new_properties}
                              onCheckedChange={(checked) => handleNotificationChange('email_new_properties', checked)}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <Label>Application Updates</Label>
                              <p className="text-sm text-gray-500">Receive updates on your rental applications.</p>
                            </div>
                            <Switch
                              checked={notificationSettings.email_application_updates}
                              onCheckedChange={(checked) => handleNotificationChange('email_application_updates', checked)}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <Label>Messages</Label>
                              <p className="text-sm text-gray-500">Get notified when you receive new messages.</p>
                            </div>
                            <Switch
                              checked={notificationSettings.email_messages}
                              onCheckedChange={(checked) => handleNotificationChange('email_messages', checked)}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <Label>Promotions & Updates</Label>
                              <p className="text-sm text-gray-500">Receive occasional promotional emails and platform updates.</p>
                            </div>
                            <Switch
                              checked={notificationSettings.email_promotions}
                              onCheckedChange={(checked) => handleNotificationChange('email_promotions', checked)}
                            />
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="text-md font-medium mb-4">Push Notifications</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label>New Properties</Label>
                              <p className="text-sm text-gray-500">Get instant alerts for new properties.</p>
                            </div>
                            <Switch
                              checked={notificationSettings.push_new_properties}
                              onCheckedChange={(checked) => handleNotificationChange('push_new_properties', checked)}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <Label>Application Updates</Label>
                              <p className="text-sm text-gray-500">Instant updates on your applications.</p>
                            </div>
                            <Switch
                              checked={notificationSettings.push_application_updates}
                              onCheckedChange={(checked) => handleNotificationChange('push_application_updates', checked)}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <Label>Messages</Label>
                              <p className="text-sm text-gray-500">Instant notifications for new messages.</p>
                            </div>
                            <Switch
                              checked={notificationSettings.push_messages}
                              onCheckedChange={(checked) => handleNotificationChange('push_messages', checked)}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
