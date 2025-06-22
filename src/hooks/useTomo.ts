import { 
  useTomo as useTomoSDK,
  WebWalletInvokeType
} from '@tomo-inc/tomo-web-sdk';
import bs58 from 'bs58';
import BigNumber from 'bignumber.js';
import { createSolTx, getConnection } from '@/utils/solana';

export function useTomo() {
  const { tomoSDK, walletState, providers } = useTomoSDK();

  // Solana provider functions following the guide
  const signMessage = async (message: string) => {
    const { solanaProvider } = providers || {};
    if (!solanaProvider) throw new Error('Solana provider not available');
    
    const res = await solanaProvider.signMessage(new TextEncoder().encode(message));
    return bs58.encode(res);
  };

  const signTransaction = async (fromAddress: string, toAddress: string, amount: number, mintAddress?: string) => {
    const { solanaProvider } = providers || {};
    if (!solanaProvider) throw new Error('Solana provider not available');
    
    const transaction = await createSolTx(fromAddress, toAddress, amount, mintAddress);
    if (!transaction) throw new Error('Failed to create transaction');
    
    const res = await solanaProvider.signTransaction(transaction);
    return res;
  };

  const sendTransaction = async (fromAddress: string, toAddress: string, amount: number, mintAddress?: string) => {
    const { solanaProvider } = providers || {};
    if (!solanaProvider) throw new Error('Solana provider not available');
    
    const transaction = await createSolTx(fromAddress, toAddress, amount, mintAddress);
    if (!transaction) throw new Error('Failed to create transaction');
    
    const connection = getConnection();
    const signature = await solanaProvider.sendTransaction(transaction, connection);
    return signature;
  };

  const sendSolTransaction = async (toAddress: string, amount: number) => {
    const from = walletState?.solanaAddress || '';
    const decimals = 9;
    const lamports = Number(new BigNumber(amount).shiftedBy(decimals));
    return await sendTransaction(from, toAddress, lamports);
  };

  const sendSplTokenTransaction = async (toAddress: string, amount: number, tokenMintAddress: string, decimals: number = 6) => {
    const from = walletState?.solanaAddress || '';
    const tokenAmount = Number(new BigNumber(amount).shiftedBy(decimals));
    return await sendTransaction(from, toAddress, tokenAmount, tokenMintAddress);
  };

  // EVM provider functions following the guide
  const switchChain = async (chainId: string) => {
    const { ethereumProvider } = providers || {};
    if (!ethereumProvider) throw new Error('Ethereum provider not available');
    
    return await ethereumProvider.switchChain(chainId);
  };

  const getChainId = async () => {
    const { ethereumProvider } = providers || {};
    if (!ethereumProvider) throw new Error('Ethereum provider not available');
    
    return await ethereumProvider.getChainId();
  };

  const getEvmAddress = async () => {
    const { ethereumProvider } = providers || {};
    if (!ethereumProvider) throw new Error('Ethereum provider not available');
    
    const accounts = await ethereumProvider.request({ method: "eth_accounts" });
    return accounts?.[0] || walletState?.address;
  };

  const signEvmMessage = async (message: string, address: string) => {
    const { ethereumProvider } = providers || {};
    if (!ethereumProvider) throw new Error('Ethereum provider not available');
    
    return await ethereumProvider.request({
      method: "personal_sign",
      params: [message, address]
    });
  };

  const signTypedData = async (address: string, typedData: string) => {
    const { ethereumProvider } = providers || {};
    if (!ethereumProvider) throw new Error('Ethereum provider not available');
    
    return await ethereumProvider.request({
      method: "eth_signTypedData_v4",
      params: [address, typedData]
    });
  };

  const sendEvmTransaction = async (params: {
    from: string;
    to: string;
    value: string;
    gasPrice?: string;
    gasLimit?: string;
    maxFeePerGas?: string;
    maxPriorityFeePerGas?: string;
    data?: string;
  }) => {
    const { ethereumProvider } = providers || {};
    if (!ethereumProvider) throw new Error('Ethereum provider not available');
    
    return await ethereumProvider.sendTransaction(params);
  };

  const sendEthTransaction = async (toAddress: string, amount: number) => {
    const fromAddress = walletState?.address || '';
    const valueInWei = (amount * 1e18).toString(16);
    
    return await sendEvmTransaction({
      from: fromAddress,
      to: toAddress,
      value: `0x${valueInWei}`
    });
  };

  const evmRequest = async (method: string, params?: any[]) => {
    const { ethereumProvider } = providers || {};
    if (!ethereumProvider) throw new Error('Ethereum provider not available');
    
    return await ethereumProvider.request({ method, params });
  };

  // Internal Wallet Services following the integration guide
  const handleWebWalletInvoke = async (type: WebWalletInvokeType) => {
    if (!tomoSDK) {
      throw new Error('Tomo SDK not available');
    }
    return tomoSDK.handleWebWalletInvoke(type);
  };

  const openSwapModal = () => handleWebWalletInvoke(WebWalletInvokeType.SWAP);
  const openOnrampModal = () => handleWebWalletInvoke(WebWalletInvokeType.ONRAMP);
  const openSendModal = () => handleWebWalletInvoke(WebWalletInvokeType.SEND);
  const openReceiveModal = () => handleWebWalletInvoke(WebWalletInvokeType.RECEIVE);

  return {
    connected: walletState?.isConnected || false,
    solanaAddress: walletState?.solanaAddress,
    evmAddress: walletState?.address,
    providers: providers || {},
    // Solana functions
    signMessage,
    signTransaction,
    sendTransaction,
    sendSolTransaction,
    sendSplTokenTransaction,
    // EVM functions
    switchChain,
    getChainId,
    getEvmAddress,
    signEvmMessage,
    signTypedData,
    sendEvmTransaction,
    sendEthTransaction,
    evmRequest,
    // Internal Wallet Services
    handleWebWalletInvoke,
    openSwapModal,
    openOnrampModal,
    openSendModal,
    openReceiveModal,
    WebWalletInvokeType
  };
}
