'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add signup logic here
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
          className="form-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Link href="/" className="absolute top-8 left-8 text-white/70 hover:text-white transition-colors">
            ← Return to Reality
          </Link>

          <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
            Begin Transcendence
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="cosmic-input-container"
              >
                <input
                  type="email"
                  placeholder="Quantum Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="cosmic-input"
                  required
                />
                <div className="cosmic-input-glow"></div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="cosmic-input-container"
              >
                <input
                  type="password"
                  placeholder="Neural Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="cosmic-input"
                  required
                />
                <div className="cosmic-input-glow"></div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="cosmic-input-container"
              >
                <input
                  type="password"
                  placeholder="Confirm Neural Password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="cosmic-input"
                  required
                />
                <div className="cosmic-input-glow"></div>
              </motion.div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="cosmic-button w-full"
              type="submit"
            >
              Initialize Consciousness
            </motion.button>

            <div className="text-center mt-4 text-sm text-white/70">
              Already transcendent?{' '}
              <Link href="/signin" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                Return to Source
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </main>
  );
}
