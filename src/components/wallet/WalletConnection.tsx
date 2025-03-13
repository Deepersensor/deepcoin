'use client';

import { useState } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { truncateAddress } from '@/lib/utils/address';

interface WalletConnectionProps {
  onConnect?: () => void;
  redirectTo?: string;
}

export default function WalletConnection({ onConnect, redirectTo }: WalletConnectionProps) {
  const { connect, account, connected, wallet, wallets, disconnect } = useWallet();
  const [showWalletList, setShowWalletList] = useState(false);
  const router = useRouter();

  const handleConnect = async (walletName: string) => {
    try {
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
    <div className="w-full">
      {!connected ? (
        <div className="space-y-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="cosmic-button w-full"
            onClick={() => setShowWalletList(!showWalletList)}
          >
            Connect Wallet
          </motion.button>
          
          {showWalletList && (
            <motion.div 
              className="bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-lg p-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-sm font-medium text-gray-300 mb-3">Select your wallet</h3>
              <div className="space-y-2">
                {wallets?.map((walletAdapter) => (
                  <motion.button
                    key={walletAdapter.name}
                    className="w-full flex items-center justify-between p-3 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors"
                    onClick={() => handleConnect(walletAdapter.name)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
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
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm text-gray-400">Connected Wallet</span>
                <p className="font-medium">{wallet?.name}</p>
              </div>
              <div className="px-3 py-1 bg-green-900 bg-opacity-60 rounded-full text-green-400 text-xs">
                Connected
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-700">
              <span className="text-sm text-gray-400">Address</span>
              <p className="font-mono text-sm break-all">
                {account ? truncateAddress(account.address) : ''}
              </p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="cosmic-button w-full bg-red-600 hover:bg-red-700"
            onClick={handleDisconnect}
          >
            Disconnect Wallet
          </motion.button>
        </div>
      )}
    </div>
  );
}
