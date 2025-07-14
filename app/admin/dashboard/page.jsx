'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Building, UserCheck, TrendingUp, Plus, Settings, Shield, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';

export default function AdminDashboard() {
  const router = useRouter();
  const { isAuthenticated, isAdmin, loading, profile } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProperties: 0,
    totalAgents: 0,
    totalLandlords: 0,
    totalRenters: 0,
    pendingApplications: 0
  });

  const [agents, setAgents] = useState([]);
  const [landlords, setLandlords] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [showCreateAgent, setShowCreateAgent] = useState(false);
  const [newAgent, setNewAgent] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    agencyName: '',
    licenseNumber: '',
    territory: []
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (!loading && !isAdmin) {
      router.push('/dashboard');
      return;
    }

    if (isAdmin) {
    loadDashboardData();
    }
  }, []);

  const loadDashboardData = async () => {
    try {
      setDataLoading(true);
      
      // Load stats
      const statsResponse = await fetch('/api/admin/stats');
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      // Load agents
      const agentsResponse = await fetch('/api/admin/agents');
      if (agentsResponse.ok) {
        const agentsData = await agentsResponse.json();
        setAgents(agentsData);
      }

      // Load landlords
      const landlordsResponse = await fetch('/api/admin/landlords');
      if (landlordsResponse.ok) {
        const landlordsData = await landlordsResponse.json();
        setLandlords(landlordsData);
      }

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setDataLoading(false);
    }
  };

  const handleCreateAgent = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/admin/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAgent),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Agent created:', result);
        setShowCreateAgent(false);
        setNewAgent({
          email: '',
          firstName: '',
          lastName: '',
          phone: '',
          agencyName: '',
          licenseNumber: '',
          territory: []
        });
        loadDashboardData(); // Reload data
      } else {
        const error = await response.json();
        console.error('Error creating agent:', error);
      }
    } catch (error) {
      console.error('Error creating agent:', error);
    }
  };

  const handleAssignAgent = async (agentId, landlordId) => {
    try {
      const response = await fetch('/api/admin/assign-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentId,
          landlordId,
          assignmentType: 'full',
          permissions: ['view', 'edit', 'create']
        }),
      });

      if (response.ok) {
        console.log('Agent assigned successfully');
        loadDashboardData(); // Reload data
      } else {
        const error = await response.json();
        console.error('Error assigning agent:', error);
      }
    } catch (error) {
      console.error('Error assigning agent:', error);
    }
  };

  if (loading || dataLoading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading admin dashboard...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!isAuthenticated || !isAdmin) {
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
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600">Welcome, {profile?.first_name}! Manage agents, landlords, and platform operations</p>
              </div>
              <div className="flex items-center space-x-4">
                <Button className="bg-green-600 hover:bg-green-700" onClick={() => router.push('/admin/settings')}>
                  <Shield className="h-4 w-4 mr-2" />
                  System Settings
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
                  <Users className="h-8 w-8 text-blue-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Building className="h-8 w-8 text-green-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Properties</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalProperties}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <UserCheck className="h-8 w-8 text-purple-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Agents</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalAgents}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-yellow-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Landlords</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalLandlords}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-indigo-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Renters</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalRenters}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Activity className="h-8 w-8 text-red-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Apps</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.pendingApplications}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="agents" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="agents">Agents Management</TabsTrigger>
              <TabsTrigger value="landlords">Landlords</TabsTrigger>
              <TabsTrigger value="assignments">Agent Assignments</TabsTrigger>
            </TabsList>

            <TabsContent value="agents" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Agents Management</h2>
                <Dialog open={showCreateAgent} onOpenChange={setShowCreateAgent}>
                  <DialogTrigger asChild>
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Agent
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Agent</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateAgent} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            value={newAgent.firstName}
                            onChange={(e) => setNewAgent(prev => ({ ...prev, firstName: e.target.value }))}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            value={newAgent.lastName}
                            onChange={(e) => setNewAgent(prev => ({ ...prev, lastName: e.target.value }))}
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newAgent.email}
                          onChange={(e) => setNewAgent(prev => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={newAgent.phone}
                          onChange={(e) => setNewAgent(prev => ({ ...prev, phone: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="agencyName">Agency Name</Label>
                        <Input
                          id="agencyName"
                          value={newAgent.agencyName}
                          onChange={(e) => setNewAgent(prev => ({ ...prev, agencyName: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="licenseNumber">License Number</Label>
                        <Input
                          id="licenseNumber"
                          value={newAgent.licenseNumber}
                          onChange={(e) => setNewAgent(prev => ({ ...prev, licenseNumber: e.target.value }))}
                        />
                      </div>
                      <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" onClick={handleCreateAgent}>
                        Create Agent
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {agents.map((agent) => (
                  <Card key={agent.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">
                          {agent.profiles?.first_name} {agent.profiles?.last_name}
                        </h3>
                        <Badge className={agent.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {agent.status}
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p><strong>Code:</strong> {agent.agent_code}</p>
                        <p><strong>Email:</strong> {agent.profiles?.email}</p>
                        <p><strong>Phone:</strong> {agent.profiles?.phone}</p>
                        {agent.agency_name && <p><strong>Agency:</strong> {agent.agency_name}</p>}
                        <p><strong>Assignments:</strong> {agent.agent_assignments?.length || 0}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="landlords" className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Landlords</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {landlords.map((landlord) => (
                  <Card key={landlord.id}>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {landlord.first_name} {landlord.last_name}
                      </h3>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p><strong>Email:</strong> {landlord.email}</p>
                        <p><strong>Phone:</strong> {landlord.phone}</p>
                        <p><strong>Properties:</strong> {landlord.properties?.length || 0}</p>
                        <p><strong>Agent:</strong> {
                          landlord.agent_assignments?.[0]?.agents?.profiles?.first_name 
                            ? `${landlord.agent_assignments[0].agents.profiles.first_name} ${landlord.agent_assignments[0].agents.profiles.last_name}`
                            : 'Unassigned'
                        }</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="assignments" className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Agent Assignments</h2>
              
              <div className="space-y-4">
                {agents.map((agent) => (
                  <Card key={agent.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {agent.profiles?.first_name} {agent.profiles?.last_name} ({agent.agent_code})
                      </CardTitle>
                      <CardDescription>
                        {agent.agency_name && `${agent.agency_name} • `}
                        {agent.agent_assignments?.length || 0} assignments
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {agent.agent_assignments?.map((assignment) => (
                          <Badge key={assignment.id} variant="outline">
                            {assignment.profiles?.first_name} {assignment.profiles?.last_name}
                          </Badge>
                        ))}
                        {(!agent.agent_assignments || agent.agent_assignments.length === 0) && (
                          <p className="text-gray-500 text-sm">No assignments yet</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </>
  );
}
