'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, Star, CheckCircle, Home as HomeIcon, Users, FileText, ArrowRight, Phone, Mail, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function Home() {
  const [searchLocation, setSearchLocation] = useState('');
  const [searchType, setSearchType] = useState('');

  const featuredProperties = [
    {
      id: 1,
      title: "Modern 3-Bedroom Apartment",
      location: "Victoria Island, Lagos",
      price: "₦2,500,000",
      period: "per year",
      image: "https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=800",
      bedrooms: 3,
      bathrooms: 2,
      type: "Apartment",
      verified: true,
      amenities: ["Pool", "Gym", "Security", "Parking"]
    },
    {
      id: 2,
      title: "Luxury 4-Bedroom Duplex",
      location: "Maitama, Abuja",
      price: "₦4,200,000",
      period: "per year",
      image: "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=800",
      bedrooms: 4,
      bathrooms: 3,
      type: "Duplex",
      verified: true,
      amenities: ["Garden", "Security", "Parking", "Generator"]
    },
    {
      id: 3,
      title: "Cozy 2-Bedroom Flat",
      location: "GRA, Port Harcourt",
      price: "₦1,800,000",
      period: "per year",
      image: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800",
      bedrooms: 2,
      bathrooms: 2,
      type: "Flat",
      verified: true,
      amenities: ["Security", "Parking", "Water"]
    },
    {
      id: 4,
      title: "Executive 5-Bedroom Villa",
      location: "Banana Island, Lagos",
      price: "₦8,500,000",
      period: "per year",
      image: "https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800",
      bedrooms: 5,
      bathrooms: 4,
      type: "Villa",
      verified: true,
      amenities: ["Pool", "Garden", "Security", "Parking", "Generator"]
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: "Adebayo Oluwaseun",
      location: "Lagos",
      rating: 5,
      text: "Rentory made finding my dream apartment so easy. No agents, no stress, just pure convenience!",
      image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150"
    },
    {
      id: 2,
      name: "Fatima Mohammed",
      location: "Abuja",
      rating: 5,
      text: "The digital application process saved me so much time. I got my apartment in just 3 days!",
      image: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150"
    },
    {
      id: 3,
      name: "Chinedu Okoro",
      location: "Port Harcourt",
      rating: 5,
      text: "As a landlord, Rentory has connected me with serious tenants. The verification system is excellent!",
      image: "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=150"
    }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    // Navigate to search results page
    window.location.href = `/search?location=${encodeURIComponent(searchLocation)}&type=${encodeURIComponent(searchType)}`;
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-green-50 to-blue-50 py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Find Your Perfect Home in Nigeria
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-4">
              No Agents, No Inspection Fees, No Hassle
            </p>
            <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
              Nigeria's first digital-first rental platform connecting renters directly with verified landlords. 
              Skip the middleman and find your home today.
            </p>

            {/* Search Bar */}
            <div className="max-w-4xl mx-auto mb-12">
              <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-lg p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Enter location (e.g., Victoria Island, Lagos)"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="pl-10 h-12"
                    />
                  </div>
                  <Select value={searchType} onValueChange={setSearchType}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Property Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="duplex">Duplex</SelectItem>
                      <SelectItem value="flat">Flat</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="house">House</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button type="submit" className="h-12 bg-green-600 hover:bg-green-700">
                    <Search className="h-5 w-5 mr-2" />
                    Search Properties
                  </Button>
                </div>
              </form>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                <HomeIcon className="h-5 w-5 mr-2" />
                Find a Home
              </Button>
              <Button size="lg" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                <Users className="h-5 w-5 mr-2" />
                List Your Property
              </Button>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                How Rentory Works
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Simple, transparent, and efficient. Get from search to lease in just 3 easy steps.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <Search className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Browse Properties</h3>
                <p className="text-gray-600">
                  Search through thousands of verified properties across Nigeria. 
                  Use our advanced filters to find exactly what you're looking for.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <FileText className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Apply Online</h3>
                <p className="text-gray-600">
                  Submit your rental application digitally. Upload documents, 
                  complete verification, and track your application status in real-time.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-purple-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-10 w-10 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Move In</h3>
                <p className="text-gray-600">
                  Sign your lease agreement digitally, make secure payments, 
                  and get your keys. Welcome to your new home!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Properties */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Featured Properties
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover premium properties from verified landlords across Nigeria's major cities.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProperties.map((property) => (
                <Card key={property.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {property.verified && (
                      <Badge className="absolute top-3 right-3 bg-green-600 text-white">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900 text-sm">{property.title}</h3>
                      <span className="text-xs text-gray-500">{property.type}</span>
                    </div>
                    <div className="flex items-center text-gray-600 text-sm mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      {property.location}
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-lg font-bold text-green-600">{property.price}</span>
                        <span className="text-sm text-gray-500 ml-1">{property.period}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {property.bedrooms} bed • {property.bathrooms} bath
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {property.amenities.slice(0, 3).map((amenity, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                      {property.amenities.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{property.amenities.length - 3} more
                        </Badge>
                      )}
                    </div>
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button variant="outline" size="lg" className="border-green-600 text-green-600 hover:bg-green-50">
                View All Properties
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                What Our Users Say
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Join thousands of satisfied renters and landlords who trust Rentory for their housing needs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id} className="bg-white">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover mr-4"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                        <p className="text-sm text-gray-600">{testimonial.location}</p>
                      </div>
                    </div>
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 italic">"{testimonial.text}"</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Trust & Security */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Your Security is Our Priority
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We use advanced security measures to protect your data and ensure safe transactions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Verified Properties</h3>
                <p className="text-gray-600">
                  All properties are verified by our team to ensure authenticity and quality.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Payments</h3>
                <p className="text-gray-600">
                  All transactions are secured with bank-level encryption and fraud protection.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">User Verification</h3>
                <p className="text-gray-600">
                  Both renters and landlords undergo identity verification for your peace of mind.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-green-600 to-blue-600">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Find Your Perfect Home?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of Nigerians who have found their ideal rental properties through Rentory.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                Start Your Search
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                List Your Property
              </Button>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}