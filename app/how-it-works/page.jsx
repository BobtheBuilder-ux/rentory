'use client';

import { Search, FileText, CheckCircle, Home, Shield, Clock, Users, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function HowItWorksPage() {
  const steps = [
    {
      id: 1,
      icon: Search,
      title: "Browse Properties",
      description: "Search through thousands of verified properties across Nigeria using our advanced filters.",
      details: [
        "Filter by location, price, property type, and amenities",
        "View high-quality photos and virtual tours",
        "Read verified reviews from previous tenants",
        "Save properties to your shortlist for easy comparison"
      ],
      color: "bg-blue-100 text-blue-600"
    },
    {
      id: 2,
      icon: FileText,
      title: "Apply Online",
      description: "Submit your rental application digitally with all required documents.",
      details: [
        "Complete application form with personal and financial details",
        "Upload required documents (ID, proof of income, references)",
        "Track application status in real-time",
        "Communicate directly with landlords through our platform"
      ],
      color: "bg-green-100 text-green-600"
    },
    {
      id: 3,
      icon: CheckCircle,
      title: "Move In",
      description: "Sign your lease agreement digitally and get your keys to move in.",
      details: [
        "Review and sign lease agreement electronically",
        "Make secure payments through our platform",
        "Schedule key handover and property inspection",
        "Access ongoing support throughout your tenancy"
      ],
      color: "bg-purple-100 text-purple-600"
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: "Verified Properties",
      description: "All properties are physically inspected and verified by our team"
    },
    {
      icon: Clock,
      title: "Save Time",
      description: "No more endless property visits or dealing with multiple agents"
    },
    {
      icon: Users,
      title: "Direct Communication",
      description: "Connect directly with property owners without middlemen"
    },
    {
      icon: Star,
      title: "Transparent Process",
      description: "Clear pricing, no hidden fees, and honest property descriptions"
    }
  ];

  const faqs = [
    {
      question: "How long does the application process take?",
      answer: "Most applications are processed within 24-48 hours. You'll receive real-time updates on your application status."
    },
    {
      question: "Are there any hidden fees?",
      answer: "No hidden fees! We're transparent about all costs upfront. You only pay the rent, security deposit, and any applicable service charges."
    },
    {
      question: "What documents do I need to apply?",
      answer: "Typically, you'll need a valid ID, proof of income, bank statements, and references. Specific requirements may vary by property."
    },
    {
      question: "Can I schedule property visits?",
      answer: "Yes! You can schedule visits directly through our platform. Many properties also offer virtual tours for your convenience."
    }
  ];

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-br from-green-50 to-blue-50 py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How Rentory Works
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Finding your perfect home in Nigeria has never been easier. 
              Our digital-first approach eliminates the hassle of traditional rental processes.
            </p>
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              Start Your Search
            </Button>
          </div>
        </div>

        {/* Steps Section */}
        <div className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Three Simple Steps to Your New Home
              </h2>
              <p className="text-lg text-gray-600">
                From search to move-in, we've streamlined the entire rental process
              </p>
            </div>

            <div className="space-y-12">
              {steps.map((step, index) => (
                <div key={step.id} className="flex flex-col lg:flex-row items-center gap-8">
                  <div className={`lg:w-1/3 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                    <Card className="h-full">
                      <CardContent className="p-8">
                        <div className={`w-16 h-16 rounded-full ${step.color} flex items-center justify-center mb-6`}>
                          <step.icon className="h-8 w-8" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                          Step {step.id}: {step.title}
                        </h3>
                        <p className="text-gray-600 mb-6">{step.description}</p>
                        <ul className="space-y-2">
                          {step.details.map((detail, idx) => (
                            <li key={idx} className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-600">{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className={`lg:w-2/3 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                    <div className="bg-gray-200 rounded-lg h-64 lg:h-80 flex items-center justify-center">
                      <div className="text-center">
                        <step.icon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">Step {step.id} Illustration</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-white py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Why Choose Rentory?
              </h2>
              <p className="text-lg text-gray-600">
                We're revolutionizing the rental experience in Nigeria
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <benefit.icon className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-gray-600">
                Got questions? We've got answers.
              </p>
            </div>

            <div className="space-y-6">
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
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 py-16 px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Find Your Perfect Home?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of Nigerians who have simplified their rental journey with Rentory
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                Start Searching Properties
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