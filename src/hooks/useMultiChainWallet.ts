'use client';

import { useWallet as useAptosWallet } from '@aptos-labs/wallet-adapter-react';
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from 'wagmi';
import { useCallback, useEffect, useMemo } from 'react';
import { WalletType, saveWalletConnection, truncateWalletAddress } from '@/lib/utils/wallet';

export const useMultiChainWallet = () => {
  // Aptos wallet hooks
  const { 
    account: aptosAccount,
    connected: aptosConnected,
    wallet: aptosWallet,
    wallets: aptosWallets,
    connect: aptosConnect,
    disconnect: aptosDisconnect
  } = useAptosWallet();
  
  // EVM wallet hooks from wagmi v2
  const { address: evmAddress, isConnected: evmConnected, chainId } = useAccount();
  const { connectors, connect: wagmiConnect, error: connectError, isPending: isEvmConnecting } = useConnect();
  const { disconnect: wagmiDisconnect } = useDisconnect();
  const chainID = useChainId();
  const { switchChain } = useSwitchChain();
  
  // Determine if any wallet is connected
  const isConnected = useMemo(() => aptosConnected || evmConnected, [aptosConnected, evmConnected]);
  
  // Current wallet data
  const walletData = useMemo(() => {
    if (aptosConnected && aptosWallet && aptosAccount) {
      return {
        address: String(aptosAccount.address),
        walletName: aptosWallet.name,
        walletType: WalletType.APTOS,
        displayAddress: truncateWalletAddress(String(aptosAccount.address))
      };
    } 
    
    if (evmConnected && evmAddress) {
      return {
        address: evmAddress,
        walletName: `EVM Wallet (Chain ID: ${chainID})`,
        walletType: WalletType.EVM,
        displayAddress: truncateWalletAddress(evmAddress)
      };
    }
    
    return null;
  }, [aptosConnected, aptosWallet, aptosAccount, evmConnected, evmAddress, chainID]);
  
  // Effect to save wallet data when connected
  useEffect(() => {
    if (isConnected && walletData) {
      saveWalletData();
    }
  }, [isConnected, walletData?.address]);

  // Connect to wallet and store data
  const connect = useCallback(async (walletNameOrConnector: string) => {
    try {
      // Check if it's an EVM connector
      const evmConnector = connectors.find(c => c.name.toLowerCase() === walletNameOrConnector.toLowerCase());
      
      if (evmConnector) {
        wagmiConnect({ connector: evmConnector });
        // For EVM wallets with wagmi, the connection is handled asynchronously
        // We return true immediately as the UI will update when connection state changes
        return true;
      } else {
        // Try Aptos wallet
        await aptosConnect(walletNameOrConnector);
        // For Aptos wallets, we can check the connection immediately
        return aptosConnected;
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      return false;
    }
  }, [connectors, wagmiConnect, aptosConnect, aptosConnected]);
  
  // Disconnect current wallet
  const disconnect = useCallback(async () => {
    if (aptosConnected) {
      await aptosDisconnect();
    }
    
    if (evmConnected) {
      wagmiDisconnect();
    }
  }, [aptosConnected, aptosDisconnect, evmConnected, wagmiDisconnect]);
  
  // Save wallet data when connected
  const saveWalletData = useCallback(async () => {
    if (walletData) {
      try {
        await saveWalletConnection({
          address: walletData.address,
          walletName: walletData.walletName,
          walletType: walletData.walletType
        });
        return true;
      } catch (error) {
        console.error('Error saving wallet data:', error);
        return false;
      }
    }
    return false;
  }, [walletData]);

  // Add an auto-save effect when the wallet data changes
  useEffect(() => {
    const handleWalletConnection = async () => {
      if (isConnected && walletData) {
        console.log('Wallet connected:', walletData.walletType, walletData.address);
        await saveWalletData();
      }
    };
    
    handleWalletConnection();
  }, [isConnected, walletData, saveWalletData]);
  
  return {
    connect,
    disconnect,
    isConnected,
    walletData,
    saveWalletData,
    // Aptos specifics
    aptosAccount,
    aptosWallet,
    aptosWallets,
    aptosConnected,
    // EVM specifics
    evmAddress,
    evmConnected,
    evmConnectors: connectors,
    currentChainId: chainID,
    switchNetwork: switchChain,
    // Connection status
    isConnecting: isEvmConnecting,
    connectError
  };
};

export default useMultiChainWallet;
