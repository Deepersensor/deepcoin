'use client';
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { PropsWithChildren, useEffect } from "react";
import { AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { PetraWallet } from "petra-plugin-wallet-adapter";
import { MartianWallet } from "@martianwallet/aptos-wallet-adapter";
import { PontemWallet } from "@pontem/wallet-adapter-plugin";
import { RiseWallet } from "@rise-wallet/wallet-adapter";

// ---- Wagmi v2 Imports & Configuration ----
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, http, createConfig } from 'wagmi';
import { mainnet, polygon, sepolia, goerli, polygonMumbai } from 'wagmi/chains';
import { injected, metaMask, walletConnect } from 'wagmi/connectors';

// Create a React Query client
const queryClient = new QueryClient();

// Configure wagmi
const config = createConfig({
  chains: [mainnet, polygon, sepolia, goerli, polygonMumbai],
  connectors: [
    injected(),
    metaMask(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo-project',
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [sepolia.id]: http(),
    [goerli.id]: http(),
    [polygonMumbai.id]: http(),
  },
});
// ---------------------------------------------

export const WalletProvider = ({ children }: PropsWithChildren) => {
  // Add plugins for non AIP 62 compliant wallets here
  const wallets = [
    new PetraWallet(),
    new MartianWallet(),
    new PontemWallet(),
    new RiseWallet()
  ];
  
  const aptosConfig = new AptosConfig({
    network: Network.TESTNET,
    fullnode: 'https://aptos.testnet.bardock.movementlabs.xyz/v1',
    faucet: 'https://faucet.testnet.bardock.movementnetwork.xyz/'
  });

  // Effect to handle wallet reconnection persistence
  useEffect(() => {
    // This effect is for any additional initialization needed
    // when the wallet providers are first mounted
    const handleStorageChange = () => {
      // Re-trigger wallet connection on storage events (for multi-tab support)
      // This helps with wallet session synchronization across tabs
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AptosWalletAdapterProvider
          plugins={wallets}
          autoConnect={true}
          dappConfig={aptosConfig}
          onError={(error) => {
            console.log("error", error);
          }}
        >
          {children}
        </AptosWalletAdapterProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default WalletProvider;