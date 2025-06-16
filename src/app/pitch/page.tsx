'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';

export default function PitchDeck() {
  const [currentSection, setCurrentSection] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const sections = [
    {
      id: 'hero',
      title: 'DeepCoin',
      subtitle: 'AI-Powered DeFi Revolution',
      content: 'Where Reality Bends in the Crypto Universe',
      icon: '🚀',
      bg: 'from-purple-900 via-blue-900 to-indigo-900'
    },
    {
      id: 'problem',
      title: 'The Problem',
      subtitle: 'Crypto Trading Complexity',
      content: 'Manual trading, poor timing, and lack of AI insights cost traders billions annually',
      icon: '⚡',
      bg: 'from-red-900 via-orange-900 to-yellow-900'
    },
    {
      id: 'solution',
      title: 'Our Solution',
      subtitle: 'AI-Powered Trading Platform',
      content: 'Advanced AI predictions, automated strategies, and seamless DeFi integration',
      icon: '🧠',
      bg: 'from-green-900 via-teal-900 to-blue-900'
    },
    {
      id: 'features',
      title: 'Core Features',
      subtitle: 'Cutting-Edge Technology',
      content: 'DEX-CEX Arbitrage • AI Portfolio Analysis • OKX Integration • Assetchain Smart Contracts',
      icon: '⚡',
      bg: 'from-cyan-900 via-purple-900 to-pink-900'
    },
    {
      id: 'market',
      title: 'Market Opportunity',
      subtitle: '$3.2T Crypto Market',
      content: 'DeFi TVL: $100B+ • Growing demand for AI trading tools • Untapped arbitrage opportunities',
      icon: '📈',
      bg: 'from-indigo-900 via-blue-900 to-cyan-900'
    },
    {
      id: 'demo',
      title: 'Live Demo',
      subtitle: 'Experience DeepCoin',
      content: 'Ready to revolutionize your trading experience?',
      icon: '🎯',
      bg: 'from-purple-900 via-pink-900 to-red-900'
    }
  ];

  useEffect(() => {
    if (!isAutoPlay) return;
    
    const interval = setInterval(() => {
      setCurrentSection((prev) => (prev + 1) % sections.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay, sections.length]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navbar />
      
      {/* Animated Background */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${sections[currentSection].bg}`}
        key={currentSection}
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      />
      
      {/* Floating Particles */}
      <div className="absolute inset-0">
        {Array(20).fill(0).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20"
            animate={{
              x: [0, Math.random() * 100, 0],
              y: [0, Math.random() * 100, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        key={currentSection}
      >
        <motion.div
          className="text-8xl mb-8"
          variants={itemVariants}
          animate={{
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {sections[currentSection].icon}
        </motion.div>

        <motion.h1
          className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
          variants={itemVariants}
        >
          {sections[currentSection].title}
        </motion.h1>

        <motion.h2
          className="text-2xl md:text-4xl font-semibold mb-8 text-blue-200"
          variants={itemVariants}
        >
          {sections[currentSection].subtitle}
        </motion.h2>

        <motion.p
          className="text-lg md:text-xl max-w-4xl mb-12 text-gray-200 leading-relaxed"
          variants={itemVariants}
        >
          {sections[currentSection].content}
        </motion.p>

        {currentSection === sections.length - 1 && (
          <motion.div
            className="flex gap-4"
            variants={itemVariants}
          >
            <Link
              href="/dashboard"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-bold rounded-lg transform hover:scale-105 transition-all duration-300"
            >
              Try Demo
            </Link>
            <Link
              href="/okx"
              className="px-8 py-4 bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 text-white font-bold rounded-lg transform hover:scale-105 transition-all duration-300"
            >
              OKX Integration
            </Link>
          </motion.div>
        )}
      </motion.div>

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {sections.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentSection(index);
              setIsAutoPlay(false);
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSection
                ? 'bg-white scale-125'
                : 'bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>

      {/* Auto-play Toggle */}
      <button
        onClick={() => setIsAutoPlay(!isAutoPlay)}
        className="absolute top-24 right-8 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-all duration-300 z-20"
      >
        {isAutoPlay ? '⏸️ Pause' : '▶️ Play'}
      </button>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 z-20">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-500 to-cyan-500"
          initial={{ width: '0%' }}
          animate={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
}
