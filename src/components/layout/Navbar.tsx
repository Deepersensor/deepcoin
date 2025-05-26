'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import useMultiChainWallet from '@/hooks/useMultiChainWallet';
import { truncateAddress } from '@/lib/utils/address';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isConnected, walletData } = useMultiChainWallet();
  const pathname = usePathname();

  // Check if the current page is signin or signup to hide auth buttons
  const isAuthPage = pathname === '/signin' || pathname === '/signup';
  
  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Features', href: '#features' },
    { name: 'About', href: '#about' },
    { name: 'Support', href: '#support' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-gray-900 bg-opacity-80 backdrop-blur-lg shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-600 to-cyan-400"></div>
              <span className="ml-2 text-xl font-semibold text-white">DeepCoin</span>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Navigation items */}
            <div className="flex items-center space-x-6">
              {navItems.map((item) => (
                <Link 
                  key={item.name} 
                  href={item.href}
                  className={`text-sm text-gray-300 hover:text-white transition-colors ${
                    pathname === item.href ? 'text-white font-medium' : ''
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            
            {/* Auth buttons */}
            {!isAuthPage && (
              <div className="flex items-center space-x-3 ml-6">
                {isConnected && walletData ? (
                  <Link
                    href="/dashboard"
                    className="py-2 px-4 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white text-sm rounded-lg transition-all duration-300 flex items-center space-x-2"
                  >
                    <span className="hidden sm:inline">Dashboard</span>
                    <span className="inline-block bg-black bg-opacity-30 py-1 px-2 rounded-md text-xs">
                      {truncateAddress(walletData.address)}
                    </span>
                  </Link>
                ) : (
                  <>
                    <Link 
                      href="/signin" 
                      className="text-sm text-white hover:text-cyan-300 transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link 
                      href="/signup" 
                      className="py-2 px-4 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white text-sm rounded-lg transition-all duration-300"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white focus:outline-none"
            >
              <svg
                className={`h-6 w-6 ${isMobileMenuOpen ? 'hidden' : 'block'}`}
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`h-6 w-6 ${isMobileMenuOpen ? 'block' : 'hidden'}`}
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <motion.div 
        className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ 
          opacity: isMobileMenuOpen ? 1 : 0, 
          y: isMobileMenuOpen ? 0 : -20 
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-800">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-md"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          
          {!isAuthPage && (
            <>
              {isConnected && walletData ? (
                <Link
                  href="/dashboard"
                  className="block px-3 py-2 text-base font-medium text-white bg-gradient-to-r from-purple-600 to-cyan-600 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard ({truncateAddress(walletData.address, 4, 4)})
                </Link>
              ) : (
                <>
                  <Link
                    href="/signin"
                    className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="block px-3 py-2 text-base font-medium text-white bg-gradient-to-r from-purple-600 to-cyan-600 rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </motion.div>
    </nav>
  );
}