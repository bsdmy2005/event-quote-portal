 "use client";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { UsersIcon, MessageSquareIcon, Menu, X, HomeIcon, Building2, Wrench, Settings, Shield } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Header({ isAdmin }: { isAdmin: boolean }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isSignedIn } = useUser();

  const navigation = [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'Agencies', href: '/agencies', icon: Building2 },
    { name: 'Suppliers', href: '/suppliers', icon: Wrench },
    { name: 'Dashboard', href: '/dashboard', icon: MessageSquareIcon },
  ];

  // Add organization management for signed-in users
  const userNavigation = isSignedIn 
    ? [...navigation, { name: 'Organization', href: '/organization', icon: Settings }]
    : navigation;

  // Add admin access for non-admin users
  const userNavigationWithAdmin = isSignedIn && !isAdmin
    ? [...userNavigation, { name: 'Admin Access', href: '/admin-access', icon: Shield }]
    : userNavigation;

  // Add admin navigation if user is admin
  const fullNavigation = isSignedIn && isAdmin
    ? [...userNavigation, { name: 'Admin', href: '/admin', icon: UsersIcon }]
    : userNavigationWithAdmin;

  return (
    <header className="bg-white/80 backdrop-blur-md border-b fixed w-full z-50">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              {/* Quote Portal Logo */}
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Quote Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {fullNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center space-x-1 text-gray-600 hover:text-primary transition-colors"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <SignedOut>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/sign-up">Sign Up</Link>
                </Button>
              </div>
            </SignedOut>
            <SignedIn>
              <UserButton
                afterSignOutUrl="/"
              />
            </SignedIn>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4">
            {fullNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center space-x-2 px-4 py-3 text-gray-600 hover:bg-primary/10"
                onClick={() => setIsMenuOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
} 