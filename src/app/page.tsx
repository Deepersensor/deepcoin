'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import WalletConnection from '@/components/wallet/WalletConnection';

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeFeature, setActiveFeature] = useState<number | null>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const orbitalsRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      if (backgroundRef.current) {
        const rect = backgroundRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const moveX = (e.clientX - centerX) / 50;
        const moveY = (e.clientY - centerY) / 50;
        
        backgroundRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
      }
      
      if (orbitalsRef.current) {
        const children = Array.from(orbitalsRef.current.children);
        children.forEach((child, index) => {
          const factor = (index + 1) * 3;
          const moveX = (centerX - e.clientX) / factor;
          const moveY = (centerY - e.clientY) / factor;
          (child as HTMLElement).style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      controls.start({
        background: [
          'linear-gradient(45deg, rgba(76, 0, 255, 0.7) 0%, rgba(0, 209, 255, 0.7) 100%)',
          'linear-gradient(135deg, rgba(255, 0, 136, 0.7) 0%, rgba(0, 153, 255, 0.7) 100%)',
          'linear-gradient(225deg, rgba(255, 119, 0, 0.7) 0%, rgba(138, 0, 255, 0.7) 100%)',
          'linear-gradient(315deg, rgba(0, 213, 255, 0.7) 0%, rgba(255, 0, 93, 0.7) 100%)',
        ],
      }, { duration: 20, repeat: Infinity, repeatType: 'reverse' });
    }, 100);

    return () => clearInterval(interval);
  }, [controls]);

  const features = [
    {
      title: "AI Predictions",
      description: "Experience cutting‑edge predictive analytics on the blockchain.",
      link: "/dashboard",
      icon: "✧"
    },
    {
      title: "Quantum Trading",
      description: "Trade seamlessly in a futuristic marketplace.",
      link: "/dashboard",
      icon: "◈"
    },
    {
      title: "Neural Market",
      description: "Access market data in real‑time with our intuitive interface.",
      link: "/dashboard",
      icon: "⟡"
    },
    {
      title: "Mindful Portfolio",
      description: "Manage your assets with advanced, secure tools.",
      link: "/dashboard",
      icon: "⧫"
    }
  ];

  const floatingBubbles = Array(12).fill(0).map((_, i) => {
    const size = Math.random() * 100 + 50;
    const duration = Math.random() * 40 + 20;
    const delay = Math.random() * 10;
    const xPos = Math.random() * 100;
    const yStart = Math.random() * 120 + 100;
    
    return (
      <motion.div
        key={i}
        className="floating-bubble"
        initial={{ 
          x: `${xPos}vw`, 
          y: `${yStart}vh`, 
          opacity: 0.1 + Math.random() * 0.3 
        }}
        animate={{
          y: '-100vh',
          rotate: [0, 180, 360],
        }}
        transition={{ 
          duration: duration,
          repeat: Infinity,
          delay: delay,
          ease: "linear"
        }}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: `radial-gradient(circle at 30% 30%, rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.2), transparent)`,
          position: 'absolute',
          backdropFilter: 'blur(5px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      />
    );
  });

  return (
    <main className="surreal-container">
      <div className="background-layer" ref={backgroundRef}>
        <motion.div
          className="animated-gradient"
          animate={controls}
        />
        <div className="noise-overlay"></div>
        {floatingBubbles}
      </div>
      
      {/* New Header Section */}
      <header className="p-8 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-4">Welcome to DeepCoin</h1>
        <p className="text-lg md:text-2xl mb-6 max-w-2xl mx-auto">
          Dive into the future of decentralized finance with our innovative blockchain wallet solution.
        </p>
        <WalletConnection redirectTo="/dashboard" />
      </header>
      
      {/* New Features and About Sections */}
      <section className="content-container py-12">
        <motion.div 
          className="hero-text mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Explore Innovative Features</h2>
          <p className="text-md md:text-lg text-gray-300 max-w-xl mx-auto mb-8">
            Connect your wallet to unlock full functionality or explore our demo mode with template data.
          </p>
        </motion.div>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <Link href={feature.link} key={index}>
              <motion.div 
                className="feature-card"
                whileHover={{ 
                  scale: 1.03, 
                  rotateY: 10,
                  rotateX: -10,
                  boxShadow: "0 25px 50px rgba(0,0,0,0.2)"
                }}
                onHoverStart={() => setActiveFeature(index)}
                onHoverEnd={() => setActiveFeature(null)}
                style={{ 
                  transform: activeFeature === index 
                    ? `perspective(1000px) rotateX(${(mousePosition.y - window.innerHeight/2) / 50}deg) rotateY(${-(mousePosition.x - window.innerWidth/2) / 50}deg)` 
                    : "perspective(1000px)" 
                }}
              >
                <div className="feature-icon text-4xl mb-4">{feature.icon}</div>
                <h2 className="text-2xl font-bold mb-2">{feature.title}</h2>
                <p className="text-gray-300">{feature.description}</p>
                <div className="feature-hover-effect"></div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      <section className="content-container py-12">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-4">About DeepCoin</h2>
          <p className="max-w-2xl mx-auto text-gray-300">
            DeepCoin leverages advanced technologies to bring an unparalleled cryptocurrency experience.
            Whether you're a veteran trader or a curious newcomer, our platform provides innovative tools for every need.
          </p>
        </motion.div>
      </section>
      
      <div className="content-container">
        <motion.div 
          className="hero-text"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
        >
          <div className="orbitals" ref={orbitalsRef}>
            {[1, 2, 3].map((i) => (
              <div key={i} className={`orbital orbital-${i}`}></div>
            ))}
          </div>
          <h1>DEEPCOIN</h1>
          <div className="subtitle">
            <span>Where</span>
            <motion.div 
              className="changing-words"
              animate={{ 
                y: [0, -40, -80, -120, -160, -200, 0], 
                opacity: [0, 1, 1, 1, 1, 1, 0],
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              <span>Reality</span>
              <span>Perception</span>
              <span>Currency</span>
              <span>Fortune</span>
              <span>Time</span>
              <span>Reality</span>
            </motion.div>
            <span>Bends</span>
          </div>
          <p className="hero-description">A cryptocurrency experience beyond the boundaries of conventional existence</p>
        </motion.div>

        <motion.div 
          className="cosmic-badge"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
        >
          <div className="cosmic-badge-inner">
            <div className="cosmic-circle"></div>
            <span>Powered by<br/>Deepersensor</span>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
