'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { BellIcon, UserCircleIcon, HomeIcon, ChartBarIcon, KeyIcon, CurrencyDollarIcon, WalletIcon } from '@heroicons/react/24/outline';
import { truncateAddress } from '@/lib/utils/address';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showWalletDropdown, setShowWalletDropdown] = useState(false);
  const { account, wallet, disconnect } = useWallet();
  
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
                      >
                        <div className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                          ${isActive 
                            ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white' 
                            : 'text-gray-300 hover:bg-gray-800 hover:bg-opacity-50 hover:text-white'
                          }`}>
                          <IconComponent className="h-5 w-5 mr-1.5" />
                          {item.name}
                        </div>
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
                  className="p-2 rounded-full text-gray-300 hover:text-white focus:outline-none"
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    if (showWalletDropdown) setShowWalletDropdown(false);
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" />
                  
                  {/* Notification indicator */}
                  <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-gray-900"></span>
                </motion.button>
                
                {/* Notifications dropdown */}
                {showNotifications && (
                  <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg py-1 bg-gray-900 bg-opacity-90 backdrop-filter backdrop-blur-lg border border-gray-700 focus:outline-none z-50">
                    <div className="px-4 py-2 border-b border-gray-800">
                      <h3 className="text-sm font-medium text-gray-200">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div 
                          key={notification.id}
                          className="px-4 py-3 hover:bg-gray-800 transition-colors border-b border-gray-800 last:border-0"
                        >
                          <div className="flex justify-between items-start">
                            <p className="text-sm font-medium text-white">{notification.title}</p>
                            <p className="text-xs text-gray-400">{notification.time}</p>
                          </div>
                          <p className="text-xs text-gray-300 mt-1">{notification.message}</p>
                        </div>
                      ))}
                    </div>
                    <div className="px-4 py-2 border-t border-gray-800">
                      <a href="#" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
                        View all notifications
                      </a>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Wallet dropdown */}
              <div className="relative ml-3">
                <div>
                  <motion.button 
                    className="flex items-center space-x-2 p-2 rounded-full text-gray-300 hover:text-white focus:outline-none"
                    onClick={() => {
                      setShowWalletDropdown(!showWalletDropdown);
                      if (showNotifications) setShowNotifications(false);
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="sr-only">Open wallet menu</span>
                    <WalletIcon className="h-6 w-6" />
                    {account && (
                      <span className="hidden md:inline text-sm font-medium">
                        {truncateAddress(account.address)}
                      </span>
                    )}
                  </motion.button>
                </div>
                
                {/* Wallet dropdown */}
                {showWalletDropdown && (
                  <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg py-1 bg-gray-900 bg-opacity-90 backdrop-filter backdrop-blur-lg border border-gray-700 focus:outline-none z-50">
                    <div className="px-4 py-3 border-b border-gray-800">
                      <h3 className="text-sm font-medium text-gray-200">Your Wallet</h3>
                      <div className="mt-2">
                        <div className="flex items-center">
                          <span className="bg-green-900 p-1 rounded-full mr-2">
                            <WalletIcon className="h-4 w-4 text-green-400" />
                          </span>
                          <span className="text-sm font-medium">{wallet?.name}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="px-4 py-3">
                      <div className="text-xs text-gray-400 mb-1">Wallet Address</div>
                      <div className="font-mono text-sm break-all">{account?.address}</div>
                    </div>
                    
                    <div className="px-4 py-2 border-t border-gray-800">
                      <button 
                        onClick={handleDisconnect}
                        className="w-full text-left text-sm text-red-400 hover:text-red-300 transition-colors"
                      >
                        Disconnect Wallet
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* User profile icon (preserved for backward compatibility) */}
              <div className="relative ml-2">
                <div>
                  <button className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none">
                    <span className="sr-only">Open user menu</span>
                    <UserCircleIcon className="h-8 w-8 rounded-full text-gray-300 hover:text-white" />
                  </button>
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
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium
                    ${isActive 
                      ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white' 
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                >
                  <IconComponent className="h-5 w-5 mr-1.5" />
                  {item.name}
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
        
        <div className="content-wrapper max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </div>
    </div>
  );
}
