'use client';

import Link from 'next/link';
import { useCartStore, useAuthStore } from '@/lib/store';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const items = useCartStore((state) => state.items);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Fetch current user
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          useAuthStore.setState({ user: data.user });
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    logout();
    window.location.href = '/';
  };

  const cartCount = mounted ? items.reduce((sum, item) => sum + item.quantity, 0) : 0;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2" aria-label="Sweet Dreams Cake Shop Home">
              <span className="text-3xl" aria-hidden="true">🍰</span>
              <span className="text-2xl font-bold text-primary">Sweet Dreams</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/products" className="text-text hover:text-primary transition-colors font-medium">
              Shop Cakes
            </Link>
            <Link href="/about" className="text-text hover:text-primary transition-colors font-medium">
              About Us
            </Link>
            <Link href="/contact" className="text-text hover:text-primary transition-colors font-medium">
              Contact
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {mounted && user ? (
              <>
                <Link
                  href="/profile"
                  className="text-text hover:text-primary transition-colors font-medium"
                  aria-label="User profile"
                >
                  <span className="hidden md:inline">Hi, {user.firstName}</span>
                  <span className="md:hidden">👤</span>
                </Link>
                {user.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="text-text hover:text-secondary transition-colors font-medium"
                    aria-label="Admin dashboard"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-text hover:text-primary transition-colors font-medium"
                  aria-label="Logout"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-text hover:text-primary transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="btn btn-primary"
                >
                  Sign Up
                </Link>
              </>
            )}
            <Link
              href="/cart"
              className="relative text-text hover:text-primary transition-colors"
              aria-label={`Shopping cart with ${cartCount} items`}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {mounted && cartCount > 0 && (
                <span
                  className="absolute -top-2 -right-2 bg-accent text-text text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
                  aria-label={`${cartCount} items in cart`}
                >
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
