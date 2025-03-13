import { databases, appwriteConfig } from "@/lib/appwrite/client";
import { ID, Query } from "appwrite";

/**
 * Different wallet types supported by the application
 */
export enum WalletType {
  APTOS = 'aptos',
  EVM = 'evm',
}

/**
 * Common interface for wallet data regardless of blockchain
 */
export interface WalletData {
  address: string;
  walletType: WalletType;
  walletName: string;
}

/**
 * Saves wallet connection data to Appwrite database
 */
export const saveWalletConnection = async (walletData: WalletData): Promise<boolean> => {
  try {
    // Check if wallet address already exists
    const existingWallets = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.walletCollectionId,
      [Query.equal('address', walletData.address)]
    );

    if (existingWallets.total === 0) {
      // Create new wallet document
      await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.walletCollectionId,
        ID.unique(),
        {
          address: walletData.address,
          walletType: walletData.walletType,
          name: walletData.walletName,
          lastConnected: new Date().toISOString()
        }
      );
    } else {
      // Update last connected timestamp
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.walletCollectionId,
        existingWallets.documents[0].$id,
        {
          lastConnected: new Date().toISOString(),
          name: walletData.walletName // Update name in case it changed
        }
      );
    }

    return true;
  } catch (error) {
    console.error('Failed to save wallet connection:', error);
    return false;
  }
};

/**
 * Validates an EVM wallet address
 */
export const isValidEvmAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

/**
 * Validates an Aptos wallet address
 */
export const isValidAptosAddress = (address: string): boolean => {
  // Aptos addresses should be 0x followed by 64 hex characters
  return /^0x[a-fA-F0-9]{64}$/.test(address);
};

/**
 * Truncates any blockchain address for display
 * Works for both Aptos and EVM addresses
 */
export const truncateWalletAddress = (address: string, startChars: number = 6, endChars: number = 4): string => {
  if (!address) return '';
  
  const addressStr = String(address);
  
  if (addressStr.length <= startChars + endChars) return addressStr;
  
  const start = addressStr.slice(0, startChars);
  const end = addressStr.slice(-endChars);
  
  return `${start}...${end}`;
};

/**
 * Determine wallet type from address format
 */
export const getWalletTypeFromAddress = (address: string): WalletType | null => {
  if (isValidEvmAddress(address)) return WalletType.EVM;
  if (isValidAptosAddress(address)) return WalletType.APTOS;
  return null;
};
