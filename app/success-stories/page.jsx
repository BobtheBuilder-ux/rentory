'use client';

import { Star, MapPin, Calendar, Quote, ArrowRight, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function SuccessStoriesPage() {
  const featuredStory = {
    id: 1,
    name: "Adebayo and Kemi Ogundimu",
    location: "Victoria Island, Lagos",
    propertyType: "3-Bedroom Apartment",
    image: "https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=800",
    userImage: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150",
    story: "After months of dealing with agents and paying multiple inspection fees, we found Rentory. Within two weeks, we had found our dream apartment and moved in. The digital process was so smooth, and we saved over ₦500,000 in agent fees!",
    timeToFind: "2 weeks",
    moneySaved: "₦500,000",
    rating: 5,
    date: "January 2024"
  };

  const successStories = [
    {
      id: 2,
      name: "Fatima Al-Hassan",
      location: "Maitama, Abuja",
      propertyType: "2-Bedroom Flat",
      image: "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=400",
      userImage: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150",
      story: "As a young professional new to Abuja, I was overwhelmed by the rental process. Rentory made it so easy - I could view properties virtually and apply online. Found my perfect home in just one week!",
      timeToFind: "1 week",
      moneySaved: "₦300,000",
      rating: 5,
      date: "December 2023",
      category: "Young Professional"
    },
    {
      id: 3,
      name: "Chinedu Okoro Family",
      location: "GRA, Port Harcourt",
      propertyType: "4-Bedroom Duplex",
      image: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=400",
      userImage: "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=150",
      story: "Moving with three kids was stressful until we found Rentory. The landlord was verified, the property was exactly as described, and the whole family loves our new home. No surprises, no hidden fees.",
      timeToFind: "3 weeks",
      moneySaved: "₦400,000",
      rating: 5,
      date: "November 2023",
      category: "Family"
    },
    {
      id: 4,
      name: "David Brown",
      location: "Ikeja, Lagos",
      propertyType: "1-Bedroom Apartment",
      image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400",
      userImage: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150",
      story: "I was skeptical about online rental platforms, but Rentory exceeded my expectations. The verification process gave me confidence, and I found a great apartment near my workplace.",
      timeToFind: "10 days",
      moneySaved: "₦200,000",
      rating: 4,
      date: "October 2023",
      category: "First-time Renter"
    },
    {
      id: 5,
      name: "Sarah Williams",
      location: "Wuse 2, Abuja",
      propertyType: "3-Bedroom House",
      image: "https://images.pexels.com/photos/1546166/pexels-photo-1546166.jpeg?auto=compress&cs=tinysrgb&w=400",
      userImage: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150",
      story: "The transparency was what won me over. No hidden charges, clear communication with the landlord, and a smooth move-in process. Rentory has changed how I think about renting.",
      timeToFind: "2 weeks",
      moneySaved: "₦350,000",
      rating: 5,
      date: "September 2023",
      category: "Returning Customer"
    },
    {
      id: 6,
      name: "Michael Johnson",
      location: "Banana Island, Lagos",
      propertyType: "5-Bedroom Villa",
      image: "https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=400",
      userImage: "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=150",
      story: "Even for luxury properties, Rentory delivered. The high-end villa we found was perfect for our family, and the landlord was professional throughout the process.",
      timeToFind: "4 weeks",
      moneySaved: "₦800,000",
      rating: 5,
      date: "August 2023",
      category: "Luxury"
    }
  ];

  const stats = [
    { number: "25,000+", label: "Happy Renters" },
    { number: "₦2.5B+", label: "Saved in Agent Fees" },
    { number: "15 days", label: "Average Time to Find Home" },
    { number: "4.9/5", label: "Average Rating" }
  ];

  const categories = ["All Stories", "Young Professional", "Family", "First-time Renter", "Returning Customer", "Luxury"];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(parseInt(price.replace('₦', '').replace(',', '')));
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-br from-green-50 to-blue-50 py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Success Stories
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Real stories from Nigerians who found their perfect homes through Rentory. 
              See how we're transforming the rental experience across the country.
            </p>
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              Share Your Story
            </Button>
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Featured Story */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Success Story</h2>
              <p className="text-lg text-gray-600">This month's inspiring rental journey</p>
            </div>

            <Card className="overflow-hidden shadow-xl">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img
                    src={featuredStory.image}
                    alt={featuredStory.propertyType}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8">
                  <div className="flex items-center mb-4">
                    <img
                      src={featuredStory.userImage}
                      alt={featuredStory.name}
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{featuredStory.name}</h3>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{featuredStory.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center mb-4">
                    {[...Array(featuredStory.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                    <span className="ml-2 text-gray-600">{featuredStory.rating}/5</span>
                  </div>

                  <Quote className="h-8 w-8 text-green-600 mb-4" />
                  <p className="text-gray-700 text-lg mb-6 italic">"{featuredStory.story}"</p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-600">{featuredStory.timeToFind}</div>
                      <div className="text-sm text-gray-600">Time to Find Home</div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600">{featuredStory.moneySaved}</div>
                      <div className="text-sm text-gray-600">Money Saved</div>
                    </div>
                  </div>

                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Found their home in {featuredStory.date}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Category Filter */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={category === "All Stories" ? "default" : "outline"}
                  size="sm"
                  className={category === "All Stories" ? "bg-green-600 hover:bg-green-700" : ""}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Success Stories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {successStories.map((story) => (
              <Card key={story.id} className="group hover:shadow-lg transition-shadow">
                <div className="relative overflow-hidden">
                  <img
                    src={story.image}
                    alt={story.propertyType}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-4 left-4 bg-green-600">
                    {story.category}
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center mb-3">
                    <img
                      src={story.userImage}
                      alt={story.name}
                      className="w-10 h-10 rounded-full object-cover mr-3"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{story.name}</h3>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{story.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center mb-3">
                    {[...Array(story.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">{story.rating}/5</span>
                  </div>

                  <p className="text-gray-700 text-sm mb-4 italic">"{story.story}"</p>

                  <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                    <div className="bg-gray-50 p-2 rounded text-center">
                      <div className="font-semibold text-green-600">{story.timeToFind}</div>
                      <div className="text-gray-600">Time to Find</div>
                    </div>
                    <div className="bg-gray-50 p-2 rounded text-center">
                      <div className="font-semibold text-blue-600">{story.moneySaved}</div>
                      <div className="text-gray-600">Money Saved</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{story.propertyType}</span>
                    <span>{story.date}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mb-16">
            <Button variant="outline" size="lg" className="border-green-600 text-green-600 hover:bg-green-50">
              Load More Stories
            </Button>
          </div>

          {/* Share Your Story CTA */}
          <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
            <CardContent className="p-8 text-center">
              <Heart className="h-12 w-12 mx-auto mb-4 opacity-90" />
              <h3 className="text-2xl font-bold mb-4">Share Your Rentory Success Story</h3>
              <p className="text-lg mb-6 opacity-90">
                Found your perfect home through Rentory? We'd love to hear about your experience 
                and share it with others looking for their dream home.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                  Share Your Story
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                  Start Your Journey
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
}