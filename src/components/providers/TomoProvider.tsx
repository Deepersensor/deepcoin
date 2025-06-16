'use client';

import { TomoContextProvider } from '@tomo-inc/tomo-web-sdk';
import '@tomo-inc/tomo-web-sdk/style.css';

interface TomoProviderProps {
  children: React.ReactNode;
}

export default function TomoProvider({ children }: TomoProviderProps) {
  return (
    <TomoContextProvider
      theme="light"
      chainTypes={['solana','tron','movement']}
      clientId="your client Id" // Replace with your actual client ID from Tomo Developer Dashboard
    >
      {children}
    </TomoContextProvider>
  );
}
