import { useState, useCallback } from 'react';
import { ChainId } from '@debridge-finance/dln-client';
import {
  createCrossChainOrder,
  trackOrderStatus,
  processAIAgentPayment,
  distributeCrossChainRoyalties,
  getTransferFees,
  getSupportedTokens,
  type CrossChainTransferParams,
  type AIAgentPaymentParams,
  SUPPORTED_CHAINS,
} from '@/utils/debridge';

export function useDebridge() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = useCallback((error: any) => {
    const message = error?.message || 'An unknown error occurred';
    setError(message);
    console.error('deBridge operation failed:', error);
  }, []);

  const crossChainTransfer = useCallback(async (params: CrossChainTransferParams) => {
    try {
      setLoading(true);
      setError(null);
      
      const order = await createCrossChainOrder(params);
      return order;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const payAIAgent = useCallback(async (params: AIAgentPaymentParams) => {
    try {
      setLoading(true);
      setError(null);
      
      const payment = await processAIAgentPayment(params);
      return payment;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const distributeRoyalties = useCallback(async (
    royalties: Array<{
      recipient: string;
      amount: string;
      chainId: ChainId;
      tokenAddress: string;
    }>,
    sourceChainId: ChainId,
    sourceTokenAddress: string,
    senderAddress: string
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      const orders = await distributeCrossChainRoyalties(
        royalties,
        sourceChainId,
        sourceTokenAddress,
        senderAddress
      );
      return orders;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const getOrderStatus = useCallback(async (orderId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const status = await trackOrderStatus(orderId);
      return status;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const estimateFees = useCallback(async (params: CrossChainTransferParams) => {
    try {
      setLoading(true);
      setError(null);
      
      const fees = await getTransferFees(params);
      return fees;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const getSupportedChainTokens = useCallback(async (chainId: ChainId) => {
    try {
      setLoading(true);
      setError(null);
      
      const tokens = await getSupportedTokens(chainId);
      return tokens;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  return {
    // State
    loading,
    error,
    
    // Actions
    crossChainTransfer,
    payAIAgent,
    distributeRoyalties,
    getOrderStatus,
    estimateFees,
    getSupportedChainTokens,
    
    // Constants
    SUPPORTED_CHAINS,
    
    // Utils
    clearError: () => setError(null),
  };
}
