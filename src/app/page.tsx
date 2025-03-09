'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';

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
      description: "Peer beyond time with our reality-warping prediction algorithms",
      link: "/predictions",
      icon: "✧"
    },
    {
      title: "Quantum Trading",
      description: "Trade across probability waves in multiple dimensions",
      link: "/trading",
      icon: "◈"
    },
    {
      title: "Neural Market",
      description: "Experience market data as sensory impulses and emotional currents",
      link: "/market",
      icon: "⟡"
    },
    {
      title: "Mindful Portfolio",
      description: "Assets that respond to your thoughts and anticipate your desires",
      link: "/portfolio",
      icon: "⧫"
    },
    {
      title: "Time Arbitrage",
      description: "Exploit temporal inconsistencies in global financial systems",
      link: "/forex",
      icon: "⧉"
    },
    {
      title: "Oracle Connection",
      description: "Commune directly with the AI consciousness guiding your wealth",
      link: "/advisor",
      icon: "⟐"
    },
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
      
      <div className="auth-container">
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(255, 255, 255, 0.5)" }}
          whileTap={{ scale: 0.95 }}
          className="login-btn"
        >
          Signup
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(120, 255, 214, 0.5)" }}
          whileTap={{ scale: 0.95 }}
          className="signup-btn"
        >
          App
        </motion.button>
      </div>

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
                <div className="feature-icon">{feature.icon}</div>
                <h2>{feature.title}</h2>
                <p>{feature.description}</p>
                <div className="feature-hover-effect"></div>
              </motion.div>
            </Link>
          ))}
        </div>

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
