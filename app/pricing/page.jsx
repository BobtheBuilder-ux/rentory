'use client';

import { Check, X, Star, Shield, Zap, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function PricingPage() {
  const renterPlans = [
    {
      name: "Free",
      price: "₦0",
      period: "Forever",
      description: "Perfect for casual property browsing",
      icon: Shield,
      features: [
        "Browse unlimited properties",
        "Save up to 10 properties",
        "Basic search filters",
        "Contact landlords directly",
        "Mobile app access"
      ],
      limitations: [
        "Limited to 3 applications per month",
        "Basic customer support",
        "No priority listing access"
      ],
      cta: "Get Started Free",
      popular: false
    },
    {
      name: "Premium",
      price: "₦2,500",
      period: "per month",
      description: "For serious home seekers",
      icon: Star,
      features: [
        "Everything in Free plan",
        "Unlimited property saves",
        "Advanced search filters",
        "Unlimited applications",
        "Priority customer support",
        "Early access to new listings",
        "Property viewing scheduler",
        "Rental history tracking"
      ],
      limitations: [],
      cta: "Start Premium Trial",
      popular: true
    }
  ];

  const landlordPlans = [
    {
      name: "Basic",
      price: "₦5,000",
      period: "per property/month",
      description: "Essential tools for individual landlords",
      icon: Shield,
      features: [
        "List up to 3 properties",
        "Basic property analytics",
        "Tenant application management",
        "Direct messaging with tenants",
        "Standard listing visibility"
      ],
      limitations: [
        "Limited to 3 properties",
        "Basic support",
        "Standard listing placement"
      ],
      cta: "Start Basic Plan",
      popular: false
    },
    {
      name: "Professional",
      price: "₦12,000",
      period: "per property/month",
      description: "Advanced features for property managers",
      icon: Zap,
      features: [
        "List up to 10 properties",
        "Advanced analytics dashboard",
        "Automated tenant screening",
        "Priority listing placement",
        "Bulk property management",
        "Custom lease templates",
        "Priority customer support",
        "Marketing boost features"
      ],
      limitations: [],
      cta: "Go Professional",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "Contact us",
      description: "Tailored solutions for large portfolios",
      icon: Crown,
      features: [
        "Unlimited properties",
        "White-label solutions",
        "API access",
        "Dedicated account manager",
        "Custom integrations",
        "Advanced reporting",
        "24/7 priority support",
        "Custom branding options"
      ],
      limitations: [],
      cta: "Contact Sales",
      popular: false
    }
  ];

  const faqs = [
    {
      question: "Is there a free trial for premium plans?",
      answer: "Yes! We offer a 14-day free trial for all premium plans. No credit card required to start."
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Absolutely. You can cancel your subscription at any time. Your plan will remain active until the end of your billing period."
    },
    {
      question: "Do you offer discounts for annual payments?",
      answer: "Yes, we offer 20% discount when you pay annually instead of monthly."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major Nigerian banks, debit cards, and mobile money payments through Paystack and Flutterwave."
    },
    {
      question: "Is there a setup fee?",
      answer: "No setup fees! You only pay the monthly subscription fee for your chosen plan."
    }
  ];

  const formatPrice = (price) => {
    if (price === "Custom") return price;
    if (price === "₦0") return "Free";
    return price;
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-br from-green-50 to-blue-50 py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Choose the perfect plan for your rental journey. No hidden fees, no surprises.
            </p>
            <Badge className="bg-green-100 text-green-800 px-4 py-2">
              14-day free trial • No credit card required
            </Badge>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Pricing Tabs */}
          <Tabs defaultValue="renters" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
              <TabsTrigger value="renters">For Renters</TabsTrigger>
              <TabsTrigger value="landlords">For Landlords</TabsTrigger>
            </TabsList>

            {/* Renter Plans */}
            <TabsContent value="renters">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {renterPlans.map((plan, index) => (
                  <Card key={index} className={`relative ${plan.popular ? 'border-green-500 shadow-lg' : ''}`}>
                    {plan.popular && (
                      <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-600">
                        Most Popular
                      </Badge>
                    )}
                    <CardHeader className="text-center pb-4">
                      <div className={`w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center ${
                        plan.popular ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        <plan.icon className={`h-6 w-6 ${plan.popular ? 'text-green-600' : 'text-gray-600'}`} />
                      </div>
                      <CardTitle className="text-2xl">{plan.name}</CardTitle>
                      <div className="text-3xl font-bold text-gray-900">
                        {formatPrice(plan.price)}
                        {plan.period !== "Forever" && (
                          <span className="text-lg font-normal text-gray-600">/{plan.period}</span>
                        )}
                      </div>
                      <CardDescription>{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3 mb-6">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center">
                            <Check className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                        {plan.limitations.map((limitation, idx) => (
                          <li key={idx} className="flex items-center">
                            <X className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                            <span className="text-gray-500">{limitation}</span>
                          </li>
                        ))}
                      </ul>
                      <Button 
                        className={`w-full ${
                          plan.popular 
                            ? 'bg-green-600 hover:bg-green-700' 
                            : 'bg-gray-900 hover:bg-gray-800'
                        }`}
                      >
                        {plan.cta}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Landlord Plans */}
            <TabsContent value="landlords">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {landlordPlans.map((plan, index) => (
                  <Card key={index} className={`relative ${plan.popular ? 'border-green-500 shadow-lg' : ''}`}>
                    {plan.popular && (
                      <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-600">
                        Most Popular
                      </Badge>
                    )}
                    <CardHeader className="text-center pb-4">
                      <div className={`w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center ${
                        plan.popular ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        <plan.icon className={`h-6 w-6 ${plan.popular ? 'text-green-600' : 'text-gray-600'}`} />
                      </div>
                      <CardTitle className="text-2xl">{plan.name}</CardTitle>
                      <div className="text-3xl font-bold text-gray-900">
                        {formatPrice(plan.price)}
                        {plan.price !== "Custom" && (
                          <span className="text-lg font-normal text-gray-600">/{plan.period}</span>
                        )}
                      </div>
                      <CardDescription>{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3 mb-6">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center">
                            <Check className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                        {plan.limitations.map((limitation, idx) => (
                          <li key={idx} className="flex items-center">
                            <X className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                            <span className="text-gray-500">{limitation}</span>
                          </li>
                        ))}
                      </ul>
                      <Button 
                        className={`w-full ${
                          plan.popular 
                            ? 'bg-green-600 hover:bg-green-700' 
                            : plan.name === 'Enterprise'
                            ? 'bg-purple-600 hover:bg-purple-700'
                            : 'bg-gray-900 hover:bg-gray-800'
                        }`}
                      >
                        {plan.cta}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Features Comparison */}
          <div className="mt-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Why Choose Rentory?
              </h2>
              <p className="text-lg text-gray-600">
                Compare our features with traditional rental methods
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardContent className="p-6">
                  <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Agent Fees</h3>
                  <p className="text-gray-600">
                    Connect directly with landlords and save thousands in agent commissions
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <Zap className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Digital Process</h3>
                  <p className="text-gray-600">
                    Complete applications, sign leases, and make payments all online
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <Star className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Verified Properties</h3>
                  <p className="text-gray-600">
                    All properties are verified and landlords are screened for your safety
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-gray-600">
                Got questions? We've got answers.
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-6">
              {faqs.map((faq, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600">
                      {faq.answer}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16">
            <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
                <p className="text-lg mb-6 opacity-90">
                  Join thousands of Nigerians who have simplified their rental journey with Rentory
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                    Start Free Trial
                  </Button>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                    Contact Sales
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