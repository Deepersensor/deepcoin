import { useState, useCallback, useRef } from 'react';
import {
  pmSupportedTokens,
  pmSponsorUserOp,
  pmEntrypoints,
  createMinimalUserOp,
  type UserOperation,
  type PaymasterContext,
  type SupportedTokensResponse
} from '@/utils/neroPaymaster';

interface UseNeroPaymasterOptions {
  apiKey?: string;
  cacheTokens?: boolean;
  cacheDuration?: number; // in milliseconds
}

export function useNeroPaymaster(options: UseNeroPaymasterOptions = {}) {
  const { apiKey, cacheTokens = true, cacheDuration = 5 * 60 * 1000 } = options; // 5 minutes default
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Cache for supported tokens
  const tokenCacheRef = useRef<{
    data: SupportedTokensResponse | null;
    timestamp: number;
    walletAddress: string;
  }>({ data: null, timestamp: 0, walletAddress: '' });

  const handleError = useCallback((error: any) => {
    const message = error?.message || 'Unknown paymaster error occurred';
    setError(message);
    console.error('NERO Paymaster operation failed:', error);
  }, []);

  const supportedTokens = useCallback(async (
    walletAddress: string,
    forceRefresh = false
  ): Promise<SupportedTokensResponse> => {
    if (!apiKey) {
      throw new Error('API key is required for paymaster operations');
    }

    // Check cache first
    const now = Date.now();
    const cache = tokenCacheRef.current;
    
    if (
      cacheTokens &&
      !forceRefresh &&
      cache.data &&
      cache.walletAddress === walletAddress &&
      (now - cache.timestamp) < cacheDuration
    ) {
      return cache.data;
    }

    setLoading(true);
    setError(null);
    
    try {
      const userOp = createMinimalUserOp(walletAddress);
      const result = await pmSupportedTokens(userOp, apiKey);
      
      // Update cache
      if (cacheTokens) {
        tokenCacheRef.current = {
          data: result,
          timestamp: now,
          walletAddress
        };
      }
      
      return result;
    } catch (e: any) {
      handleError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [apiKey, cacheTokens, cacheDuration, handleError]);

  const sponsorUserOp = useCallback(async (
    userOperation: UserOperation,
    context: PaymasterContext,
    entryPoint?: string
  ): Promise<UserOperation> => {
    if (!apiKey) {
      throw new Error('API key is required for paymaster operations');
    }

    setLoading(true);
    setError(null);
    
    try {
      return await pmSponsorUserOp(userOperation, apiKey, entryPoint, context);
    } catch (e: any) {
      handleError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [apiKey, handleError]);

  const entrypoints = useCallback(async (): Promise<string[]> => {
    setLoading(true);
    setError(null);
    
    try {
      return await pmEntrypoints();
    } catch (e: any) {
      handleError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // Helper to check if free gas is available
  const checkFreeGasAvailable = useCallback(async (walletAddress: string): Promise<boolean> => {
    try {
      const tokens = await supportedTokens(walletAddress);
      return tokens.freeGas;
    } catch {
      return false;
    }
  }, [supportedTokens]);

  // Helper to get token price for gas calculation
  const getTokenGasPrice = useCallback(async (
    walletAddress: string,
    tokenAddress: string
  ): Promise<number | null> => {
    try {
      const tokens = await supportedTokens(walletAddress);
      const token = tokens.tokens.find(t => t.token.toLowerCase() === tokenAddress.toLowerCase());
      return token?.price || null;
    } catch {
      return null;
    }
  }, [supportedTokens]);

  return {
    // State
    loading,
    error,
    
    // Core methods
    supportedTokens,
    sponsorUserOp,
    entrypoints,
    
    // Helper methods
    checkFreeGasAvailable,
    getTokenGasPrice,
    createMinimalUserOp,
    
    // Cache management
    clearTokenCache: () => {
      tokenCacheRef.current = { data: null, timestamp: 0, walletAddress: '' };
    },
    
    // Error management
    clearError: () => setError(null),
  };
}
