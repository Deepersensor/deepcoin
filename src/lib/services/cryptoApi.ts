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
}

class CryptoApiService {
  private baseUrl = 'https://api.coingecko.com/api/v3';
  
  // Map symbols to CoinGecko IDs
  private coinMap: Record<string, string> = {
    'BTC': 'bitcoin',
    'ETH': 'ethereum',
    'SOL': 'solana',
    'BNB': 'binancecoin',
    'XRP': 'ripple',
    'ADA': 'cardano',
    'DOGE': 'dogecoin',
    'DOT': 'polkadot'
  };

  async getCryptoPrices(symbols: string[]): Promise<CryptoData[]> {
    try {
      const coinIds = symbols.map(symbol => this.coinMap[symbol]).filter(Boolean);
      
      if (coinIds.length === 0) {
        throw new Error('No valid coin symbols provided');
      }

      const response = await fetch(
        `${this.baseUrl}/simple/price?ids=${coinIds.join(',')}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true`,
        {
          headers: {
            'Accept': 'application/json',
          },
        }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch crypto prices: ${response.status}`);
      }
      
      const data: CoinGeckoPrice = await response.json();
      
      return symbols.map(symbol => {
        const coinId = this.coinMap[symbol];
        const coinData = data[coinId];
        
        if (!coinData) {
          // Return mock data if API fails
          return this.getMockCoinData(symbol);
        }
        
        return {
          symbol,
          name: this.getCoinName(symbol),
          currentPrice: coinData.usd,
          change24h: coinData.usd_24h_change || 0,
          marketCap: coinData.usd_market_cap || 0,
          volume24h: coinData.usd_24h_vol || 0,
          priceHistory: [], // Will be filled by historical data
          predictedPrice: coinData.usd * (1 + (Math.random() * 0.2 - 0.1)), // Mock prediction
          predictionAccuracy: Math.random() * 30 + 70, // Mock accuracy 70-100%
        };
      });
    } catch (error) {
      console.error('Error fetching crypto prices:', error);
      // Return mock data as fallback
      return symbols.map(symbol => this.getMockCoinData(symbol));
    }
  }

  async getHistoricalPrices(symbol: string, days: number = 30): Promise<number[]> {
    try {
      const coinId = this.coinMap[symbol];
      
      if (!coinId) {
        throw new Error(`Unknown coin symbol: ${symbol}`);
      }

      const response = await fetch(
        `${this.baseUrl}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=daily`,
        {
          headers: {
            'Accept': 'application/json',
          },
        }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch historical data: ${response.status}`);
      }
      
      const data: CoinGeckoHistoricalData = await response.json();
      
      return data.prices.map(price => price[1]);
    } catch (error) {
      console.error('Error fetching historical prices:', error);
      // Return mock historical data
      const basePrice = Math.random() * 50000 + 1000;
      return Array(days).fill(0).map((_, i) => {
        const variation = Math.sin(i * 0.1) * (basePrice * 0.1) + (Math.random() * basePrice * 0.05);
        return basePrice + variation;
      });
    }
  }

  private getMockCoinData(symbol: string): CryptoData {
    const basePrice = Math.random() * 50000 + 1000;
    return {
      symbol,
      name: this.getCoinName(symbol),
      currentPrice: basePrice,
      change24h: Math.random() * 20 - 10,
      marketCap: Math.random() * 1000000000000,
      volume24h: Math.random() * 50000000000,
      priceHistory: Array(30).fill(0).map(() => basePrice + (Math.random() * basePrice * 0.1)),
      predictedPrice: basePrice * (1 + (Math.random() * 0.2 - 0.1)),
      predictionAccuracy: Math.random() * 30 + 70,
    };
  }

  private getCoinName(symbol: string): string {
    const names: Record<string, string> = {
      'BTC': 'Bitcoin',
      'ETH': 'Ethereum',
      'SOL': 'Solana',
      'BNB': 'BNB',
      'XRP': 'XRP',
      'ADA': 'Cardano',
      'DOGE': 'Dogecoin',
      'DOT': 'Polkadot'
    };
    return names[symbol] || symbol;
  }
}

export const cryptoApiService = new CryptoApiService();
export type { CryptoData, CoinGeckoPrice };