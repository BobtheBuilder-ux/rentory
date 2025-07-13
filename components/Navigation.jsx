'use client';

import { useState } from 'react';
import { Menu, X, Home, Search, User, Heart, MessageCircle, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, userRole, signOut, profile } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const getDashboardLink = () => {
    switch (userRole) {
      case 'admin':
        return '/admin/dashboard';
      case 'agent':
        return '/agent/dashboard';
      case 'landlord':
        return '/landlord/dashboard';
      default:
        return '/dashboard';
    }
  };
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Home className="h-8 w-8 text-green-600 mr-2" />
              <span className="text-2xl font-bold text-gray-900">Rentory</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link href="/search" className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium">
                Search Properties
              </Link>
              <Link href="/how-it-works" className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium">
                How It Works
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium">
                About
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium">
                Contact
              </Link>
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link href={getDashboardLink()}>
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    {profile?.first_name || 'Dashboard'}
                  </Button>
                </Link>
                {(userRole === 'renter' || userRole === 'landlord') && (
                  <>
                    <Link href="/saved">
                      <Button variant="ghost" size="sm">
                        <Heart className="h-4 w-4 mr-2" />
                        Saved
                      </Button>
                    </Link>
                    <Link href="/messages">
                      <Button variant="ghost" size="sm">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Messages
                      </Button>
                    </Link>
                  </>
                )}
                <Button variant="ghost" size="sm" onClick={signOut}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
            {(userRole === 'landlord' || userRole === 'agent') && (
              <Link href="/list-property">
                <Button size="sm" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                  List Property
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={toggleMenu}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            <Link href="/search" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600">
              Search Properties
            </Link>
            <Link href="/how-it-works" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600">
              How It Works
            </Link>
            <Link href="/about" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600">
              About
            </Link>
            <Link href="/contact" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600">
              Contact
            </Link>
            
            <div className="border-t border-gray-200 pt-4">
              {isAuthenticated ? (
                <>
                  <Link href={getDashboardLink()} className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600">
                    Dashboard
                  </Link>
                  {(userRole === 'renter' || userRole === 'landlord') && (
                    <>
                      <Link href="/saved" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600">
                        Saved Properties
                      </Link>
                      <Link href="/messages" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600">
                        Messages
                      </Link>
                    </>
                  )}
                  <button onClick={signOut} className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600">
                    Login
                  </Link>
                  <Link href="/auth/register" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600">
                    Sign Up
                  </Link>
                </>
              )}
              {(userRole === 'landlord' || userRole === 'agent') && (
                <Link href="/list-property" className="block px-3 py-2 text-base font-medium text-green-600 hover:text-green-700">
                  List Your Property
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}