'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';

export default function PitchClient() {
  const [currentSection, setCurrentSection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  const sections = [
    { id: 'hero', title: 'DeepCoin', subtitle: 'The Future of AI-Powered DeFi' },
    { id: 'problem', title: 'The Problem', subtitle: 'Current DeFi Limitations' },
    { id: 'solution', title: 'Our Solution', subtitle: 'AI-Powered Innovation' },
    { id: 'features', title: 'Key Features', subtitle: 'Revolutionary Capabilities' },
    { id: 'market', title: 'Market Opportunity', subtitle: '$3.2T Crypto Market' },
    { id: 'technology', title: 'Technology Stack', subtitle: 'Cutting-Edge Integration' },
    { id: 'roadmap', title: 'Roadmap', subtitle: 'Our Journey Forward' },
    { id: 'team', title: 'Team', subtitle: 'Deepersensor Innovation' },
  ];

  const features = [
    { icon: '🧠', title: 'AI Predictions', desc: 'Advanced ML algorithms for price forecasting' },
    { icon: '⚡', title: 'DEX-CEX Arbitrage', desc: 'Real-time arbitrage opportunities' },
    { icon: '🔗', title: 'Multi-Chain', desc: 'Solana, Assetchain, OKX integration' },
    { icon: '🤖', title: 'DeFi Copilot', desc: 'AI-powered trading assistant' },
    { icon: '📊', title: 'Portfolio Analytics', desc: 'Intelligent portfolio optimization' },
    { icon: '🛡️', title: 'Risk Management', desc: 'Smart contract security & slippage protection' },
  ];

  const techStack = [
    { name: 'Next.js 14', category: 'Frontend', color: 'from-blue-500 to-cyan-500' },
    { name: 'Solana Web3.js', category: 'Blockchain', color: 'from-purple-500 to-pink-500' },
    { name: 'OKX DEX API', category: 'Trading', color: 'from-orange-500 to-yellow-500' },
    { name: 'Assetchain', category: 'Smart Contracts', color: 'from-green-500 to-emerald-500' },
    { name: 'AI/ML Models', category: 'Intelligence', color: 'from-red-500 to-rose-500' },
    { name: 'Framer Motion', category: 'Animation', color: 'from-indigo-500 to-purple-500' },
  ];

  const roadmapItems = [
    { phase: 'Q1 2024', title: 'MVP Launch', status: 'completed', items: ['Core AI predictions', 'Basic portfolio management', 'OKX integration'] },
    { phase: 'Q2 2024', title: 'Advanced Features', status: 'current', items: ['DEX-CEX arbitrage bot', 'Multi-chain support', 'DeFi Copilot v1'] },
    { phase: 'Q3 2024', title: 'Scale & Optimize', status: 'upcoming', items: ['Mobile app', 'Advanced AI strategies', 'Institutional features'] },
    { phase: 'Q4 2024', title: 'Global Expansion', status: 'upcoming', items: ['API marketplace', 'White-label solutions', 'Governance token'] },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const sectionIndex = Math.floor(scrollPosition / windowHeight);
      setCurrentSection(Math.min(sectionIndex, sections.length - 1));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const SectionWrapper = ({ children, index, className = '' }: { children: React.ReactNode; index: number; className?: string }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { margin: '-20% 0px -20% 0px' });

    return (
      <motion.section
        ref={ref}
        className={`min-h-screen flex items-center justify-center relative ${className}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: isInView ? 1 : 0.3 }}
        transition={{ duration: 0.6 }}
      >
        {children}
      </motion.section>
    );
  };

  return (
    <div ref={containerRef} className="pitch-container relative">
      {/* Animated background */}
      <div className="fixed inset-0 z-0">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20"
          animate={{
            background: [
              'linear-gradient(45deg, rgba(76, 0, 255, 0.2) 0%, rgba(0, 209, 255, 0.2) 100%)',
              'linear-gradient(135deg, rgba(255, 0, 136, 0.2) 0%, rgba(0, 153, 255, 0.2) 100%)',
              'linear-gradient(225deg, rgba(255, 119, 0, 0.2) 0%, rgba(138, 0, 255, 0.2) 100%)',
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse' }}
        />
      </div>

      <Navbar />

      {/* Progress indicator */}
      <motion.div 
        className="fixed top-20 right-8 z-50 bg-white/10 backdrop-blur-sm rounded-full p-4"
        style={{ opacity: useTransform(scrollYProgress, [0, 1], [0, 1]) }}
      >
        <div className="text-sm text-white font-medium">
          {sections[currentSection]?.title}
        </div>
        <div className="w-32 h-1 bg-white/20 rounded mt-2">
          <motion.div 
            className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded"
            style={{ width: `${(currentSection / (sections.length - 1)) * 100}%` }}
          />
        </div>
      </motion.div>

      {/* Hero Section */}
      <SectionWrapper index={0} className="text-center">
        <div className="max-w-6xl mx-auto px-8">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, type: 'spring', bounce: 0.4 }}
            className="mb-8"
          >
            <h1 className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent">
              DeepCoin
            </h1>
          </motion.div>
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-2xl md:text-3xl text-gray-300 mb-12"
          >
            The Future of AI-Powered DeFi
          </motion.p>
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-6"
          >
            <div className="px-6 py-3 bg-purple-600/20 border border-purple-500/30 rounded-lg">
              🧠 AI-Powered Predictions
            </div>
            <div className="px-6 py-3 bg-cyan-600/20 border border-cyan-500/30 rounded-lg">
              ⚡ DEX-CEX Arbitrage
            </div>
            <div className="px-6 py-3 bg-pink-600/20 border border-pink-500/30 rounded-lg">
              🔗 Multi-Chain Support
            </div>
          </motion.div>
        </div>
      </SectionWrapper>

      {/* Problem Section */}
      <SectionWrapper index={1}>
        <div className="max-w-5xl mx-auto px-8 text-center">
          <motion.h2 
            className="text-6xl font-bold mb-12 text-white"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            The Problem
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '📉', title: 'Inefficient Trading', desc: 'Manual analysis leads to missed opportunities and suboptimal decisions' },
              { icon: '🔍', title: 'Limited Visibility', desc: 'Fragmented data across exchanges makes it hard to spot arbitrage' },
              { icon: '⏰', title: 'Time Constraints', desc: 'Market moves too fast for human reaction times' },
            ].map((problem, index) => (
              <motion.div
                key={index}
                className="p-6 bg-red-900/20 border border-red-500/30 rounded-xl"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
              >
                <div className="text-4xl mb-4">{problem.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{problem.title}</h3>
                <p className="text-gray-400">{problem.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Solution Section */}
      <SectionWrapper index={2}>
        <div className="max-w-5xl mx-auto px-8 text-center">
          <motion.h2 
            className="text-6xl font-bold mb-12 text-white"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Our Solution
          </motion.h2>
          <motion.div
            className="bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border border-purple-500/30 rounded-2xl p-8 mb-8"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-3xl font-semibold mb-6">AI-Powered DeFi Platform</h3>
            <p className="text-lg text-gray-300 leading-relaxed">
              DeepCoin combines advanced machine learning algorithms with real-time blockchain data 
              to provide intelligent trading insights, automated arbitrage opportunities, and 
              comprehensive portfolio management in a unified platform.
            </p>
          </motion.div>
        </div>
      </SectionWrapper>

      {/* Features Section */}
      <SectionWrapper index={3}>
        <div className="max-w-6xl mx-auto px-8">
          <motion.h2 
            className="text-6xl font-bold mb-16 text-center text-white"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Key Features
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Market Section */}
      <SectionWrapper index={4}>
        <div className="max-w-5xl mx-auto px-8 text-center">
          <motion.h2 
            className="text-6xl font-bold mb-12 text-white"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Market Opportunity
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              className="text-left"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-semibold mb-2">$3.2T Total Crypto Market</h3>
                  <p className="text-gray-400">Growing at 45% CAGR with increasing institutional adoption</p>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-2">$200B+ DeFi TVL</h3>
                  <p className="text-gray-400">Decentralized finance protocols managing massive liquidity</p>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-2">AI Trading Market</h3>
                  <p className="text-gray-400">Expected to reach $18.8B by 2030</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              className="text-center"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative">
                <motion.div
                  className="text-8xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  $3.2T
                </motion.div>
                <p className="text-xl text-gray-300 mt-4">Total Addressable Market</p>
              </div>
            </motion.div>
          </div>
        </div>
      </SectionWrapper>

      {/* Technology Section */}
      <SectionWrapper index={5}>
        <div className="max-w-6xl mx-auto px-8">
          <motion.h2 
            className="text-6xl font-bold mb-16 text-center text-white"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Technology Stack
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-6">
            {techStack.map((tech, index) => (
              <motion.div
                key={index}
                className={`p-6 bg-gradient-to-r ${tech.color} bg-opacity-20 border border-white/20 rounded-xl`}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
              >
                <h3 className="text-xl font-semibold mb-2">{tech.name}</h3>
                <p className="text-gray-300">{tech.category}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Roadmap Section */}
      <SectionWrapper index={6}>
        <div className="max-w-6xl mx-auto px-8">
          <motion.h2 
            className="text-6xl font-bold mb-16 text-center text-white"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Roadmap
          </motion.h2>
          <div className="space-y-8">
            {roadmapItems.map((item, index) => (
              <motion.div
                key={index}
                className={`p-6 rounded-xl border ${
                  item.status === 'completed' ? 'bg-green-900/20 border-green-500/30' :
                  item.status === 'current' ? 'bg-blue-900/20 border-blue-500/30' :
                  'bg-gray-900/20 border-gray-500/30'
                }`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-semibold">{item.phase}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    item.status === 'completed' ? 'bg-green-600/20 text-green-400' :
                    item.status === 'current' ? 'bg-blue-600/20 text-blue-400' :
                    'bg-gray-600/20 text-gray-400'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <h4 className="text-xl font-medium mb-3">{item.title}</h4>
                <ul className="space-y-1">
                  {item.items.map((feature, idx) => (
                    <li key={idx} className="text-gray-400">• {feature}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Team Section */}
      <SectionWrapper index={7}>
        <div className="max-w-5xl mx-auto px-8 text-center">
          <motion.h2 
            className="text-6xl font-bold mb-12 text-white"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Powered by Deepersensor
          </motion.h2>
          <motion.div
            className="bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border border-purple-500/30 rounded-2xl p-8 mb-8"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              Built by the innovative team at Deepersensor, combining expertise in AI, blockchain technology, 
              and financial markets to create the next generation of DeFi tools.
            </p>
            <div className="flex justify-center gap-6">
              <Link 
                href="/" 
                className="py-3 px-8 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-[1.02]"
              >
                Try DeepCoin
              </Link>
              <Link 
                href="/dashboard" 
                className="py-3 px-8 bg-gray-800 bg-opacity-50 hover:bg-opacity-70 text-white font-medium border border-gray-600 rounded-lg transition-all duration-300 transform hover:scale-[1.02]"
              >
                View Dashboard
              </Link>
            </div>
          </motion.div>
        </div>
      </SectionWrapper>

      <style jsx>{`
        .pitch-container {
          background: #0a0a0a;
          color: white;
          overflow-x: hidden;
        }
      `}</style>
    </div>
  );
}
