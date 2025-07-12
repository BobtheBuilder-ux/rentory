'use client';

import { Target, Users, Shield, Award, Heart, Globe, TrendingUp, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function AboutPage() {
  const stats = [
    { number: "10,000+", label: "Properties Listed" },
    { number: "25,000+", label: "Happy Renters" },
    { number: "5,000+", label: "Verified Landlords" },
    { number: "15+", label: "Cities Covered" }
  ];

  const values = [
    {
      icon: Shield,
      title: "Trust & Transparency",
      description: "We verify every property and landlord to ensure safe, reliable rental experiences for all users."
    },
    {
      icon: Heart,
      title: "Customer First",
      description: "Every decision we make is centered around improving the rental experience for our users."
    },
    {
      icon: TrendingUp,
      title: "Innovation",
      description: "We continuously innovate to bring the latest technology to Nigeria's rental market."
    },
    {
      icon: Users,
      title: "Community",
      description: "Building a community where renters and landlords can connect directly and build lasting relationships."
    }
  ];

  const team = [
    {
      name: "Adebayo Ogundimu",
      role: "CEO & Co-Founder",
      image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300",
      bio: "Former real estate executive with 10+ years experience in Nigerian property market."
    },
    {
      name: "Fatima Al-Hassan",
      role: "CTO & Co-Founder",
      image: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=300",
      bio: "Tech entrepreneur passionate about solving Africa's housing challenges through technology."
    },
    {
      name: "Chinedu Okoro",
      role: "Head of Operations",
      image: "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=300",
      bio: "Operations expert focused on scaling our verification and customer service processes."
    },
    {
      name: "Kemi Adebisi",
      role: "Head of Marketing",
      image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=300",
      bio: "Marketing strategist with deep understanding of Nigerian consumer behavior and digital adoption."
    }
  ];

  const milestones = [
    {
      year: "2022",
      title: "Company Founded",
      description: "Rentory was founded with a mission to digitize Nigeria's rental market"
    },
    {
      year: "2023",
      title: "Lagos Launch",
      description: "Successfully launched in Lagos with 1,000+ verified properties"
    },
    {
      year: "2023",
      title: "Series A Funding",
      description: "Raised $5M Series A to expand across Nigeria"
    },
    {
      year: "2024",
      title: "National Expansion",
      description: "Expanded to 15+ cities across Nigeria with 10,000+ properties"
    }
  ];

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-green-50 to-blue-50 py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About Rentory
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              We're on a mission to make finding and renting homes in Nigeria simple, 
              transparent, and accessible to everyone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                Join Our Mission
              </Button>
              <Button size="lg" variant="outline">
                View Open Positions
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="bg-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-8">
              To revolutionize Nigeria's rental market by creating a digital-first platform that 
              connects renters directly with verified property owners, eliminating the traditional 
              pain points of agent fees, inspection charges, and lengthy processes.
            </p>
            <div className="bg-green-50 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-700">
                To become Africa's leading rental platform, making quality housing accessible 
                and affordable for every Nigerian family while empowering property owners with 
                the tools they need to succeed.
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
              <p className="text-lg text-gray-600">
                The principles that guide everything we do
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <value.icon className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
              <p className="text-lg text-gray-600">
                The passionate individuals driving change in Nigeria's rental market
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                    />
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {member.name}
                    </h3>
                    <p className="text-green-600 font-medium mb-3">{member.role}</p>
                    <p className="text-gray-600 text-sm">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Journey</h2>
              <p className="text-lg text-gray-600">
                Key milestones in our mission to transform Nigeria's rental market
              </p>
            </div>

            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 w-24 text-right mr-8">
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      {milestone.year}
                    </Badge>
                  </div>
                  <div className="flex-shrink-0 w-4 h-4 bg-green-600 rounded-full mt-1 mr-6"></div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {milestone.title}
                    </h3>
                    <p className="text-gray-600">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 py-16 px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl font-bold mb-6">Join Us in Transforming Nigeria's Rental Market</h2>
            <p className="text-xl mb-8 opacity-90">
              Whether you're looking for a home or want to list your property, 
              be part of the digital rental revolution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                Find Your Home
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                List Your Property
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}