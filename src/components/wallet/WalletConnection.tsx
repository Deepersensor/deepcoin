'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MultiChainWalletConnection from './MultiChainWalletConnection';
import useMultiChainWallet from '@/hooks/useMultiChainWallet';

interface WalletConnectionProps {
  redirectTo?: string;
  className?: string;
  onConnect?: () => void;
}

export default function WalletConnection({ 
  redirectTo = '/dashboard', 
  className = '', 
  onConnect 
}: WalletConnectionProps) {
  const router = useRouter();
  const { isConnected } = useMultiChainWallet();
  
  // Auto-redirect if already connected
  useEffect(() => {
    if (isConnected && redirectTo) {
      console.log('User already connected, redirecting to:', redirectTo);
      router.push(redirectTo);
    }
  }, [isConnected, redirectTo, router]);

  const handleOnConnect = () => {
    if (onConnect) {
      onConnect();
    }
    // Note: The redirection happens in MultiChainWalletConnection
  };

  return (
    <MultiChainWalletConnection 
      redirectTo={redirectTo} 
      className={className}
      onConnect={handleOnConnect}
    />
  );
}
