import axios from 'axios';

const NERO_API_ENDPOINT = process.env.NEXT_PUBLIC_NERO_API_ENDPOINT as string;

export interface UserOperation {
  sender: string;
  nonce: string;
  initCode: string;
  callData: string;
  callGasLimit: string;
  verificationGasLimit: string;
  preVerificationGas: string;
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
  paymasterAndData: string;
  signature: string;
}

export interface PaymasterContext {
  type: 0 | 1 | 2; // 0: sponsored, 1: prepay, 2: postpay
  token?: string; // Required for types 1 and 2
}

export interface SupportedTokensResponse {
  freeGas: boolean;
  native: {
    gas: string;
    price: number;
    decimals: number;
    symbol: string;
  };
  tokens: Array<{
    type: 'system' | 'custom';
    token: string;
    symbol: string;
    decimals: number;
    price: number;
  }>;
}

export async function pmSupportedTokens(
  userOperation: Partial<UserOperation>,
  apiKey: string,
  entryPoint: string = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789'
): Promise<SupportedTokensResponse> {
  const payload = {
    jsonrpc: "2.0",
    id: 1,
    method: "pm_supported_tokens",
    params: [userOperation, apiKey, entryPoint],
  };

  try {
    const { data } = await axios.post(NERO_API_ENDPOINT, payload);
    
    if (data.error) {
      throw new Error(`Paymaster API Error: ${data.error.message} (Code: ${data.error.code})`);
    }
    
    return data.result;
  } catch (error: any) {
    if (error.response?.data?.error) {
      throw new Error(`Paymaster API Error: ${error.response.data.error.message}`);
    }
    throw error;
  }
}

export async function pmSponsorUserOp(
  userOperation: UserOperation,
  apiKey: string,
  entryPoint: string = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
  context: PaymasterContext
): Promise<UserOperation> {
  const payload = {
    jsonrpc: "2.0",
    id: 1,
    method: "pm_sponsor_userop",
    params: [userOperation, apiKey, entryPoint, context],
  };

  try {
    const { data } = await axios.post(NERO_API_ENDPOINT, payload);
    
    if (data.error) {
      throw new Error(`Paymaster API Error: ${data.error.message} (Code: ${data.error.code})`);
    }
    
    return data.result;
  } catch (error: any) {
    if (error.response?.data?.error) {
      throw new Error(`Paymaster API Error: ${error.response.data.error.message}`);
    }
    throw error;
  }
}

export async function pmEntrypoints(): Promise<string[]> {
  const payload = {
    jsonrpc: "2.0",
    id: 1,
    method: "pm_entrypoints",
    params: ["entryPoint"],
  };

  try {
    const { data } = await axios.post(NERO_API_ENDPOINT, payload);
    
    if (data.error) {
      throw new Error(`Paymaster API Error: ${data.error.message} (Code: ${data.error.code})`);
    }
    
    return data.result;
  } catch (error: any) {
    if (error.response?.data?.error) {
      throw new Error(`Paymaster API Error: ${error.response.data.error.message}`);
    }
    throw error;
  }
}

// Helper function to create minimal UserOperation for token queries
export function createMinimalUserOp(sender: string): Partial<UserOperation> {
  return {
    sender,
    nonce: "0x0",
    initCode: "0x",
    callData: "0x",
    callGasLimit: "0x0",
    verificationGasLimit: "0x0",
    preVerificationGas: "0x0",
    maxFeePerGas: "0x0",
    maxPriorityFeePerGas: "0x0",
    paymasterAndData: "0x",
    signature: "0x"
  };
}
