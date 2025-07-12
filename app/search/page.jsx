'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Star, CheckCircle, Heart, Map, Grid, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function SearchPage() {
  const [viewType, setViewType] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([500000, 10000000]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [filters, setFilters] = useState({
    location: '',
    propertyType: '',
    bedrooms: '',
    bathrooms: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'newest'
  });

  const mockProperties = [
    {
      id: 1,
      title: "Modern 3-Bedroom Apartment",
      location: "Victoria Island, Lagos",
      state: "Lagos",
      price: 2500000,
      period: "per year",
      image: "https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=800",
      bedrooms: 3,
      bathrooms: 2,
      type: "Apartment",
      verified: true,
      amenities: ["Pool", "Gym", "Security", "Parking", "Generator"],
      description: "Beautiful modern apartment with stunning city views",
      landlord: "John Doe",
      rating: 4.8,
      reviews: 12,
      dateAdded: "2024-01-15",
      saved: false
    },
    {
      id: 2,
      title: "Luxury 4-Bedroom Duplex",
      location: "Maitama, Abuja",
      state: "FCT",
      price: 4200000,
      period: "per year",
      image: "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=800",
      bedrooms: 4,
      bathrooms: 3,
      type: "Duplex",
      verified: true,
      amenities: ["Garden", "Security", "Parking", "Generator", "Gym"],
      description: "Spacious duplex in premium location",
      landlord: "Jane Smith",
      rating: 4.9,
      reviews: 18,
      dateAdded: "2024-01-12",
      saved: true
    },
    {
      id: 3,
      title: "Cozy 2-Bedroom Flat",
      location: "GRA, Port Harcourt",
      state: "Rivers",
      price: 1800000,
      period: "per year",
      image: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800",
      bedrooms: 2,
      bathrooms: 2,
      type: "Flat",
      verified: true,
      amenities: ["Security", "Parking", "Water", "Generator"],
      description: "Comfortable flat in quiet neighborhood",
      landlord: "Mike Johnson",
      rating: 4.6,
      reviews: 8,
      dateAdded: "2024-01-10",
      saved: false
    },
    {
      id: 4,
      title: "Executive 5-Bedroom Villa",
      location: "Banana Island, Lagos",
      state: "Lagos",
      price: 8500000,
      period: "per year",
      image: "https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800",
      bedrooms: 5,
      bathrooms: 4,
      type: "Villa",
      verified: true,
      amenities: ["Pool", "Garden", "Security", "Parking", "Generator", "Gym"],
      description: "Luxury villa with premium amenities",
      landlord: "Sarah Williams",
      rating: 5.0,
      reviews: 25,
      dateAdded: "2024-01-08",
      saved: false
    },
    {
      id: 5,
      title: "Serviced 1-Bedroom Apartment",
      location: "Ikeja, Lagos",
      state: "Lagos",
      price: 1200000,
      period: "per year",
      image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800",
      bedrooms: 1,
      bathrooms: 1,
      type: "Apartment",
      verified: true,
      amenities: ["WiFi", "Security", "Parking", "Generator", "Cleaning"],
      description: "Fully serviced apartment with modern amenities",
      landlord: "David Brown",
      rating: 4.7,
      reviews: 15,
      dateAdded: "2024-01-05",
      saved: true
    },
    {
      id: 6,
      title: "Family 3-Bedroom House",
      location: "Wuse 2, Abuja",
      state: "FCT",
      price: 3000000,
      period: "per year",
      image: "https://images.pexels.com/photos/1546166/pexels-photo-1546166.jpeg?auto=compress&cs=tinysrgb&w=800",
      bedrooms: 3,
      bathrooms: 2,
      type: "House",
      verified: true,
      amenities: ["Garden", "Security", "Parking", "Generator"],
      description: "Perfect family home in serene environment",
      landlord: "Lisa Johnson",
      rating: 4.5,
      reviews: 10,
      dateAdded: "2024-01-03",
      saved: false
    }
  ];

  const amenitiesList = [
    "Pool", "Gym", "Security", "Parking", "Generator", "Garden", "WiFi", "Cleaning", "Water", "Elevator"
  ];

  const nigerianStates = [
    "Lagos", "FCT", "Rivers", "Kano", "Oyo", "Kaduna", "Ogun", "Anambra", "Delta", "Edo"
  ];

  useEffect(() => {
    setSearchResults(mockProperties);
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Filter properties based on search criteria
    let filtered = mockProperties;

    if (filters.location) {
      filtered = filtered.filter(prop =>
        prop.location.toLowerCase().includes(filters.location.toLowerCase()) ||
        prop.state.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.propertyType) {
      filtered = filtered.filter(prop =>
        prop.type.toLowerCase() === filters.propertyType.toLowerCase()
      );
    }

    if (filters.bedrooms) {
      filtered = filtered.filter(prop =>
        prop.bedrooms >= parseInt(filters.bedrooms)
      );
    }

    if (filters.bathrooms) {
      filtered = filtered.filter(prop =>
        prop.bathrooms >= parseInt(filters.bathrooms)
      );
    }

    // Price range filter
    filtered = filtered.filter(prop =>
      prop.price >= priceRange[0] && prop.price <= priceRange[1]
    );

    // Amenities filter
    if (selectedAmenities.length > 0) {
      filtered = filtered.filter(prop =>
        selectedAmenities.every(amenity => prop.amenities.includes(amenity))
      );
    }

    // Sort results
    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
        break;
    }

    setSearchResults(filtered);
  };

  const toggleSaveProperty = (propertyId) => {
    setSearchResults(prev =>
      prev.map(prop =>
        prop.id === propertyId ? { ...prop, saved: !prop.saved } : prop
      )
    );
  };

  const handleAmenityChange = (amenity) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50">
        {/* Search Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-4">
          <div className="max-w-7xl mx-auto">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 flex gap-2">
                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Location (e.g., Victoria Island, Lagos)"
                    value={filters.location}
                    onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                    className="pl-10"
                  />
                </div>
                <Select value={filters.propertyType} onValueChange={(value) => setFilters(prev => ({ ...prev, propertyType: value }))}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Property Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-types">All Types</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="duplex">Duplex</SelectItem>
                    <SelectItem value="flat">Flat</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="border-green-600 text-green-600 hover:bg-green-50"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Bedrooms</Label>
                  <Select value={filters.bedrooms} onValueChange={(value) => setFilters(prev => ({ ...prev, bedrooms: value === 'any-bedrooms' ? '' : value }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any-bedrooms">Any</SelectItem>
                      <SelectItem value="1">1+</SelectItem>
                      <SelectItem value="2">2+</SelectItem>
                      <SelectItem value="3">3+</SelectItem>
                      <SelectItem value="4">4+</SelectItem>
                      <SelectItem value="5">5+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">Bathrooms</Label>
                  <Select value={filters.bathrooms} onValueChange={(value) => setFilters(prev => ({ ...prev, bathrooms: value === 'any-bathrooms' ? '' : value }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any-bathrooms">Any</SelectItem>
                      <SelectItem value="1">1+</SelectItem>
                      <SelectItem value="2">2+</SelectItem>
                      <SelectItem value="3">3+</SelectItem>
                      <SelectItem value="4">4+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">Sort By</Label>
                  <Select value={filters.sortBy} onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => setViewType(viewType === 'grid' ? 'list' : 'grid')}
                    className="w-full"
                  >
                    {viewType === 'grid' ? <Grid className="h-4 w-4 mr-2" /> : <Map className="h-4 w-4 mr-2" />}
                    {viewType === 'grid' ? 'Grid View' : 'List View'}
                  </Button>
                </div>
              </div>

              <div className="mt-6">
                <Label className="text-sm font-medium text-gray-700 mb-3 block">
                  Price Range: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                </Label>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={10000000}
                  min={500000}
                  step={100000}
                  className="w-full"
                />
              </div>

              <div className="mt-6">
                <Label className="text-sm font-medium text-gray-700 mb-3 block">Amenities</Label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {amenitiesList.map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox
                        id={amenity}
                        checked={selectedAmenities.includes(amenity)}
                        onCheckedChange={() => handleAmenityChange(amenity)}
                      />
                      <Label htmlFor={amenity} className="text-sm text-gray-700">
                        {amenity}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {searchResults.length} Properties Found
            </h2>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewType === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewType('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewType === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewType('list')}
              >
                <Map className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Property Grid */}
          <div className={`grid gap-6 ${viewType === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {searchResults.map((property) => (
              <Card key={property.id} className={`group cursor-pointer hover:shadow-lg transition-shadow ${viewType === 'list' ? 'md:flex' : ''}`}>
                <div className={`relative overflow-hidden ${viewType === 'list' ? 'md:w-1/3' : ''} rounded-t-lg md:rounded-l-lg`}>
                  <img
                    src={property.image}
                    alt={property.title}
                    className={`object-cover group-hover:scale-105 transition-transform duration-300 ${viewType === 'list' ? 'w-full h-48 md:h-full' : 'w-full h-48'}`}
                  />
                  {property.verified && (
                    <Badge className="absolute top-3 left-3 bg-green-600 text-white">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`absolute top-3 right-3 p-2 ${property.saved ? 'text-red-500' : 'text-white'} hover:text-red-500`}
                    onClick={() => toggleSaveProperty(property.id)}
                  >
                    <Heart className={`h-5 w-5 ${property.saved ? 'fill-current' : ''}`} />
                  </Button>
                </div>
                <CardContent className={`p-4 ${viewType === 'list' ? 'md:w-2/3' : ''}`}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{property.title}</h3>
                    <span className="text-xs text-gray-500">{property.type}</span>
                  </div>
                  <div className="flex items-center text-gray-600 text-sm mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    {property.location}
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-lg font-bold text-green-600">{formatPrice(property.price)}</span>
                      <span className="text-sm text-gray-500 ml-1">{property.period}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {property.bedrooms} bed • {property.bathrooms} bath
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    <span>{property.rating}</span>
                    <span className="mx-1">•</span>
                    <span>{property.reviews} reviews</span>
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
                  <p className="text-sm text-gray-600 mb-4">{property.description}</p>
                  <div className="flex space-x-2">
                    <Button className="flex-1 bg-green-600 hover:bg-green-700">
                      View Details
                    </Button>
                    <Button variant="outline" className="flex-1 border-green-600 text-green-600 hover:bg-green-50">
                      Contact
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              <Button variant="outline" disabled>
                Previous
              </Button>
              <Button className="bg-green-600 hover:bg-green-700">1</Button>
              <Button variant="outline">2</Button>
              <Button variant="outline">3</Button>
              <Button variant="outline">
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}