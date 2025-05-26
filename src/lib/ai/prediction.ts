import { blockchairClient } from '../api/blockchair';

type PredictionTimeframe = '1d' | '7d' | '30d' | '90d' | '1y';
type PredictionConfidence = 'low' | 'medium' | 'high';

interface PricePrediction {
  currentPrice: number;
  predictedPrice: number;
  percentageChange: number;
  confidence: PredictionConfidence;
  factors: string[];
  historicalPrices: {
    timestamp: number;
    price: number;
  }[];
  accuracyScore: number;
  volumeChange: number;
}

interface Prediction {
  currentPrice: number;
  predictedPrice: number;
  percentageChange: number;
  confidence: 'low' | 'medium' | 'high';
  factors: string[];
}

class PredictionService {
  private predictionFactors = {
    'BTC': [
      'Strong institutional adoption continues',
      'Regulatory clarity improving in major markets',
      'Hash rate reaching new all-time highs',
      'Lightning Network adoption accelerating',
      'Correlation with traditional markets decreasing'
    ],
    'ETH': [
      'Ethereum 2.0 staking rewards attracting capital',
      'DeFi total value locked increasing',
      'Layer 2 solutions gaining traction',
      'NFT marketplace activity remaining strong',
      'Gas fee optimizations showing progress'
    ],
    'SOL': [
      'High-performance blockchain attracting developers',
      'NFT ecosystem expanding rapidly',
      'DeFi protocols launching with innovative features',
      'Mobile-first approach gaining user adoption',
      'Validator network strengthening'
    ],
    'BNB': [
      'Binance Smart Chain ecosystem growth',
      'Regular token burn events reducing supply',
      'Cross-chain bridge adoption increasing',
      'Launchpad projects showing strong performance',
      'Trading volume on Binance remaining high'
    ],
    'XRP': [
      'Legal clarity improving after court rulings',
      'Cross-border payment partnerships expanding',
      'Central bank digital currency integration',
      'Ripple technology adoption by financial institutions',
      'Market sentiment recovering from regulatory uncertainty'
    ],
    'ADA': [
      'Smart contract ecosystem maturing',
      'Academic research backing protocol improvements',
      'Sustainable proof-of-stake consensus',
      'African market penetration strategies',
      'Developer tools and documentation improving'
    ],
    'DOGE': [
      'Social media sentiment driving adoption',
      'Payment integration by major platforms',
      'Community-driven development initiatives',
      'Merchant acceptance increasing gradually',
      'Elon Musk endorsements creating volatility'
    ],
    'DOT': [
      'Parachain auctions driving network activity',
      'Cross-chain interoperability demand growing',
      'Substrate framework adoption by new projects',
      'Governance token utility expanding',
      'Web3 infrastructure development accelerating'
    ]
  };

  async getPricePrediction(coinSymbol: string, timeframe: string): Promise<Prediction> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    // Get base price (this would come from real market data)
    const basePrice = this.getBasePriceForCoin(coinSymbol);
    
    // Calculate prediction based on timeframe
    const prediction = this.calculatePrediction(basePrice, timeframe, coinSymbol);
    
    return prediction;
  }

  private getBasePriceForCoin(symbol: string): number {
    // Mock current prices - in production, this would come from your crypto API
    const mockPrices: Record<string, number> = {
      'BTC': 65000 + (Math.random() * 10000 - 5000),
      'ETH': 3200 + (Math.random() * 800 - 400),
      'SOL': 180 + (Math.random() * 40 - 20),
      'BNB': 580 + (Math.random() * 120 - 60),
      'XRP': 0.62 + (Math.random() * 0.2 - 0.1),
      'ADA': 1.45 + (Math.random() * 0.3 - 0.15),
      'DOGE': 0.28 + (Math.random() * 0.1 - 0.05),
      'DOT': 18.5 + (Math.random() * 4 - 2)
    };
    
    return mockPrices[symbol] || 1000;
  }

  private calculatePrediction(basePrice: number, timeframe: string, coinSymbol: string): Prediction {
    // Time-based volatility multipliers
    const timeMultipliers: Record<string, number> = {
      '1d': 0.05,   // 5% max change for 1 day
      '7d': 0.15,   // 15% max change for 1 week
      '30d': 0.35,  // 35% max change for 1 month
      '90d': 0.65,  // 65% max change for 3 months
      '1y': 1.5     // 150% max change for 1 year
    };

    // Coin-specific volatility (some coins are more volatile)
    const coinVolatility: Record<string, number> = {
      'BTC': 0.8,
      'ETH': 0.9,
      'SOL': 1.3,
      'BNB': 1.0,
      'XRP': 1.1,
      'ADA': 1.2,
      'DOGE': 1.8,
      'DOT': 1.4
    };

    const maxChange = timeMultipliers[timeframe] || 0.15;
    const volatility = coinVolatility[coinSymbol] || 1.0;
    
    // Generate a prediction with some market trend bias
    const trendBias = this.getMarketTrendBias(coinSymbol);
    const randomFactor = (Math.random() * 2 - 1) * maxChange * volatility;
    const change = (trendBias + randomFactor) / 2;
    
    const predictedPrice = basePrice * (1 + change);
    const percentageChange = (predictedPrice - basePrice) / basePrice * 100;
    
    // Determine confidence based on timeframe and volatility
    let confidence: 'low' | 'medium' | 'high';
    if (timeframe === '1d' || timeframe === '7d') {
      confidence = Math.abs(percentageChange) < 10 ? 'high' : 'medium';
    } else if (timeframe === '30d') {
      confidence = Math.abs(percentageChange) < 25 ? 'medium' : 'low';
    } else {
      confidence = 'low';
    }
    
    // Get relevant factors for this coin
    const factors = this.predictionFactors[coinSymbol as keyof typeof this.predictionFactors] || [
      'Market sentiment analysis showing positive trend',
      'Technical indicators suggesting potential growth',
      'On-chain metrics indicating increased activity',
      'Fundamental analysis supporting price appreciation',
      'Historical patterns suggesting cyclical behavior'
    ];

    return {
      currentPrice: basePrice,
      predictedPrice,
      percentageChange,
      confidence,
      factors: this.shuffleArray(factors).slice(0, 4) // Return 4 random factors
    };
  }

  private getMarketTrendBias(coinSymbol: string): number {
    // Simulate different market conditions for different coins
    const trendBiases: Record<string, number> = {
      'BTC': 0.02,   // Slightly bullish
      'ETH': 0.03,   // Moderately bullish
      'SOL': 0.05,   // More bullish
      'BNB': 0.01,   // Slightly bullish
      'XRP': 0.04,   // Moderately bullish (legal clarity)
      'ADA': 0.02,   // Slightly bullish
      'DOGE': 0.0,   // Neutral (high volatility)
      'DOT': 0.03    // Moderately bullish
    };

    return trendBiases[coinSymbol] || 0.01;
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

export const predictionService = new PredictionService();
export type { Prediction };
