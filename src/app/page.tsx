'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import { useTomo } from '@/hooks/useTomo';

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeFeature, setActiveFeature] = useState<number | null>(null);
  const [testAddress, setTestAddress] = useState('');
  const [testAmount, setTestAmount] = useState('');
  const [txStatus, setTxStatus] = useState('');
  const [activeTab, setActiveTab] = useState<'solana' | 'evm' | 'services'>('solana');
  const [chainId, setChainId] = useState('1');
  const backgroundRef = useRef<HTMLDivElement>(null);
  const orbitalsRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  
  // Tomo integration with all functions
  const { 
    openConnectModal, 
    connected, 
    disconnect, 
    solanaAddress,
    evmAddress,
    signMessage,
    sendSolTransaction,
    sendSplTokenTransaction,
    // EVM functions
    switchChain,
    getChainId,
    signEvmMessage,
    sendEthTransaction,
    evmRequest,
    // Internal Wallet Services
    openSwapModal,
    openOnrampModal,
    openSendModal,
    openReceiveModal
  } = useTomo();

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
        const rect = orbitalsRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
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

  // Solana transaction handlers following the guide
  const handleSignMessage = async () => {
    try {
      setTxStatus('Signing message...');
      const signature = await signMessage('hello world');
      setTxStatus(`Message signed: ${signature}`);
    } catch (error) {
      setTxStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleSendSol = async () => {
    if (!testAddress || !testAmount) {
      setTxStatus('Please enter address and amount');
      return;
    }
    
    try {
      setTxStatus('Sending SOL transaction...');
      const signature = await sendSolTransaction(testAddress, parseFloat(testAmount));
      setTxStatus(`SOL sent! Signature: ${signature}`);
    } catch (error) {
      setTxStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleSendUSDT = async () => {
    if (!testAddress || !testAmount) {
      setTxStatus('Please enter address and amount');
      return;
    }
    
    try {
      setTxStatus('Sending USDT transaction...');
      const usdtMintAddress = 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB';
      const signature = await sendSplTokenTransaction(testAddress, parseFloat(testAmount), usdtMintAddress, 6);
      setTxStatus(`USDT sent! Signature: ${signature}`);
    } catch (error) {
      setTxStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // EVM transaction handlers following the guide
  const handleSignEvmMessage = async () => {
    if (!evmAddress) {
      setTxStatus('EVM address not available');
      return;
    }
    
    try {
      setTxStatus('Signing EVM message...');
      const signature = await signEvmMessage('hello world', evmAddress);
      setTxStatus(`EVM message signed: ${signature}`);
    } catch (error) {
      setTxStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleSwitchChain = async () => {
    try {
      setTxStatus(`Switching to chain ${chainId}...`);
      await switchChain(chainId);
      const currentChain = await getChainId();
      setTxStatus(`Switched to chain: ${currentChain}`);
    } catch (error) {
      setTxStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleSendEth = async () => {
    if (!testAddress || !testAmount) {
      setTxStatus('Please enter address and amount');
      return;
    }
    
    try {
      setTxStatus('Sending ETH transaction...');
      const signature = await sendEthTransaction(testAddress, parseFloat(testAmount));
      setTxStatus(`ETH sent! Signature: ${signature}`);
    } catch (error) {
      setTxStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleGetAccounts = async () => {
    try {
      setTxStatus('Getting accounts...');
      const accounts = await evmRequest('eth_accounts');
      setTxStatus(`Accounts: ${JSON.stringify(accounts)}`);
    } catch (error) {
      setTxStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Internal wallet services handlers
  const handleOpenSwap = async () => {
    try {
      setTxStatus('Opening swap modal...');
      await openSwapModal();
      setTxStatus('Swap modal opened');
    } catch (error) {
      setTxStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleOpenOnramp = async () => {
    try {
      setTxStatus('Opening onramp modal...');
      await openOnrampModal();
      setTxStatus('Onramp modal opened');
    } catch (error) {
      setTxStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleOpenSend = async () => {
    try {
      setTxStatus('Opening send modal...');
      await openSendModal();
      setTxStatus('Send modal opened');
    } catch (error) {
      setTxStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleOpenReceive = async () => {
    try {
      setTxStatus('Opening receive modal...');
      await openReceiveModal();
      setTxStatus('Receive modal opened');
    } catch (error) {
      setTxStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

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
      
      <Navbar />
      
      {/* Updated Header Section with Tomo integration */}
      <header className="p-8 pt-24 mt-8 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-4">Welcome to DeepCoin</h1>
        <p className="text-lg md:text-2xl mb-6 max-w-2xl mx-auto">
          Dive into the future of decentralized finance with our innovative blockchain wallet solution.
        </p>
        
        {/* Wallet connection status */}
        {connected && (
          <div className="mb-4 space-y-2">
            {solanaAddress && (
              <div className="p-3 bg-green-600 bg-opacity-20 border border-green-500 rounded-lg inline-block mr-2">
                <p className="text-green-300">
                  Solana: {solanaAddress.slice(0, 8)}...{solanaAddress.slice(-8)}
                </p>
              </div>
            )}
            {evmAddress && (
              <div className="p-3 bg-blue-600 bg-opacity-20 border border-blue-500 rounded-lg inline-block">
                <p className="text-blue-300">
                  EVM: {evmAddress.slice(0, 8)}...{evmAddress.slice(-8)}
                </p>
              </div>
            )}
          </div>
        )}
        
        <div className="flex justify-center gap-4">
          {/* Tomo Connect/Disconnect Button */}
          {!connected ? (
            <button
              onClick={openConnectModal}
              className="py-3 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-[1.02] text-lg"
            >
              🔗 Connect Wallet
            </button>
          ) : (
            <button
              onClick={disconnect}
              className="py-3 px-8 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-[1.02] text-lg"
            >
              🔌 Disconnect
            </button>
          )}
          
          <Link 
            href="/signup" 
            className="py-3 px-8 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-[1.02] text-lg"
          >
            Get Started
          </Link>
          <Link
            href="/okx"
            className="py-3 px-8 bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-[1.02] text-lg"
          >
            🚀 OKX Demo
          </Link>
          <Link
            href="#features"
            className="py-3 px-8 bg-gray-800 bg-opacity-50 hover:bg-opacity-70 text-white font-medium border border-gray-600 rounded-lg transition-all duration-300 transform hover:scale-[1.02] text-lg"
          >
            Learn More
          </Link>
        </div>

        {/* Transaction Testing Section */}
        {connected && (
          <div className="mt-8 p-6 bg-gray-800 bg-opacity-50 border border-gray-600 rounded-lg max-w-2xl mx-auto">
            <div className="flex mb-6">
              <button
                onClick={() => setActiveTab('solana')}
                className={`flex-1 py-2 px-4 rounded-l-lg transition-colors ${
                  activeTab === 'solana' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Solana Testing
              </button>
              <button
                onClick={() => setActiveTab('evm')}
                className={`flex-1 py-2 px-4 transition-colors ${
                  activeTab === 'evm' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                EVM Testing
              </button>
              <button
                onClick={() => setActiveTab('services')}
                className={`flex-1 py-2 px-4 rounded-r-lg transition-colors ${
                  activeTab === 'services' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Wallet Services
              </button>
            </div>

            {activeTab === 'solana' ? (
              <div>
                <h3 className="text-xl font-semibold mb-4">Solana Transaction Testing</h3>
                
                <div className="space-y-3 mb-4">
                  <input
                    type="text"
                    placeholder="Recipient address"
                    value={testAddress}
                    onChange={(e) => setTestAddress(e.target.value)}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                  />
                  <input
                    type="number"
                    placeholder="Amount"
                    value={testAmount}
                    onChange={(e) => setTestAmount(e.target.value)}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                    step="0.000001"
                  />
                </div>
                
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={handleSignMessage}
                    className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                  >
                    Sign Message
                  </button>
                  <button
                    onClick={handleSendSol}
                    className="flex-1 py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
                  >
                    Send SOL
                  </button>
                  <button
                    onClick={handleSendUSDT}
                    className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                  >
                    Send USDT
                  </button>
                </div>
              </div>
            ) : activeTab === 'evm' ? (
              <div>
                <h3 className="text-xl font-semibold mb-4">EVM Transaction Testing</h3>
                
                <div className="space-y-3 mb-4">
                  <input
                    type="text"
                    placeholder="Recipient address"
                    value={testAddress}
                    onChange={(e) => setTestAddress(e.target.value)}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                  />
                  <input
                    type="number"
                    placeholder="Amount (ETH)"
                    value={testAmount}
                    onChange={(e) => setTestAmount(e.target.value)}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                    step="0.000001"
                  />
                  <input
                    type="text"
                    placeholder="Chain ID (1 for Ethereum)"
                    value={chainId}
                    onChange={(e) => setChainId(e.target.value)}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <button
                    onClick={handleSignEvmMessage}
                    className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                  >
                    Sign Message
                  </button>
                  <button
                    onClick={handleSwitchChain}
                    className="py-2 px-4 bg-orange-600 hover:bg-orange-700 text-white rounded transition-colors"
                  >
                    Switch Chain
                  </button>
                  <button
                    onClick={handleSendEth}
                    className="py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
                  >
                    Send ETH
                  </button>
                  <button
                    onClick={handleGetAccounts}
                    className="py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                  >
                    Get Accounts
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-semibold mb-4">Tomo Wallet Services</h3>
                <p className="text-gray-300 mb-4 text-sm">
                  These services open Tomo's built-in UI components for wallet operations.
                </p>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleOpenSwap}
                    className="py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    🔄 Swap Tokens
                  </button>
                  <button
                    onClick={handleOpenOnramp}
                    className="py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    💳 Buy Crypto
                  </button>
                  <button
                    onClick={handleOpenSend}
                    className="py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    📤 Send Tokens
                  </button>
                  <button
                    onClick={handleOpenReceive}
                    className="py-3 px-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-lg transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    📥 Receive Tokens
                  </button>
                </div>
              </div>
            )}
            
            {txStatus && (
              <div className="p-3 bg-gray-700 border border-gray-600 rounded text-sm mt-4">
                <p className="text-gray-300 break-all">{txStatus}</p>
              </div>
            )}
          </div>
        )}
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
            <motion.div
              key={index}
              className="feature-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              onHoverStart={() => setActiveFeature(index)}
              onHoverEnd={() => setActiveFeature(null)}
            >
              <div className="feature-icon text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-300 mb-4">{feature.description}</p>
              <Link href={feature.link} className="cosmic-button">
                Explore
              </Link>
            </motion.div>
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
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            DeepCoin represents the next evolution in cryptocurrency portfolio management. 
            Our platform combines advanced AI prediction algorithms with intuitive design 
            to help you make informed trading decisions. Whether you're a seasoned trader 
            or just starting your crypto journey, DeepCoin provides the tools and insights 
            you need to succeed in the digital asset space.
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
