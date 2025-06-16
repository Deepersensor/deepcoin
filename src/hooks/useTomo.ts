import { 
  useAtomValue,
  tomoModalAtom,
  useTomoModalControl,
  useTomoWalletState,
  useTomoClientMap,
  useTomoWalletConnect
} from '@tomo-inc/tomo-web-sdk';
import bs58 from 'bs58';
import BigNumber from 'bignumber.js';
import { createSolTx, getConnection } from '@/utils/solana';

export function useTomo() {
  const tomoModal = useAtomValue(tomoModalAtom);
  const tomoModalControl = useTomoModalControl();
  const tomoWalletState = useTomoWalletState();
  const tomoClientMap = useTomoClientMap();
  const tomoWalletConnect = useTomoWalletConnect();

  // Solana provider functions following the guide
  const signMessage = async (message: string) => {
    const { solanaProvider } = tomoClientMap;
    if (!solanaProvider) throw new Error('Solana provider not available');
    
    const res = await solanaProvider.signMessage(new TextEncoder().encode(message));
    return bs58.encode(res);
  };

  const signTransaction = async (fromAddress: string, toAddress: string, amount: number, mintAddress?: string) => {
    const { solanaProvider } = tomoClientMap;
    if (!solanaProvider) throw new Error('Solana provider not available');
    
    const transaction = await createSolTx(fromAddress, toAddress, amount, mintAddress);
    if (!transaction) throw new Error('Failed to create transaction');
    
    const res = await solanaProvider.signTransaction(transaction);
    return res;
  };

  const sendTransaction = async (fromAddress: string, toAddress: string, amount: number, mintAddress?: string) => {
    const { solanaProvider } = tomoClientMap;
    if (!solanaProvider) throw new Error('Solana provider not available');
    
    const transaction = await createSolTx(fromAddress, toAddress, amount, mintAddress);
    if (!transaction) throw new Error('Failed to create transaction');
    
    const connection = getConnection();
    const signature = await solanaProvider.sendTransaction(transaction, connection);
    return signature;
  };

  const sendSolTransaction = async (toAddress: string, amount: number) => {
    const from = tomoWalletState.solanaAddress || '';
    const decimals = 9;
    const lamports = Number(new BigNumber(amount).shiftedBy(decimals));
    return await sendTransaction(from, toAddress, lamports);
  };

  const sendSplTokenTransaction = async (toAddress: string, amount: number, tokenMintAddress: string, decimals: number = 6) => {
    const from = tomoWalletState.solanaAddress || '';
    const tokenAmount = Number(new BigNumber(amount).shiftedBy(decimals));
    return await sendTransaction(from, toAddress, tokenAmount, tokenMintAddress);
  };

  // EVM provider functions following the guide
  const switchChain = async (chainId: string) => {
    const { ethereumProvider } = tomoClientMap;
    if (!ethereumProvider) throw new Error('Ethereum provider not available');
    
    return await ethereumProvider.switchChain(chainId);
  };

  const getChainId = async () => {
    const { ethereumProvider } = tomoClientMap;
    if (!ethereumProvider) throw new Error('Ethereum provider not available');
    
    return await ethereumProvider.getChainId();
  };

  const getEvmAddress = async () => {
    const { ethereumProvider } = tomoClientMap;
    if (!ethereumProvider) throw new Error('Ethereum provider not available');
    
    const accounts = await ethereumProvider.request({ method: "eth_accounts" });
    return accounts?.[0] || tomoWalletState.address;
  };

  const signEvmMessage = async (message: string, address: string) => {
    const { ethereumProvider } = tomoClientMap;
    if (!ethereumProvider) throw new Error('Ethereum provider not available');
    
    return await ethereumProvider.request({
      method: "personal_sign",
      params: [message, address]
    });
  };

  const signTypedData = async (address: string, typedData: string) => {
    const { ethereumProvider } = tomoClientMap;
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
    const { ethereumProvider } = tomoClientMap;
    if (!ethereumProvider) throw new Error('Ethereum provider not available');
    
    return await ethereumProvider.sendTransaction(params);
  };

  const sendEthTransaction = async (toAddress: string, amount: number) => {
    const fromAddress = tomoWalletState.address || '';
    const valueInWei = (amount * 1e18).toString(16);
    
    return await sendEvmTransaction({
      from: fromAddress,
      to: toAddress,
      value: `0x${valueInWei}`
    });
  };

  const evmRequest = async (method: string, params?: any[]) => {
    const { ethereumProvider } = tomoClientMap;
    if (!ethereumProvider) throw new Error('Ethereum provider not available');
    
    return await ethereumProvider.request({ method, params });
  };

  return {
    opened: tomoModal.open,
    openConnectModal: tomoModalControl.open,
    closeConnectModal: tomoModalControl.close,
    connected: tomoWalletState.isConnection,
    disconnect: tomoWalletConnect.disconnect,
    solanaAddress: tomoWalletState.solanaAddress,
    evmAddress: tomoWalletState.address,
    providers: {
      solanaProvider: tomoClientMap.solanaProvider,
      ethereumProvider: tomoClientMap.ethereumProvider
    },
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
    evmRequest
  };
}
