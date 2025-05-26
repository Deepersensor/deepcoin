'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import WalletConnection from '@/components/wallet/WalletConnection';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    acceptTerms: false
  });
  const [showWalletConnect, setShowWalletConnect] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.acceptTerms) newErrors.acceptTerms = 'You must accept the terms';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    
    try {
      // Store form data in localStorage for now (replace with real backend later)
      localStorage.setItem('signupData', JSON.stringify(formData));
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      setShowWalletConnect(true);
    } catch (error) {
      setErrors({ general: 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <main className="surreal-container min-h-screen relative overflow-hidden">
      <div className="background-layer">
        <motion.div
          className="animated-gradient"
          animate={{
            background: [
              'linear-gradient(45deg, rgba(76, 0, 255, 0.7) 0%, rgba(0, 209, 255, 0.7) 100%)',
              'linear-gradient(135deg, rgba(255, 0, 136, 0.7) 0%, rgba(0, 153, 255, 0.7) 100%)',
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
        />
        <div className="noise-overlay"></div>
      </div>

      <div className="content-container flex items-center justify-center min-h-screen">
        <motion.div 
          className="form-container max-w-md w-full mx-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Link href="/" className="absolute top-8 left-8 text-white/70 hover:text-white transition-colors">
            ← Back
          </Link>

          <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
            Create Account
          </h1>
          
          {!showWalletConnect ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.general && (
                <div className="p-3 bg-red-900 bg-opacity-20 border border-red-500 rounded-lg text-red-400 text-sm">
                  {errors.general}
                </div>
              )}

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
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 bg-opacity-50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-colors"
                  required
                />
                {errors.username && <p className="text-red-400 text-sm mt-1">{errors.username}</p>}
              </div>

              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  id="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className="mt-1 w-4 h-4 rounded bg-gray-800 border-gray-600 text-cyan-400 focus:ring-cyan-400"
                />
                <label htmlFor="acceptTerms" className="text-sm text-gray-300 leading-5">
                  I accept the{' '}
                  <Link href="/terms" className="text-cyan-400 hover:text-cyan-300 underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-cyan-400 hover:text-cyan-300 underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {errors.acceptTerms && <p className="text-red-400 text-sm">{errors.acceptTerms}</p>}

              <button 
                type="submit" 
                className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  'Continue to Wallet Connection'
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-900 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                    <span className="text-green-900 font-bold text-sm">✓</span>
                  </div>
                </div>
                <h2 className="text-xl font-semibold mb-2">Account Created!</h2>
                <p className="text-gray-300 text-sm">
                  Complete your registration by connecting a blockchain wallet
                </p>
              </div>
              <WalletConnection redirectTo="/dashboard" />
            </div>
          )}

          <div className="text-center mt-8 text-sm text-white/70">
            Already have an account?{' '}
            <Link href="/signin" className="text-cyan-400 hover:text-cyan-300 transition-colors">
              Sign In
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
