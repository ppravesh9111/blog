'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { loggedIn, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div>
            <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
              Purnendu Sharma
            </Link>
            <p className="text-gray-600 mt-1">Thoughts, experiences, and insights</p>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              Blog
            </Link>
            <Link
              href="/tweets"
              className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              Tweets
            </Link>
            {loggedIn && (
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-red-600 transition-colors font-medium"
              >
                Logout
              </button>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 border-t border-gray-100 pt-4 space-y-3">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              Blog
            </Link>
            <Link
              href="/tweets"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              Tweets
            </Link>
            {loggedIn && (
              <button
                onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                className="block text-gray-600 hover:text-red-600 transition-colors font-medium"
              >
                Logout
              </button>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
