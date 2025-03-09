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

/**
 * AI-powered price prediction service
 */
export class PredictionService {
  /**
   * Get price prediction for a cryptocurrency
   */
  async getPricePrediction(
    coinSymbol: string, 
    timeframe: PredictionTimeframe
  ): Promise<PricePrediction> {
    try {
      // Get current market data from Blockchair
      const marketData = await blockchairClient.getMarketData(coinSymbol.toLowerCase());
      
      // In a real implementation, this would use an AI model to make predictions
      // For now, we'll simulate a prediction with random data
      const currentPrice = marketData?.data?.market_price_usd || 1000;
      
      // Simulate AI prediction (in real app would use ML model)
      const multiplier = this.getTimeframeMultiplier(timeframe);
      const randomChange = (Math.random() * 0.2 - 0.1) * multiplier; // -10% to +10% * multiplier
      const predictedPrice = currentPrice * (1 + randomChange);
      const percentageChange = randomChange * 100;
      
      // Generate mock factors that might influence price
      const factors = this.generateFactors(coinSymbol, percentageChange);
      
      // Determine confidence based on timeframe (shorter = higher confidence)
      const confidence = this.determineConfidence(timeframe);
      
      // Get historical prices
      const historicalPrices = await this.getHistoricalPrices(coinSymbol, timeframe);
      
      // Calculate accuracy score (mock implementation)
      const accuracyScore = Math.random() * 100;
      
      // Calculate volume change (mock implementation)
      const volumeChange = Math.random() * 100;
      
      return {
        currentPrice,
        predictedPrice,
        percentageChange,
        confidence,
        factors,
        historicalPrices,
        accuracyScore,
        volumeChange
      };
    } catch (error) {
      console.error(`Error generating prediction for ${coinSymbol}: ${error}`);
      throw error;
    }
  }
  
  /**
   * Helper method to determine confidence level based on timeframe
   */
  private determineConfidence(timeframe: PredictionTimeframe): PredictionConfidence {
    switch (timeframe) {
      case '1d': return 'high';
      case '7d': return 'high';
      case '30d': return 'medium';
      case '90d': return 'low';
      case '1y': return 'low';
      default: return 'medium';
    }
  }
  
  /**
   * Helper method to determine volatility multiplier based on timeframe
   */
  private getTimeframeMultiplier(timeframe: PredictionTimeframe): number {
    switch (timeframe) {
      case '1d': return 1;
      case '7d': return 2;
      case '30d': return 3;
      case '90d': return 4;
      case '1y': return 5;
      default: return 2;
    }
  }
  
  /**
   * Generate example factors that might affect the price
   */
  private generateFactors(coinSymbol: string, percentageChange: number): string[] {
    const factors = [
      `Recent trading volume changes for ${coinSymbol}`,
      `Market sentiment analysis from social media`,
      `Technical indicators (RSI, MACD, Moving Averages)`,
      `Correlation with major market indices`
    ];
    
    // Add conditional factors based on predicted direction
    if (percentageChange > 0) {
      factors.push('Positive regulatory news expected');
      factors.push('Increasing institutional adoption');
    } else {
      factors.push('Potential market correction ahead');
      factors.push('Reduced network activity');
    }
    
    return factors;
  }
  
  /**
   * Get historical prices for a cryptocurrency
   */
  async getHistoricalPrices(coinSymbol: string, timeframe: PredictionTimeframe) {
    try {
      const days = this.getTimeframeDays(timeframe);
      const marketData = await blockchairClient.getMarketData(coinSymbol.toLowerCase());
      
      // Generate mock historical data - replace with real API call
      const currentPrice = marketData?.data?.market_price_usd || 40000;
      const historicalPrices = Array(days).fill(0).map((_, i) => ({
        timestamp: Date.now() - (i * 24 * 60 * 60 * 1000),
        price: currentPrice * (1 + (Math.random() * 0.4 - 0.2))
      }));
      
      return historicalPrices.reverse();
    } catch (error) {
      console.error(`Error fetching historical prices: ${error}`);
      throw error;
    }
  }
  
  /**
   * Helper method to determine number of days based on timeframe
   */
  private getTimeframeDays(timeframe: PredictionTimeframe): number {
    switch (timeframe) {
      case '1d': return 1;
      case '7d': return 7;
      case '30d': return 30;
      case '90d': return 90;
      case '1y': return 365;
      default: return 7;
    }
  }
}

// Export singleton instance
export const predictionService = new PredictionService();
