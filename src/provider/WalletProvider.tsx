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
  );
};

export default WalletProvider;