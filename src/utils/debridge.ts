import { DlnClient, ChainId, OrderStatus } from '@debridge-finance/dln-client';

// Initialize deBridge DLN client
const dlnClient = new DlnClient({
  environment: 'production', // or 'staging' for testing
});

// Supported chains for deBridge
export const SUPPORTED_CHAINS = {
  ETHEREUM: ChainId.Ethereum,
  POLYGON: ChainId.Polygon,
  ARBITRUM: ChainId.Arbitrum,
  SOLANA: ChainId.Solana,
  BNB: ChainId.BNB,
  AVALANCHE: ChainId.Avalanche,
} as const;

export interface CrossChainTransferParams {
  srcChainId: ChainId;
  dstChainId: ChainId;
  srcTokenAddress: string;
  dstTokenAddress: string;
  amount: string;
  receiverAddress: string;
  senderAddress: string;
}

export interface AIAgentPaymentParams {
  agentId: string;
  serviceType: string;
  amount: string;
  tokenAddress: string;
  chainId: ChainId;
  recipientAddress: string;
}

// Get supported tokens for cross-chain transfer
export async function getSupportedTokens(chainId: ChainId) {
  try {
    const tokens = await dlnClient.getSupportedTokens(chainId);
    return tokens;
  } catch (error) {
    console.error('Error fetching supported tokens:', error);
    throw error;
  }
}

// Create cross-chain transfer order
export async function createCrossChainOrder(params: CrossChainTransferParams) {
  try {
    const orderParams = {
      srcChainId: params.srcChainId,
      dstChainId: params.dstChainId,
      srcTokenAddress: params.srcTokenAddress,
      dstTokenAddress: params.dstTokenAddress,
      amount: params.amount,
      receiverAddress: params.receiverAddress,
      senderAddress: params.senderAddress,
    };

    const order = await dlnClient.createOrder(orderParams);
    return order;
  } catch (error) {
    console.error('Error creating cross-chain order:', error);
    throw error;
  }
}

// Track order status
export async function trackOrderStatus(orderId: string) {
  try {
    const status = await dlnClient.getOrderStatus(orderId);
    return status;
  } catch (error) {
    console.error('Error tracking order status:', error);
    throw error;
  }
}

// AI Agent Service Payment (deTips implementation)
export async function processAIAgentPayment(params: AIAgentPaymentParams) {
  try {
    // Create payment metadata for AI agent services
    const paymentMetadata = {
      agentId: params.agentId,
      serviceType: params.serviceType,
      timestamp: Date.now(),
      version: '1.0',
    };

    // For cross-chain AI agent payments, we use deBridge to route payments
    const crossChainParams: CrossChainTransferParams = {
      srcChainId: params.chainId,
      dstChainId: ChainId.Ethereum, // Default to Ethereum for AI agent payments
      srcTokenAddress: params.tokenAddress,
      dstTokenAddress: params.tokenAddress, // Assuming same token on destination
      amount: params.amount,
      receiverAddress: params.recipientAddress,
      senderAddress: '', // Will be set when transaction is signed
    };

    const order = await createCrossChainOrder(crossChainParams);
    
    return {
      orderId: order.orderId,
      metadata: paymentMetadata,
      order,
    };
  } catch (error) {
    console.error('Error processing AI agent payment:', error);
    throw error;
  }
}

// Cross-chain royalty distribution
export async function distributeCrossChainRoyalties(
  royalties: Array<{
    recipient: string;
    amount: string;
    chainId: ChainId;
    tokenAddress: string;
  }>,
  sourceChainId: ChainId,
  sourceTokenAddress: string,
  senderAddress: string
) {
  try {
    const orders = [];

    for (const royalty of royalties) {
      if (royalty.chainId !== sourceChainId) {
        // Cross-chain royalty payment
        const order = await createCrossChainOrder({
          srcChainId: sourceChainId,
          dstChainId: royalty.chainId,
          srcTokenAddress: sourceTokenAddress,
          dstTokenAddress: royalty.tokenAddress,
          amount: royalty.amount,
          receiverAddress: royalty.recipient,
          senderAddress,
        });
        orders.push(order);
      }
    }

    return orders;
  } catch (error) {
    console.error('Error distributing cross-chain royalties:', error);
    throw error;
  }
}

// Get estimated fees for cross-chain transfer
export async function getTransferFees(params: CrossChainTransferParams) {
  try {
    const fees = await dlnClient.getOrderFees({
      srcChainId: params.srcChainId,
      dstChainId: params.dstChainId,
      srcTokenAddress: params.srcTokenAddress,
      dstTokenAddress: params.dstTokenAddress,
      amount: params.amount,
    });
    return fees;
  } catch (error) {
    console.error('Error getting transfer fees:', error);
    throw error;
  }
}
