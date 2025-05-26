'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BellIcon, 
  UserCircleIcon, 
  HomeIcon, 
  ChartBarIcon, 
  KeyIcon, 
  CurrencyDollarIcon, 
  WalletIcon,
  ChevronDownIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { truncateAddress } from '@/lib/utils/address';
import useMultiChainWallet from '@/hooks/useMultiChainWallet';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showWalletDropdown, setShowWalletDropdown] = useState(false);
  const { disconnect, walletData, isConnected } = useMultiChainWallet();
  
  const [notifications] = useState([
    {
      id: 1,
      title: 'BTC Price Alert',
      message: 'Bitcoin surpassed your $60,000 alert threshold',
      time: '10 min ago'
    },
    {
      id: 2,
      title: 'Prediction Accuracy',
      message: 'Your ETH predictions were 85% accurate last week',
      time: '1 hour ago'
    },
    {
      id: 3,
      title: 'API Key Expiring',
      message: 'Your Blockchair API key will expire in 3 days',
      time: '5 hours ago'
    }
  ]);

  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Predictions', href: '/predictions', icon: ChartBarIcon },
    { name: 'API Keys', href: '/dashboard/api-keys', icon: KeyIcon },
    { name: 'Converter', href: '/dashboard/converter', icon: CurrencyDollarIcon },
  ];

  const handleDisconnect = async () => {
    try {
      await disconnect();
      // Redirect to home page after disconnect
      window.location.href = '/';
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-opacity-20 backdrop-filter backdrop-blur-lg bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and main nav */}
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-600 to-cyan-400"></div>
              </Link>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  {navItems.map((item) => {
                    const IconComponent = item.icon;
                    const isActive = pathname === item.href;
                    
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${
                          isActive
                            ? 'bg-gray-700 text-white'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        }`}
                      >
                        <IconComponent className="h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
            
            {/* Right side nav items */}
            <div className="flex items-center space-x-4">
              {/* Notification Bell */}
              <div className="relative">
                <motion.button
                  className="p-2 rounded-full text-gray-300 hover:text-white focus:outline-none relative"
                  onClick={() => setShowNotifications(!showNotifications)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <BellIcon className="h-6 w-6" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                  )}
                </motion.button>
                
                {/* Notifications Dropdown */}
                {showNotifications && (
                  <motion.div 
                    className="absolute right-0 mt-2 w-80 bg-gray-900 bg-opacity-95 backdrop-filter backdrop-blur-lg rounded-lg shadow-xl border border-gray-800 z-50"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className="p-4 border-b border-gray-700">
                      <h3 className="text-lg font-semibold">Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className="p-4 border-b border-gray-800 hover:bg-gray-800 hover:bg-opacity-50"
                        >
                          <h4 className="font-medium text-sm">{notification.title}</h4>
                          <p className="text-gray-400 text-xs mt-1">{notification.message}</p>
                          <p className="text-gray-500 text-xs mt-2">{notification.time}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
              
              {/* Wallet dropdown */}
              <div className="relative ml-3">
                <div>
                  <motion.button
                    className="flex items-center space-x-2 p-2 rounded-full text-gray-300 hover:text-white focus:outline-none"
                    onClick={() => setShowWalletDropdown(!showWalletDropdown)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <WalletIcon className="h-5 w-5" />
                    {isConnected && walletData && (
                      <span className="text-sm">{truncateAddress(walletData.address)}</span>
                    )}
                    <ChevronDownIcon className="h-4 w-4" />
                  </motion.button>
                </div>
                
                {/* Wallet Dropdown */}
                {showWalletDropdown && (
                  <motion.div 
                    className="absolute right-0 mt-2 w-64 bg-gray-900 bg-opacity-95 backdrop-filter backdrop-blur-lg rounded-lg shadow-xl border border-gray-800 z-50"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {isConnected && walletData ? (
                      <div className="p-4 space-y-3">
                        <div className="flex items-center space-x-2">
                          <CheckCircleIcon className="h-5 w-5 text-green-400" />
                          <span className="text-sm text-green-400">Connected</span>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Wallet Address</p>
                          <p className="text-sm font-mono">{truncateAddress(walletData.address)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Wallet Type</p>
                          <p className="text-sm">{walletData.walletType}</p>
                        </div>
                        <button
                          onClick={handleDisconnect}
                          className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
                        >
                          Disconnect
                        </button>
                      </div>
                    ) : (
                      <div className="p-4 space-y-3">
                        <div className="flex items-center space-x-2 text-yellow-400 mb-2">
                          <ExclamationTriangleIcon className="h-5 w-5" />
                          <span className="text-sm">Wallet Not Connected</span>
                        </div>
                        <p className="text-xs text-gray-400 mb-3">Please connect your wallet to continue</p>
                        <Link
                          href="/signin"
                          className="block w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white text-center text-sm rounded-lg transition-colors"
                        >
                          Connect Wallet
                        </Link>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
              
              {/* User profile icon (preserved for backward compatibility) */}
              <div className="relative ml-2">
                <div>
                  <UserCircleIcon className="h-8 w-8 text-gray-300 hover:text-white cursor-pointer" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        <div className="md:hidden border-b border-gray-800">
          <div className="px-2 py-3 space-y-1 sm:px-3">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors flex items-center space-x-2 ${
                    isActive
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <IconComponent className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="surreal-container flex-grow">
        <div className="background-layer">
          <motion.div
            className="animated-gradient"
            animate={{
              background: [
                'linear-gradient(45deg, rgba(30, 10, 60, 0.7) 0%, rgba(10, 40, 95, 0.7) 100%)',
                'linear-gradient(135deg, rgba(40, 10, 80, 0.7) 0%, rgba(10, 80, 100, 0.7) 100%)',
              ],
            }}
            transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
          />
          <div className="noise-overlay"></div>
        </div>
        
        <div className="content-wrapper max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
}
