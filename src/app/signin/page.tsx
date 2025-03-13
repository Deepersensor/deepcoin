'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import WalletConnection from '@/components/wallet/WalletConnection';

export default function SigninPage() {
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

      <div className="content-container flex items-center justify-center min-h-screen">
        <motion.div 
          className="form-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Link href="/" className="absolute top-8 left-8 text-white/70 hover:text-white transition-colors">
            ← Back
          </Link>

          <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-purple-400">
            Connect Wallet
          </h1>
          
          <div className="mb-6">
            <p className="text-center text-gray-300 mb-6">
              Sign in to DeepCoin by connecting your Aptos blockchain wallet
            </p>
            
            <WalletConnection redirectTo="/dashboard" />
          </div>

          <div className="text-center mt-8 text-sm text-white/70">
            Don't have a wallet?{' '}
            <a 
              href="https://petra.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Get a wallet
            </a>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
