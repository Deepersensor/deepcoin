'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { CheckCircleIcon, ArrowsRightLeftIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import useMultiChainWallet from '@/hooks/useMultiChainWallet';
import { WalletType } from '@/lib/utils/wallet';

interface MultiChainWalletConnectionProps {
  onConnect?: () => void;
  redirectTo?: string;
  variant?: 'default' | 'minimal';
  className?: string;
  defaultChain?: 'aptos' | 'evm';
}

export default function MultiChainWalletConnection({ 
  onConnect, 
  redirectTo, 
  variant = 'default',
  className = '',
  defaultChain = 'aptos'
}: MultiChainWalletConnectionProps) {
  const [activeTab, setActiveTab] = useState<'aptos' | 'evm'>(defaultChain);
  const [showWalletList, setShowWalletList] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const router = useRouter();
  
  const { 
    connect, 
    disconnect, 
    isConnected,
    walletData, 
    aptosWallets, 
    evmConnectors,
    saveWalletData,
    connectError,
    isConnecting: isWalletConnecting
  } = useMultiChainWallet();

  // Handle error messages from wallet connection
  useEffect(() => {
    if (connectError) {
      setConnectionError(connectError.message || 'Failed to connect wallet');
    }
  }, [connectError]);

  // Reset errors when connection status changes
  useEffect(() => {
    if (isConnected && connectionError) {
      setConnectionError(null);
    }
  }, [isConnected, connectionError]);
  
  // Save wallet data when connected
  useEffect(() => {
    if (isConnected && walletData) {
      saveWalletData();
    }
  }, [isConnected, walletData, saveWalletData]);

  const handleConnect = async (walletNameOrConnector: string) => {
    try {
      setIsConnecting(true);
      setConnectionError(null);
      
      const success = await connect(walletNameOrConnector);
      
      if (success) {
        setShowWalletList(false);
        
        if (onConnect) {
          onConnect();
        }
        
        if (redirectTo) {
          router.push(redirectTo);
        }
      }
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      setConnectionError(error.message || 'Failed to connect. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };
  
  return (
    <div className={`w-full ${className}`}>
      {!isConnected ? (
        <div className="space-y-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="wallet-button w-full flex items-center justify-center gap-2"
            onClick={() => setShowWalletList(!showWalletList)}
            disabled={isConnecting || isWalletConnecting}
          >
            {(isConnecting || isWalletConnecting) ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Connecting...
              </>
            ) : (
              <>
                <ArrowsRightLeftIcon className="h-5 w-5" />
                Connect Wallet
              </>
            )}
          </motion.button>
          
          {connectionError && (
            <motion.div 
              className="text-red-400 text-sm flex items-center gap-2 p-3 bg-red-900 bg-opacity-20 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <ExclamationCircleIcon className="h-5 w-5" />
              {connectionError}
            </motion.div>
          )}
          
          <AnimatePresence>
            {showWalletList && (
              <motion.div 
                className="wallet-card"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {/* Tabs for different wallet types */}
                <div className="flex mb-4 border-b border-gray-700">
                  <button
                    className={`flex-1 py-2 text-center text-sm font-medium ${
                      activeTab === 'aptos' 
                        ? 'text-cyan-400 border-b-2 border-cyan-400' 
                        : 'text-gray-400 hover:text-gray-300'
                    }`}
                    onClick={() => setActiveTab('aptos')}
                  >
                    Aptos Wallets
                  </button>
                  <button
                    className={`flex-1 py-2 text-center text-sm font-medium ${
                      activeTab === 'evm' 
                        ? 'text-purple-400 border-b-2 border-purple-400' 
                        : 'text-gray-400 hover:text-gray-300'
                    }`}
                    onClick={() => setActiveTab('evm')}
                  >
                    EVM Wallets
                  </button>
                </div>
                
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {activeTab === 'aptos' && aptosWallets?.map((walletAdapter) => (
                    <motion.button
                      key={walletAdapter.name}
                      className="w-full flex items-center justify-between p-3 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors"
                      onClick={() => handleConnect(walletAdapter.name)}
                      whileHover={{ scale: 1.01, backgroundColor: 'rgba(75, 85, 99, 0.8)' }}
                      whileTap={{ scale: 0.99 }}
                      disabled={isConnecting || isWalletConnecting}
                    >
                      <span className="font-medium text-sm">{walletAdapter.name}</span>
                      {walletAdapter.icon && (
                        <img 
                          src={walletAdapter.icon} 
                          alt={`${walletAdapter.name} icon`} 
                          className="h-6 w-6"
                        />
                      )}
                    </motion.button>
                  ))}
                  
                  {activeTab === 'evm' && evmConnectors?.map((connector) => (
                    <motion.button
                      key={connector.uid}
                      className="w-full flex items-center justify-between p-3 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors"
                      onClick={() => handleConnect(connector.name)}
                      whileHover={{ scale: 1.01, backgroundColor: 'rgba(75, 85, 99, 0.8)' }}
                      whileTap={{ scale: 0.99 }}
                      disabled={isConnecting || isWalletConnecting}
                    >
                      <span className="font-medium text-sm">{connector.name}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="wallet-card">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm text-gray-400">Connected Wallet</span>
                <p className="font-medium flex items-center gap-2">
                  {walletData?.walletName}
                  <CheckCircleIcon className="h-4 w-4 text-green-400" />
                </p>
              </div>
              <div className="px-3 py-1 bg-green-900 bg-opacity-60 rounded-full text-green-400 text-xs flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-400"></span>
                Connected
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-700">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-2 text-red-400 hover:text-red-300 font-medium text-sm flex items-center justify-center"
                onClick={handleDisconnect}
              >
                Disconnect Wallet
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
