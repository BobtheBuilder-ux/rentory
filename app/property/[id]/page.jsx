'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { MapPin, Star, CheckCircle, Heart, Share2, Calendar, User, Phone, Mail, Wifi, Car, Shield, Dumbbell, TreePine, Zap, Camera, Play, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function PropertyDetail() {
  const params = useParams();
  const [property, setProperty] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllImages, setShowAllImages] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  // Mock property data
  const mockProperty = {
    id: 1,
    title: "Modern 3-Bedroom Apartment with City Views",
    location: "Victoria Island, Lagos",
    state: "Lagos",
    price: 2500000,
    period: "per year",
    images: [
      "https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    bedrooms: 3,
    bathrooms: 2,
    type: "Apartment",
    size: "120 sqm",
    verified: true,
    amenities: ["Pool", "Gym", "Security", "Parking", "Generator", "WiFi", "Elevator", "Garden"],
    description: "Beautiful modern apartment located in the heart of Victoria Island. This stunning 3-bedroom apartment offers breathtaking city views and is perfect for professionals and families alike. The property features modern finishes, spacious rooms, and access to premium amenities including a swimming pool, gym, and 24/7 security.",
    fullDescription: "This exceptional 3-bedroom apartment is situated on the 12th floor of a prestigious residential tower in Victoria Island, Lagos. The property offers panoramic views of the Lagos skyline and Atlantic Ocean. Each bedroom is en-suite with modern fixtures and fittings. The open-plan living area connects seamlessly to a modern kitchen equipped with high-end appliances. The apartment comes with a dedicated parking space and access to world-class amenities including a rooftop pool, state-of-the-art gym, and 24/7 concierge service.",
    landlord: {
      name: "John Doe",
      rating: 4.8,
      reviews: 12,
      verified: true,
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150",
      phone: "+234 803 123 4567",
      email: "john.doe@email.com",
      properties: 5,
      memberSince: "2022"
    },
    coordinates: { lat: 6.4281, lng: 3.4219 },
    nearbyPlaces: [
      { name: "Tafawa Balewa Square", distance: "2.5 km", type: "Landmark" },
      { name: "National Theatre", distance: "3.2 km", type: "Culture" },
      { name: "Shoprite", distance: "1.8 km", type: "Shopping" },
      { name: "Lagos Island General Hospital", distance: "2.1 km", type: "Healthcare" },
      { name: "CMS Grammar School", distance: "1.5 km", type: "Education" }
    ],
    features: [
      "Air Conditioning",
      "Furnished",
      "Balcony",
      "City View",
      "Modern Kitchen",
      "Marble Floors",
      "Walk-in Closet",
      "Laundry Room"
    ],
    availability: "Available Now",
    dateAdded: "2024-01-15",
    views: 245,
    saved: false,
    similarProperties: [
      {
        id: 2,
        title: "Luxury 2-Bedroom Apartment",
        location: "Ikoyi, Lagos",
        price: 3200000,
        image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=300",
        bedrooms: 2,
        bathrooms: 2
      },
      {
        id: 3,
        title: "Executive 4-Bedroom Duplex",
        location: "Lekki, Lagos",
        price: 4500000,
        image: "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=300",
        bedrooms: 4,
        bathrooms: 3
      }
    ]
  };

  useEffect(() => {
    setProperty(mockProperty);
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getAmenityIcon = (amenity) => {
    const icons = {
      'WiFi': Wifi,
      'Parking': Car,
      'Security': Shield,
      'Gym': Dumbbell,
      'Garden': TreePine,
      'Generator': Zap,
      'Pool': '🏊‍♂️',
      'Elevator': '🛗'
    };
    return icons[amenity] || CheckCircle;
  };

  const nextImage = () => {
    if (property) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = () => {
    if (property) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // Handle contact form submission
    console.log('Contact form submitted:', contactForm);
  };

  const toggleSaveProperty = () => {
    setProperty(prev => ({ ...prev, saved: !prev.saved }));
  };

  if (!property) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50">
        {/* Image Gallery */}
        <div className="relative h-96 md:h-[500px] bg-gray-900">
          <img
            src={property.images[currentImageIndex]}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          
          {/* Image Navigation */}
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
          >
            <ArrowRight className="h-6 w-6" />
          </button>

          {/* Image Counter */}
          <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded">
            {currentImageIndex + 1} / {property.images.length}
          </div>

          {/* Action Buttons */}
          <div className="absolute bottom-4 right-4 flex space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowAllImages(true)}
            >
              <Camera className="h-4 w-4 mr-2" />
              View All Photos
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={toggleSaveProperty}
            >
              <Heart className={`h-4 w-4 mr-2 ${property.saved ? 'text-red-500 fill-current' : ''}`} />
              {property.saved ? 'Saved' : 'Save'}
            </Button>
            <Button variant="secondary" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>

          {/* Verified Badge */}
          {property.verified && (
            <Badge className="absolute top-4 left-4 bg-green-600 text-white">
              <CheckCircle className="h-4 w-4 mr-1" />
              Verified Property
            </Badge>
          )}
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Property Header */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="h-5 w-5 mr-2" />
                      <span className="text-lg">{property.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm font-medium">{property.landlord.rating}</span>
                      <span className="text-sm text-gray-500 ml-1">({property.landlord.reviews} reviews)</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-green-600">{formatPrice(property.price)}</div>
                    <div className="text-gray-500">{property.period}</div>
                    <Badge variant="outline" className="mt-2">
                      {property.availability}
                    </Badge>
                  </div>
                </div>

                {/* Property Stats */}
                <div className="flex flex-wrap gap-6 py-4 border-y border-gray-200">
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-gray-900 mr-2">{property.bedrooms}</span>
                    <span className="text-gray-600">Bedrooms</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-gray-900 mr-2">{property.bathrooms}</span>
                    <span className="text-gray-600">Bathrooms</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-gray-900 mr-2">{property.size}</span>
                    <span className="text-gray-600">Floor Area</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-gray-900 mr-2">{property.type}</span>
                    <span className="text-gray-600">Property Type</span>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="description" className="bg-white rounded-lg shadow-sm">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="amenities">Amenities</TabsTrigger>
                  <TabsTrigger value="location">Location</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                
                <TabsContent value="description" className="p-6">
                  <div className="space-y-4">
                    <p className="text-gray-700 leading-relaxed">{property.fullDescription}</p>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {property.features.map((feature, index) => (
                          <div key={index} className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="amenities" className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {property.amenities.map((amenity, index) => {
                      const IconComponent = getAmenityIcon(amenity);
                      return (
                        <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                          {typeof IconComponent === 'string' ? (
                            <span className="text-2xl mr-3">{IconComponent}</span>
                          ) : (
                            <IconComponent className="h-6 w-6 text-green-600 mr-3" />
                          )}
                          <span className="text-gray-700">{amenity}</span>
                        </div>
                      );
                    })}
                  </div>
                </TabsContent>
                
                <TabsContent value="location" className="p-6">
                  <div className="space-y-4">
                    <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">Interactive Map</p>
                        <p className="text-sm text-gray-500">Google Maps integration would be here</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Nearby Places</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {property.nearbyPlaces.map((place, index) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div>
                              <span className="font-medium text-gray-900">{place.name}</span>
                              <span className="text-sm text-gray-500 ml-2">({place.type})</span>
                            </div>
                            <span className="text-sm text-green-600 font-medium">{place.distance}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="reviews" className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center mb-4">
                      <div className="text-3xl font-bold text-gray-900 mr-4">{property.landlord.rating}</div>
                      <div>
                        <div className="flex items-center mb-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-5 w-5 ${i < Math.floor(property.landlord.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        <div className="text-sm text-gray-600">{property.landlord.reviews} reviews</div>
                      </div>
                    </div>
                    
                    <div className="text-gray-600">
                      <p>Reviews and ratings would be displayed here. This would include individual tenant reviews, ratings breakdown, and feedback on the property and landlord.</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Landlord/Agent Card */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Property Owner</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-4">
                    <img
                      src={property.landlord.avatar}
                      alt={property.landlord.name}
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{property.landlord.name}</h3>
                      <div className="flex items-center text-sm text-gray-600">
                        <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                        <span>{property.landlord.rating}</span>
                        <span className="mx-1">•</span>
                        <span>{property.landlord.reviews} reviews</span>
                      </div>
                      {property.landlord.verified && (
                        <Badge variant="outline" className="mt-1">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-gray-600">Properties:</span>
                      <span className="font-semibold ml-1">{property.landlord.properties}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Member since:</span>
                      <span className="font-semibold ml-1">{property.landlord.memberSince}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      <Phone className="h-4 w-4 mr-2" />
                      Call Owner
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full">
                          <Mail className="h-4 w-4 mr-2" />
                          Send Message
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Contact Property Owner</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleContactSubmit} className="space-y-4">
                          <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                              id="name"
                              value={contactForm.name}
                              onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={contactForm.email}
                              onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                              id="phone"
                              value={contactForm.phone}
                              onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="message">Message</Label>
                            <Textarea
                              id="message"
                              value={contactForm.message}
                              onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                              placeholder="I'm interested in this property..."
                              rows={4}
                              required
                            />
                          </div>
                          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                            Send Message
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                    <Button variant="outline" className="w-full">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Visit
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Apply Button */}
              <Card className="mb-6">
                <CardContent className="p-4">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                    Apply for This Property
                  </Button>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Start your rental application process
                  </p>
                </CardContent>
              </Card>

              {/* Similar Properties */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Similar Properties</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {property.similarProperties.map((similar) => (
                      <div key={similar.id} className="flex space-x-3 p-3 bg-gray-50 rounded-lg">
                        <img
                          src={similar.image}
                          alt={similar.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm text-gray-900">{similar.title}</h4>
                          <p className="text-xs text-gray-600">{similar.location}</p>
                          <p className="text-sm font-semibold text-green-600">{formatPrice(similar.price)}</p>
                        </div>
                      </div>
                    ))}
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