'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { truncateAddress } from '@/lib/utils/address';
import { CheckCircleIcon, ArrowsRightLeftIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface WalletConnectionProps {
  onConnect?: () => void;
  redirectTo?: string;
  variant?: 'default' | 'minimal';
  className?: string;
}

export default function WalletConnection({ 
  onConnect, 
  redirectTo, 
  variant = 'default',
  className = ''
}: WalletConnectionProps) {
  const { connect, account, connected, wallet, wallets, disconnect } = useWallet();
  const [showWalletList, setShowWalletList] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (connected && connectionError) {
      setConnectionError(null);
    }
  }, [connected, connectionError]);

  const handleConnect = async (walletName: string) => {
    try {
      setIsConnecting(true);
      setConnectionError(null);
      await connect(walletName);
      setShowWalletList(false);
      
      if (onConnect) {
        onConnect();
      }
      
      if (redirectTo) {
        router.push(redirectTo);
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setConnectionError('Failed to connect. Please try again.');
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
      {!connected ? (
        <div className="space-y-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="wallet-button w-full flex items-center justify-center gap-2"
            onClick={() => setShowWalletList(!showWalletList)}
            disabled={isConnecting}
          >
            {isConnecting ? (
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
                <h3 className="text-sm font-medium text-gray-300 mb-3">Select your wallet</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {wallets?.map((walletAdapter) => (
                    <motion.button
                      key={walletAdapter.name}
                      className="w-full flex items-center justify-between p-3 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors"
                      onClick={() => handleConnect(walletAdapter.name)}
                      whileHover={{ scale: 1.01, backgroundColor: 'rgba(75, 85, 99, 0.8)' }}
                      whileTap={{ scale: 0.99 }}
                      disabled={isConnecting}
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
                  {wallet?.name}
                  <CheckCircleIcon className="h-4 w-4 text-green-400" />
                </p>
              </div>
              <div className="px-3 py-1 bg-green-900 bg-opacity-60 rounded-full text-green-400 text-xs">
                Connected
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-700">
              <span className="text-sm text-gray-400">Address</span>
              <p className="font-mono text-sm break-all bg-gray-800 p-2 rounded-md mt-1">
                {account ? truncateAddress(String(account.address)) : ''}
              </p>
            </div>
            
            {variant === 'default' && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-4 py-2.5 px-4 bg-red-600 hover:bg-red-700 transition-colors rounded-lg text-white font-medium flex items-center justify-center gap-2"
                onClick={handleDisconnect}
              >
                Disconnect Wallet
              </motion.button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
