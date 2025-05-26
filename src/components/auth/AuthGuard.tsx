'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import useMultiChainWallet from '@/hooks/useMultiChainWallet';

interface AuthGuardProps {
  children: ReactNode;
  redirectTo?: string;
}

/**
 * AuthGuard component to protect routes that require wallet authentication
 * 
 * @param children - The page content to render when authenticated
 * @param redirectTo - The route to redirect to when not authenticated (defaults to /signin)
 */
export default function AuthGuard({ 
  children, 
  redirectTo = '/signin' 
}: AuthGuardProps) {
  const router = useRouter();
  const { isConnected } = useMultiChainWallet();
  
  useEffect(() => {
    if (!isConnected) {
      router.push(redirectTo);
    }
  }, [isConnected, redirectTo, router]);
  
  // If not connected, don't render the children to avoid flashes of protected content
  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-300">Checking authentication...</p>
        </div>
      </div>
    );
  }
  
  // Connected, render the protected content
  return <>{children}</>;
}