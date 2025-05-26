'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import WalletConnection from '@/components/wallet/WalletConnection';
import MultiChainWalletConnection from '@/components/wallet/MultiChainWalletConnection';
import { ArrowsRightLeftIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import useMultiChainWallet from '@/hooks/useMultiChainWallet';
import Navbar from '@/components/layout/Navbar';

export default function SigninPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showWalletConnect, setShowWalletConnect] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedWalletAuth, setSelectedWalletAuth] = useState<'form' | 'wallet'>('form');
  const router = useRouter();
  const { isConnected } = useMultiChainWallet();
  
  // If user is already connected with wallet, redirect to dashboard
  useEffect(() => {
    if (isConnected) {
      router.push('/dashboard');
    }
  }, [isConnected, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    
    // Simulate authentication (replace with real backend call)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user exists in localStorage (replace with real backend)
      const signupData = localStorage.getItem('signupData');
      if (signupData) {
        const userData = JSON.parse(signupData);
        if (userData.email === formData.email) {
          setShowWalletConnect(true);
        } else {
          setErrors({ email: 'Account not found' });
        }
      } else {
        setErrors({ email: 'Account not found. Please sign up first.' });
      }
    } catch (error) {
      setErrors({ password: 'Authentication failed' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleTabChange = (tab: 'form' | 'wallet') => {
    setSelectedWalletAuth(tab);
    // Clear any existing errors when switching tabs
    setErrors({});
  };

  return (
    <main className="surreal-container min-h-screen relative overflow-hidden">
      <div className="background-layer">
        <motion.div
          className="animated-gradient"
          animate={{
            background: [
              'linear-gradient(225deg, rgba(255, 119, 0, 0.7) 0%, rgba(138, 0, 255, 0.7) 100%)',
              'linear-gradient(315deg, rgba(0, 213, 255, 0.7) 0%, rgba(255, 0, 93, 0.7) 100%)',
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
        />
        <div className="noise-overlay"></div>
      </div>
      
      <Navbar />

      <div className="content-container flex items-center justify-center min-h-screen pt-16">
        <motion.div 
          className="form-container max-w-md w-full mx-4 bg-gray-900 bg-opacity-50 backdrop-blur-lg p-8 rounded-xl border border-gray-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-purple-400">
            Sign In
          </h1>
          
          {!showWalletConnect ? (
            <>
              <div className="flex border border-gray-700 rounded-lg mb-6">
                <button
                  className={`flex-1 py-3 px-4 text-sm font-medium ${
                    selectedWalletAuth === 'form'
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  onClick={() => handleTabChange('form')}
                >
                  Email
                </button>
                <button
                  className={`flex-1 py-3 px-4 text-sm font-medium ${
                    selectedWalletAuth === 'wallet'
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  onClick={() => handleTabChange('wallet')}
                >
                  Wallet
                </button>
              </div>
              
              <AnimatePresence mode="wait">
                {selectedWalletAuth === 'form' ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div>
                        <input
                          type="email"
                          name="email"
                          placeholder="Email Address"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-gray-800 bg-opacity-50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-colors"
                          required
                        />
                        {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                      </div>

                      <div>
                        <input
                          type="password"
                          name="password"
                          placeholder="Password"
                          value={formData.password}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-gray-800 bg-opacity-50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-colors"
                          required
                        />
                        {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
                      </div>

                      <div className="flex justify-between items-center text-sm">
                        <Link href="/forgot-password" className="text-cyan-400 hover:text-cyan-300">
                          Forgot Password?
                        </Link>
                      </div>

                      <button 
                        type="submit" 
                        className="w-full py-3 px-6 bg-gradient-to-r from-orange-600 to-purple-600 hover:from-orange-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                            Signing In...
                          </div>
                        ) : (
                          'Sign In'
                        )}
                      </button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="wallet"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <p className="text-center text-gray-300 mb-4">
                      Connect your wallet to sign in. If you've previously connected this wallet, 
                      you'll be signed in automatically.
                    </p>
                    <MultiChainWalletConnection redirectTo="/dashboard" />
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-900 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                    <span className="text-green-900 font-bold text-sm">✓</span>
                  </div>
                </div>
                <h2 className="text-xl font-semibold mb-2">Authentication Successful!</h2>
                <p className="text-gray-300 text-sm">
                  Please connect your wallet to continue
                </p>
              </div>
              <WalletConnection redirectTo="/dashboard" />
            </div>
          )}

          <div className="text-center mt-8 text-sm text-white/70">
            Don't have an account?{' '}
            <Link href="/signup" className="text-cyan-400 hover:text-cyan-300 transition-colors">
              Sign Up
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
