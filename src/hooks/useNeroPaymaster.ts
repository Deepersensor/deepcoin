import { useState, useCallback } from 'react';
import { pmSupportedTokens, pmSponsorUserOp, pmEntrypoints } from '@/utils/neroPaymaster';

export function useNeroPaymaster() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supportedTokens = useCallback(async (userOp: any, apiKey: string, entryPoint: string) => {
    setLoading(true);
    setError(null);
    try {
      return await pmSupportedTokens(userOp, apiKey, entryPoint);
    } catch (e: any) {
      setError(e.message || 'Failed to fetch supported tokens');
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const sponsorUserOp = useCallback(async (userOp: any, apiKey: string, entryPoint: string, context: any) => {
    setLoading(true);
    setError(null);
    try {
      return await pmSponsorUserOp(userOp, apiKey, entryPoint, context);
    } catch (e: any) {
      setError(e.message || 'Failed to sponsor user operation');
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const entrypoints = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      return await pmEntrypoints();
    } catch (e: any) {
      setError(e.message || 'Failed to fetch entrypoints');
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    supportedTokens,
    sponsorUserOp,
    entrypoints,
    clearError: () => setError(null),
  };
}
