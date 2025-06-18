import axios from 'axios';

interface CoinGeckoPrice {
  [key: string]: {
    usd: number;
    usd_24h_change: number;
    usd_market_cap: number;
    usd_24h_vol: number;
  };
}

interface CoinGeckoHistoricalData {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

interface CryptoData {
  symbol: string;
  name: string;
  currentPrice: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  priceHistory: number[];
  predictedPrice?: number;
  predictionAccuracy?: number;
  paymasterSupported?: boolean; // New field for paymaster support
}

interface PaymasterGasEstimate {
  estimatedCost: number;
  freeGasAvailable: boolean;
  supportedTokens: string[];
  recommendedPaymentType: 0 | 1 | 2;
}

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

// Map common symbols to CoinGecko IDs
const SYMBOL_TO_ID_MAP: { [key: string]: string } = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  SOL: 'solana',
  BNB: 'binancecoin',
  XRP: 'ripple',
  ADA: 'cardano',
  DOGE: 'dogecoin',
  DOT: 'polkadot',
  MATIC: 'polygon',
  AVAX: 'avalanche-2',
  LINK: 'chainlink',
  UNI: 'uniswap',
  NERO: 'nero-chain', // Add NERO token support
};

export class CryptoApiService {
  private readonly baseUrl = COINGECKO_API_URL;

  /**
   * Get current prices for multiple cryptocurrencies with paymaster support info
   */
  async getCryptoPrices(symbols: string[], includePaymasterInfo = false): Promise<CryptoData[]> {
    try {
      // Convert symbols to CoinGecko IDs
      const ids = symbols.map(symbol => SYMBOL_TO_ID_MAP[symbol.toUpperCase()] || symbol.toLowerCase()).join(',');
      
      const response = await axios.get(`${this.baseUrl}/simple/price`, {
        params: {
          ids,
          vs_currencies: 'usd',
          include_24hr_change: true,
          include_market_cap: true,
          include_24hr_vol: true,
        },
      });

      const data: CoinGeckoPrice = response.data;
      
      return symbols.map(symbol => {
        const id = SYMBOL_TO_ID_MAP[symbol.toUpperCase()] || symbol.toLowerCase();
        const priceData = data[id];
        
        if (!priceData) {
          // Return mock data if not found
          return {
            symbol: symbol.toUpperCase(),
            name: this.getDisplayName(symbol),
            currentPrice: Math.random() * 50000 + 1000,
            change24h: Math.random() * 20 - 10,
            marketCap: Math.random() * 1000000000000,
            volume24h: Math.random() * 50000000000,
            priceHistory: Array(30).fill(0).map(() => Math.random() * 50000 + 1000),
            paymasterSupported: includePaymasterInfo && this.isPaymasterSupportedToken(symbol),
          };
        }

        return {
          symbol: symbol.toUpperCase(),
          name: this.getDisplayName(symbol),
          currentPrice: priceData.usd,
          change24h: priceData.usd_24h_change || 0,
          marketCap: priceData.usd_market_cap || 0,
          volume24h: priceData.usd_24h_vol || 0,
          priceHistory: [], // Will be filled by getHistoricalData
          paymasterSupported: includePaymasterInfo && this.isPaymasterSupportedToken(symbol),
        };
      });
    } catch (error) {
      console.error('Error fetching crypto prices:', error);
      
      // Return mock data as fallback
      return symbols.map(symbol => ({
        symbol: symbol.toUpperCase(),
        name: this.getDisplayName(symbol),
        currentPrice: Math.random() * 50000 + 1000,
        change24h: Math.random() * 20 - 10,
        marketCap: Math.random() * 1000000000000,
        volume24h: Math.random() * 50000000000,
        priceHistory: Array(30).fill(0).map(() => Math.random() * 50000 + 1000),
        paymasterSupported: includePaymasterInfo && this.isPaymasterSupportedToken(symbol),
      }));
    }
  }

  /**
   * Estimate gas costs with paymaster options
   */
  async estimateGasWithPaymaster(
    walletAddress: string,
    txType: 'transfer' | 'swap' | 'nft' = 'transfer'
  ): Promise<PaymasterGasEstimate> {
    try {
      // This would integrate with your paymaster hook
      // For now, return mock data
      return {
        estimatedCost: 0.002, // ETH equivalent
        freeGasAvailable: true,
        supportedTokens: ['USDC', 'DAI', 'NERO'],
        recommendedPaymentType: 0, // Free gas recommended
      };
    } catch (error) {
      console.error('Error estimating gas with paymaster:', error);
      throw error;
    }
  }

  /**
   * Check if a token is supported by NERO paymaster
   */
  private isPaymasterSupportedToken(symbol: string): boolean {
    const supportedTokens = ['USDC', 'DAI', 'USDT', 'NERO', 'ETH'];
    return supportedTokens.includes(symbol.toUpperCase());
  }

  /**
   * Get historical price data for a cryptocurrency
   */
  async getHistoricalData(symbol: string, days: number = 30): Promise<number[]> {
    try {
      const id = SYMBOL_TO_ID_MAP[symbol.toUpperCase()] || symbol.toLowerCase();
      
      const response = await axios.get(`${this.baseUrl}/coins/${id}/market_chart`, {
        params: {
          vs_currency: 'usd',
          days,
          interval: days > 90 ? 'daily' : 'hourly',
        },
      });

      const data: CoinGeckoHistoricalData = response.data;
      return data.prices.map(([timestamp, price]) => price);
    } catch (error) {
      console.error(`Error fetching historical data for ${symbol}:`, error);
      
      // Return mock historical data
      return Array(days).fill(0).map(() => Math.random() * 50000 + 1000);
    }
  }

  /**
   * Get trending cryptocurrencies
   */
  async getTrendingCoins(): Promise<any[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/search/trending`);
      return response.data.coins || [];
    } catch (error) {
      console.error('Error fetching trending coins:', error);
      return [];
    }
  }

  /**
   * Search for cryptocurrencies
   */
  async searchCoins(query: string): Promise<any[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/search`, {
        params: { query },
      });
      return response.data.coins || [];
    } catch (error) {
      console.error('Error searching coins:', error);
      return [];
    }
  }

  /**
   * Get coin details by ID
   */
  async getCoinDetails(id: string): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/coins/${id}`, {
        params: {
          localization: false,
          tickers: false,
          market_data: true,
          community_data: false,
          developer_data: false,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching coin details for ${id}:`, error);
      return null;
    }
  }

  /**
   * Get display name for a symbol
   */
  private getDisplayName(symbol: string): string {
    const names: { [key: string]: string } = {
      BTC: 'Bitcoin',
      ETH: 'Ethereum',
      SOL: 'Solana',
      BNB: 'BNB',
      XRP: 'XRP',
      ADA: 'Cardano',
      DOGE: 'Dogecoin',
      DOT: 'Polkadot',
      MATIC: 'Polygon',
      AVAX: 'Avalanche',
      LINK: 'Chainlink',
      UNI: 'Uniswap',
      NERO: 'NERO Chain',
    };
    
    return names[symbol.toUpperCase()] || symbol.toUpperCase();
  }
}

// Export singleton instance
export const cryptoApiService = new CryptoApiService();