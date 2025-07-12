'use client';

import { useState } from 'react';
import { Upload, MapPin, Home, DollarSign, Camera, Plus, X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function ListPropertyPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Information
    title: '',
    description: '',
    propertyType: '',
    
    // Location
    address: '',
    city: '',
    state: '',
    landmark: '',
    
    // Details
    bedrooms: '',
    bathrooms: '',
    toilets: '',
    size: '',
    furnished: '',
    
    // Pricing
    price: '',
    negotiable: false,
    
    // Amenities
    amenities: [],
    
    // Images
    images: [],
    
    // Additional Information
    availableFrom: '',
    minimumStay: '',
    maximumStay: '',
    
    // Contact
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    whatsappNumber: '',
    
    // Preferences
    preferredTenant: '',
    petsAllowed: false,
    smokingAllowed: false,
    
    // Legal
    documentsRequired: [],
    inspectionFee: '',
    legalFee: '',
    agentFee: '',
    cautionFee: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const nigerianStates = [
    'Lagos', 'Abuja (FCT)', 'Kano', 'Rivers', 'Oyo', 'Kaduna', 'Ogun', 'Anambra', 
    'Delta', 'Edo', 'Plateau', 'Kwara', 'Bauchi', 'Cross River', 'Imo', 'Osun',
    'Akwa Ibom', 'Sokoto', 'Benue', 'Katsina', 'Borno', 'Adamawa', 'Taraba',
    'Nasarawa', 'Kebbi', 'Niger', 'Zamfara', 'Jigawa', 'Gombe', 'Yobe',
    'Kogi', 'Enugu', 'Abia', 'Ebonyi', 'Ekiti', 'Ondo', 'Bayelsa'
  ];

  const propertyTypes = [
    'Apartment', 'Flat', 'Duplex', 'House', 'Villa', 'Mansion', 'Bungalow',
    'Penthouse', 'Studio', 'Self-Contained', 'Room and Parlour', 'Mini Flat'
  ];

  const amenitiesList = [
    'Air Conditioning', 'Parking', 'Swimming Pool', 'Gym', 'Security', 'Generator',
    'Water Supply', 'Internet/WiFi', 'Elevator', 'Balcony', 'Garden', 'Laundry',
    'Kitchen Appliances', 'Furnished', 'Wardrobes', 'Tiles', 'POP Ceiling',
    'Chandelier', 'Jacuzzi', 'Playground', 'Shopping Mall', 'School Nearby',
    'Hospital Nearby', 'Church/Mosque Nearby', 'Market Nearby', 'Transport Hub'
  ];

  const documentsRequiredList = [
    'Valid ID', 'Passport Photograph', 'Proof of Income', 'Bank Statement',
    'Letter of Employment', 'Guarantor Letter', 'Utility Bill', 'Reference Letter'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value) 
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    // In a real app, you would upload to a cloud service
    const newImages = files.map(file => ({
      id: Date.now() + Math.random(),
      file,
      url: URL.createObjectURL(file)
    }));
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
  };

  const removeImage = (imageId) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== imageId)
    }));
  };

  const nextStep = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log('Property listing submitted:', formData);
      setIsSubmitting(false);
      alert('Property listed successfully!');
      // Redirect to dashboard or property page
      window.location.href = '/landlord/dashboard';
    }, 2000);
  };

  const formatPrice = (price) => {
    if (!price) return '';
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(parseInt(price));
  };

  const steps = [
    { id: 1, title: 'Basic Information', description: 'Property details and type' },
    { id: 2, title: 'Location', description: 'Address and location details' },
    { id: 3, title: 'Property Details', description: 'Rooms, size, and features' },
    { id: 4, title: 'Pricing & Terms', description: 'Rent and rental terms' },
    { id: 5, title: 'Photos & Media', description: 'Property images and videos' },
    { id: 6, title: 'Review & Publish', description: 'Final review and submission' }
  ];

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900">List Your Property</h1>
              <p className="mt-2 text-gray-600">
                Reach thousands of potential tenants across Nigeria
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}
                >
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step.id <= currentStep 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {step.id < currentStep ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        step.id
                      )}
                    </div>
                    <div className="ml-3 hidden sm:block">
                      <p className={`text-sm font-medium ${
                        step.id <= currentStep ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-gray-500">{step.description}</p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-4 ${
                      step.id < currentStep ? 'bg-green-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Tell us about your property
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="title">Property Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="e.g., Modern 3-Bedroom Apartment with Pool"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="propertyType">Property Type *</Label>
                    <Select value={formData.propertyType} onValueChange={(value) => handleInputChange('propertyType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                      <SelectContent>
                        {propertyTypes.map(type => (
                          <SelectItem key={type} value={type.toLowerCase()}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="description">Property Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Describe your property in detail..."
                      rows={4}
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Be descriptive and highlight key features
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Location */}
            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Location Details</CardTitle>
                  <CardDescription>
                    Where is your property located?
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="address">Full Address *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="e.g., 15 Admiralty Way, Lekki Phase 1"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City/Area *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="e.g., Lekki"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          {nigerianStates.map(state => (
                            <SelectItem key={state} value={state.toLowerCase()}>{state}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="landmark">Nearby Landmark</Label>
                    <Input
                      id="landmark"
                      value={formData.landmark}
                      onChange={(e) => handleInputChange('landmark', e.target.value)}
                      placeholder="e.g., Near Shoprite, Ikota Shopping Complex"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Property Details */}
            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Property Details</CardTitle>
                  <CardDescription>
                    Specifications and features
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="bedrooms">Bedrooms *</Label>
                      <Select value={formData.bedrooms} onValueChange={(value) => handleInputChange('bedrooms', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="studio">Studio</SelectItem>
                          <SelectItem value="1">1 Bedroom</SelectItem>
                          <SelectItem value="2">2 Bedrooms</SelectItem>
                          <SelectItem value="3">3 Bedrooms</SelectItem>
                          <SelectItem value="4">4 Bedrooms</SelectItem>
                          <SelectItem value="5">5 Bedrooms</SelectItem>
                          <SelectItem value="6+">6+ Bedrooms</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="bathrooms">Bathrooms *</Label>
                      <Select value={formData.bathrooms} onValueChange={(value) => handleInputChange('bathrooms', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Bathroom</SelectItem>
                          <SelectItem value="2">2 Bathrooms</SelectItem>
                          <SelectItem value="3">3 Bathrooms</SelectItem>
                          <SelectItem value="4">4 Bathrooms</SelectItem>
                          <SelectItem value="5+">5+ Bathrooms</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="toilets">Toilets</Label>
                      <Select value={formData.toilets} onValueChange={(value) => handleInputChange('toilets', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Toilet</SelectItem>
                          <SelectItem value="2">2 Toilets</SelectItem>
                          <SelectItem value="3">3 Toilets</SelectItem>
                          <SelectItem value="4">4 Toilets</SelectItem>
                          <SelectItem value="5+">5+ Toilets</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="size">Size (Square Meters)</Label>
                      <Input
                        id="size"
                        type="number"
                        value={formData.size}
                        onChange={(e) => handleInputChange('size', e.target.value)}
                        placeholder="e.g., 120"
                      />
                    </div>

                    <div>
                      <Label htmlFor="furnished">Furnishing Status</Label>
                      <Select value={formData.furnished} onValueChange={(value) => handleInputChange('furnished', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="furnished">Fully Furnished</SelectItem>
                          <SelectItem value="semi-furnished">Semi Furnished</SelectItem>
                          <SelectItem value="unfurnished">Unfurnished</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-medium">Amenities</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                      {amenitiesList.map((amenity) => (
                        <div key={amenity} className="flex items-center space-x-2">
                          <Checkbox
                            id={amenity}
                            checked={formData.amenities.includes(amenity)}
                            onCheckedChange={() => handleArrayChange('amenities', amenity)}
                          />
                          <Label htmlFor={amenity} className="text-sm">{amenity}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Pricing & Terms */}
            {currentStep === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle>Pricing & Rental Terms</CardTitle>
                  <CardDescription>
                    Set your rental price and terms
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="price">Annual Rent (₦) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="e.g., 2500000"
                      required
                    />
                    {formData.price && (
                      <p className="text-sm text-gray-600 mt-1">
                        {formatPrice(formData.price)} per year
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="negotiable"
                      checked={formData.negotiable}
                      onCheckedChange={(checked) => handleInputChange('negotiable', checked)}
                    />
                    <Label htmlFor="negotiable">Price is negotiable</Label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="availableFrom">Available From</Label>
                      <Input
                        id="availableFrom"
                        type="date"
                        value={formData.availableFrom}
                        onChange={(e) => handleInputChange('availableFrom', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="minimumStay">Minimum Stay</Label>
                      <Select value={formData.minimumStay} onValueChange={(value) => handleInputChange('minimumStay', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-month">1 Month</SelectItem>
                          <SelectItem value="3-months">3 Months</SelectItem>
                          <SelectItem value="6-months">6 Months</SelectItem>
                          <SelectItem value="1-year">1 Year</SelectItem>
                          <SelectItem value="2-years">2 Years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-medium">Required Documents</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                      {documentsRequiredList.map((doc) => (
                        <div key={doc} className="flex items-center space-x-2">
                          <Checkbox
                            id={doc}
                            checked={formData.documentsRequired.includes(doc)}
                            onCheckedChange={() => handleArrayChange('documentsRequired', doc)}
                          />
                          <Label htmlFor={doc} className="text-sm">{doc}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cautionFee">Caution Fee (₦)</Label>
                      <Input
                        id="cautionFee"
                        type="number"
                        value={formData.cautionFee}
                        onChange={(e) => handleInputChange('cautionFee', e.target.value)}
                        placeholder="e.g., 500000"
                      />
                    </div>

                    <div>
                      <Label htmlFor="agentFee">Agent Fee (₦)</Label>
                      <Input
                        id="agentFee"
                        type="number"
                        value={formData.agentFee}
                        onChange={(e) => handleInputChange('agentFee', e.target.value)}
                        placeholder="e.g., 250000"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 5: Photos & Media */}
            {currentStep === 5 && (
              <Card>
                <CardHeader>
                  <CardTitle>Photos & Media</CardTitle>
                  <CardDescription>
                    Upload high-quality photos of your property
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Property Photos *</Label>
                    <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">
                        Upload high-quality photos of your property
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        JPG, PNG or WebP files up to 10MB each
                      </p>
                      <Input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('image-upload').click()}
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Choose Photos
                      </Button>
                    </div>
                  </div>

                  {formData.images.length > 0 && (
                    <div>
                      <Label>Uploaded Photos ({formData.images.length})</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                        {formData.images.map((image, index) => (
                          <div key={image.id} className="relative">
                            <img
                              src={image.url}
                              alt={`Property ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(image.id)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <X className="h-4 w-4" />
                            </button>
                            {index === 0 && (
                              <Badge className="absolute bottom-2 left-2 bg-green-600">
                                Cover Photo
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        First photo will be used as cover photo. Drag to reorder.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step 6: Review & Publish */}
            {currentStep === 6 && (
              <Card>
                <CardHeader>
                  <CardTitle>Review & Publish</CardTitle>
                  <CardDescription>
                    Review your listing before publishing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2">{formData.title}</h3>
                    <p className="text-gray-600 mb-2">{formData.description}</p>
                    <div className="flex items-center text-sm text-gray-600 space-x-4">
                      <span>{formData.bedrooms} bed</span>
                      <span>{formData.bathrooms} bath</span>
                      <span>{formData.propertyType}</span>
                    </div>
                    <div className="mt-2">
                      <span className="text-2xl font-bold text-green-600">
                        {formatPrice(formData.price)}
                      </span>
                      <span className="text-gray-500 ml-2">per year</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Location</h4>
                      <p className="text-sm text-gray-600">{formData.address}</p>
                      <p className="text-sm text-gray-600">{formData.city}, {formData.state}</p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Amenities</h4>
                      <div className="flex flex-wrap gap-1">
                        {formData.amenities.slice(0, 5).map((amenity, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                        {formData.amenities.length > 5 && (
                          <Badge variant="secondary" className="text-xs">
                            +{formData.amenities.length - 5} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Contact Information</h4>
                    <div className="text-sm text-gray-600">
                      <p>Name: {formData.contactName}</p>
                      <p>Phone: {formData.contactPhone}</p>
                      <p>Email: {formData.contactEmail}</p>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">Publishing your listing</h4>
                    <p className="text-sm text-green-700">
                      Once published, your property will be visible to thousands of potential tenants.
                      You'll receive notifications for inquiries and applications.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                Previous
              </Button>

              <div className="flex space-x-4">
                {currentStep < 6 ? (
                  <Button type="button" onClick={nextStep}>
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Publishing...' : 'Publish Listing'}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}