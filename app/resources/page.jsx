'use client';

import { Download, FileText, Video, BookOpen, Calculator, CheckCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function ResourcesPage() {
  const guides = [
    {
      title: "Complete Guide to Renting in Nigeria",
      description: "Everything you need to know about the rental process from start to finish",
      type: "PDF Guide",
      icon: FileText,
      downloadUrl: "#",
      pages: "45 pages",
      category: "General"
    },
    {
      title: "Tenant Rights and Responsibilities",
      description: "Understand your legal rights and obligations as a tenant in Nigeria",
      type: "Legal Guide",
      icon: BookOpen,
      downloadUrl: "#",
      pages: "28 pages",
      category: "Legal"
    },
    {
      title: "Property Inspection Checklist",
      description: "Comprehensive checklist for evaluating properties before signing a lease",
      type: "Checklist",
      icon: CheckCircle,
      downloadUrl: "#",
      pages: "8 pages",
      category: "Tools"
    },
    {
      title: "Rental Budget Calculator",
      description: "Calculate how much you can afford to spend on rent based on your income",
      type: "Calculator",
      icon: Calculator,
      downloadUrl: "#",
      pages: "Interactive",
      category: "Tools"
    }
  ];

  const videos = [
    {
      title: "How to Use Rentory: Complete Walkthrough",
      description: "Step-by-step guide to finding and applying for properties on Rentory",
      duration: "12:30",
      thumbnail: "https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: "Platform Guide"
    },
    {
      title: "Property Viewing Tips: What to Look For",
      description: "Expert advice on what to check during property viewings",
      duration: "8:45",
      thumbnail: "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: "Tips"
    },
    {
      title: "Understanding Lease Agreements in Nigeria",
      description: "Legal expert explains key terms and clauses in rental agreements",
      duration: "15:20",
      thumbnail: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: "Legal"
    },
    {
      title: "Negotiating Rent: Do's and Don'ts",
      description: "Professional tips for successful rent negotiations",
      duration: "10:15",
      thumbnail: "https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: "Tips"
    }
  ];

  const templates = [
    {
      title: "Rental Application Template",
      description: "Professional template for rental applications",
      format: "Word Document",
      category: "Applications"
    },
    {
      title: "Lease Agreement Template",
      description: "Standard lease agreement template for Nigerian properties",
      format: "PDF Template",
      category: "Legal"
    },
    {
      title: "Property Inspection Report",
      description: "Template for documenting property condition",
      format: "Excel Spreadsheet",
      category: "Inspection"
    },
    {
      title: "Rent Receipt Template",
      description: "Professional rent receipt template",
      format: "Word Document",
      category: "Financial"
    }
  ];

  const webinars = [
    {
      title: "First-Time Renter's Workshop",
      date: "February 15, 2024",
      time: "6:00 PM WAT",
      speaker: "Adebayo Ogundimu, CEO Rentory",
      description: "Everything first-time renters need to know about finding and securing their first apartment",
      status: "upcoming",
      registrationUrl: "#"
    },
    {
      title: "Understanding the Lagos Rental Market",
      date: "February 8, 2024",
      time: "7:00 PM WAT",
      speaker: "Real Estate Expert Panel",
      description: "Deep dive into Lagos rental trends, pricing, and best neighborhoods",
      status: "upcoming",
      registrationUrl: "#"
    },
    {
      title: "Legal Rights for Tenants",
      date: "January 25, 2024",
      time: "6:30 PM WAT",
      speaker: "Legal Expert",
      description: "Know your rights and how to protect yourself as a tenant",
      status: "past",
      recordingUrl: "#"
    }
  ];

  const categories = ["All", "General", "Legal", "Tools", "Tips", "Platform Guide"];

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-br from-green-50 to-blue-50 py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Rental Resources
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Free guides, tools, and expert advice to help you navigate Nigeria's rental market with confidence.
            </p>
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              Browse All Resources
            </Button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Resource Tabs */}
          <Tabs defaultValue="guides" className="w-full">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-12">
              <TabsTrigger value="guides">Guides & Tools</TabsTrigger>
              <TabsTrigger value="videos">Video Library</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="webinars">Webinars</TabsTrigger>
            </TabsList>

            {/* Guides and Tools */}
            <TabsContent value="guides">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Downloadable Guides & Tools</h2>
                <p className="text-gray-600">
                  Comprehensive resources to help you make informed rental decisions
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {guides.map((guide, index) => (
                  <Card key={index} className="group hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <guide.icon className="h-6 w-6 text-green-600" />
                        </div>
                        <Badge variant="outline">{guide.category}</Badge>
                      </div>
                      <CardTitle className="text-lg">{guide.title}</CardTitle>
                      <CardDescription>{guide.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span>{guide.type}</span>
                        <span>{guide.pages}</span>
                      </div>
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        <Download className="h-4 w-4 mr-2" />
                        Download Free
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Video Library */}
            <TabsContent value="videos">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Video Library</h2>
                <p className="text-gray-600">
                  Watch expert tutorials and tips to master the rental process
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video, index) => (
                  <Card key={index} className="group hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                          <Video className="h-5 w-5 mr-2" />
                          Play Video
                        </Button>
                      </div>
                      <Badge className="absolute top-2 right-2 bg-black bg-opacity-70 text-white">
                        {video.duration}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <Badge variant="outline" className="mb-2">{video.category}</Badge>
                      <h3 className="font-semibold text-gray-900 mb-2">{video.title}</h3>
                      <p className="text-sm text-gray-600">{video.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Templates */}
            <TabsContent value="templates">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Document Templates</h2>
                <p className="text-gray-600">
                  Professional templates to streamline your rental process
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {templates.map((template, index) => (
                  <Card key={index} className="group hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <FileText className="h-5 w-5 text-green-600 mr-2" />
                            <Badge variant="outline">{template.category}</Badge>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {template.title}
                          </h3>
                          <p className="text-gray-600 mb-4">{template.description}</p>
                          <p className="text-sm text-gray-500 mb-4">{template.format}</p>
                        </div>
                      </div>
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        <Download className="h-4 w-4 mr-2" />
                        Download Template
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Webinars */}
            <TabsContent value="webinars">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Webinars & Workshops</h2>
                <p className="text-gray-600">
                  Join live sessions with rental experts and industry professionals
                </p>
              </div>

              <div className="space-y-6">
                {webinars.map((webinar, index) => (
                  <Card key={index} className="group hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <Badge className={webinar.status === 'upcoming' ? 'bg-green-600' : 'bg-gray-600'}>
                              {webinar.status === 'upcoming' ? 'Upcoming' : 'Past Event'}
                            </Badge>
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {webinar.title}
                          </h3>
                          <p className="text-gray-600 mb-3">{webinar.description}</p>
                          <div className="text-sm text-gray-500">
                            <p><strong>Date:</strong> {webinar.date}</p>
                            <p><strong>Time:</strong> {webinar.time}</p>
                            <p><strong>Speaker:</strong> {webinar.speaker}</p>
                          </div>
                        </div>
                        <div className="mt-4 md:mt-0 md:ml-6">
                          {webinar.status === 'upcoming' ? (
                            <Button className="bg-green-600 hover:bg-green-700">
                              Register Now
                            </Button>
                          ) : (
                            <Button variant="outline">
                              <Video className="h-4 w-4 mr-2" />
                              Watch Recording
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Newsletter Signup */}
          <div className="mt-16">
            <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Stay Updated with New Resources</h3>
                <p className="text-lg mb-6 opacity-90">
                  Get notified when we publish new guides, tools, and educational content.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 rounded-lg text-gray-900"
                  />
                  <Button className="bg-white text-green-600 hover:bg-gray-100">
                    Subscribe
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}