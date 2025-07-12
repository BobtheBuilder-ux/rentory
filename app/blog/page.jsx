'use client';

import { Calendar, User, ArrowRight, Search, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function BlogPage() {
  const featuredPost = {
    id: 1,
    title: "The Ultimate Guide to Renting in Lagos: Everything You Need to Know in 2024",
    excerpt: "From Victoria Island to Ikeja, discover the best neighborhoods, average rental prices, and insider tips for finding your perfect home in Lagos.",
    image: "https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=800",
    author: "Adebayo Ogundimu",
    date: "January 15, 2024",
    readTime: "8 min read",
    category: "City Guides",
    featured: true
  };

  const blogPosts = [
    {
      id: 2,
      title: "5 Red Flags to Watch Out for When Viewing Properties",
      excerpt: "Learn how to spot potential issues during property viewings and protect yourself from rental scams.",
      image: "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=400",
      author: "Fatima Al-Hassan",
      date: "January 12, 2024",
      readTime: "5 min read",
      category: "Tips & Advice"
    },
    {
      id: 3,
      title: "Understanding Your Rights as a Tenant in Nigeria",
      excerpt: "A comprehensive guide to tenant rights, landlord obligations, and what to do when things go wrong.",
      image: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=400",
      author: "Chinedu Okoro",
      date: "January 10, 2024",
      readTime: "7 min read",
      category: "Legal"
    },
    {
      id: 4,
      title: "Abuja vs Lagos: Which City is Better for Young Professionals?",
      excerpt: "Compare living costs, job opportunities, and lifestyle factors to decide between Nigeria's two major cities.",
      image: "https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=400",
      author: "Kemi Adebisi",
      date: "January 8, 2024",
      readTime: "6 min read",
      category: "City Guides"
    },
    {
      id: 5,
      title: "How to Negotiate Rent Like a Pro",
      excerpt: "Master the art of rent negotiation with these proven strategies and tips from real estate experts.",
      image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400",
      author: "David Brown",
      date: "January 5, 2024",
      readTime: "4 min read",
      category: "Tips & Advice"
    },
    {
      id: 6,
      title: "The Rise of Co-living Spaces in Nigerian Cities",
      excerpt: "Explore the growing trend of co-living and whether it's the right housing solution for you.",
      image: "https://images.pexels.com/photos/1546166/pexels-photo-1546166.jpeg?auto=compress&cs=tinysrgb&w=400",
      author: "Lisa Johnson",
      date: "January 3, 2024",
      readTime: "5 min read",
      category: "Trends"
    },
    {
      id: 7,
      title: "First-Time Renter's Checklist: 20 Things You Must Know",
      excerpt: "Essential tips and a comprehensive checklist for anyone renting their first apartment in Nigeria.",
      image: "https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=400",
      author: "Adebayo Ogundimu",
      date: "December 28, 2023",
      readTime: "9 min read",
      category: "Tips & Advice"
    }
  ];

  const categories = [
    "All Posts",
    "City Guides",
    "Tips & Advice",
    "Legal",
    "Trends",
    "Market Updates",
    "Technology"
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Rentory Blog
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Insights, tips, and guides to help you navigate Nigeria's rental market with confidence.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-12">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search articles..."
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={category === "All Posts" ? "default" : "outline"}
                  size="sm"
                  className={category === "All Posts" ? "bg-green-600 hover:bg-green-700" : ""}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Featured Post */}
          <div className="mb-12">
            <Card className="overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8">
                  <Badge className="mb-4 bg-green-600">{featuredPost.category}</Badge>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    {featuredPost.title}
                  </h2>
                  <p className="text-gray-600 mb-6">{featuredPost.excerpt}</p>
                  <div className="flex items-center text-sm text-gray-500 mb-6">
                    <User className="h-4 w-4 mr-2" />
                    <span className="mr-4">{featuredPost.author}</span>
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="mr-4">{formatDate(featuredPost.date)}</span>
                    <span>{featuredPost.readTime}</span>
                  </div>
                  <Button className="bg-green-600 hover:bg-green-700">
                    Read Full Article
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Card key={post.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
                <div className="relative overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-4 left-4 bg-white text-gray-900">
                    {post.category}
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">{post.excerpt}</p>
                  <div className="flex items-center text-xs text-gray-500 mb-4">
                    <User className="h-3 w-3 mr-1" />
                    <span className="mr-3">{post.author}</span>
                    <Calendar className="h-3 w-3 mr-1" />
                    <span className="mr-3">{formatDate(post.date)}</span>
                    <span>{post.readTime}</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full group-hover:bg-green-600 group-hover:text-white group-hover:border-green-600 transition-colors">
                    Read More
                    <ArrowRight className="h-3 w-3 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="border-green-600 text-green-600 hover:bg-green-50">
              Load More Articles
            </Button>
          </div>

          {/* Newsletter Signup */}
          <div className="mt-16">
            <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
                <p className="text-lg mb-6 opacity-90">
                  Get the latest rental tips, market insights, and property guides delivered to your inbox.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="bg-white text-gray-900"
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