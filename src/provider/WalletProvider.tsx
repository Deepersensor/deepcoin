'use client';
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { PropsWithChildren, useEffect } from "react";
import { AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { PetraWallet } from "petra-plugin-wallet-adapter";
import { MartianWallet } from "@martianwallet/aptos-wallet-adapter";
import { PontemWallet } from "@pontem/wallet-adapter-plugin";
import { RiseWallet } from "@rise-wallet/wallet-adapter";
import { account, databases } from "@/lib/appwrite/client";
import { ID } from "appwrite";

// ---- New Wagmi Imports & Configuration ----
import { WagmiConfig, createClient, configureChains, chain } from 'wagmi';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { publicProvider } from 'wagmi/providers/public';

const { chains, provider, webSocketProvider } = configureChains(
  [chain.goerli], // using Goerli as testnet alternative
  [publicProvider()]
);

const wagmiClient = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new WalletConnectConnector({ chains, options: { qrcode: true } }),
    new CoinbaseWalletConnector({ chains, options: { appName: 'Deepcoin' } }),
  ],
  provider,
  webSocketProvider,
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
  
  const config = new AptosConfig({
    network: Network.TESTNET,
    fullnode: 'https://aptos.testnet.bardock.movementlabs.xyz/v1',
    faucet: 'https://faucet.testnet.bardock.movementnetwork.xyz/'
  });

  return (
    <WagmiConfig client={wagmiClient}>
      <AptosWalletAdapterProvider
        plugins={wallets}
        autoConnect={true}
        dappConfig={config}
        onError={(error) => {
          console.log("error", error);
        }}
      >
        {children}
      </AptosWalletAdapterProvider>
    </WagmiConfig>
  );
};

export default WalletProvider;