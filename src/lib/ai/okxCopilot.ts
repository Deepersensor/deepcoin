// OKX AI Copilot for AI Track
// Provides AI-powered trading strategies and portfolio analysis using OKX data

import { TokenPair, ArbitrageOpportunity } from '../services/okxDex';

export interface Portfolio {
  totalValue: number;
  assets: {
    symbol: string;
    amount: number;
    value: number;
    percentage: number;
  }[];
  performance24h: number;
  riskScore: number;
}

export interface TradingStrategy {
  name: string;
  type: 'arbitrage' | 'dca' | 'momentum' | 'mean_reversion';
  description: string;
  expectedReturn: string;
  riskLevel: 'low' | 'medium' | 'high';
  timeframe: string;
  actions: string[];
  confidence: number;
}

export interface AIInsight {
  type: 'bullish' | 'bearish' | 'neutral' | 'opportunity';
  title: string;
  description: string;
  confidence: number;
  timeframe: string;
  actionable: boolean;
}

export class OkxAICopilot {
  
  // Analyze portfolio using AI algorithms
  async analyzePortfolio(portfolio: Portfolio): Promise<{
    analysis: string;
    riskLevel: string;
    suggestions: string[];
    diversificationScore: number;
    optimizations: string[];
  }> {
    try {
      // AI analysis based on portfolio composition
      const { assets, totalValue, riskScore } = portfolio;
      
      // Calculate diversification score
      const diversificationScore = this.calculateDiversification(assets);
      
      // Generate AI insights
      const analysis = this.generatePortfolioAnalysis(assets, riskScore, diversificationScore);
      
      const suggestions = this.generateSuggestions(assets, diversificationScore);
      
      const optimizations = this.generateOptimizations(assets, riskScore);
      
      return {
        analysis,
        riskLevel: riskScore > 7 ? 'high' : riskScore > 4 ? 'medium' : 'low',
        suggestions,
        diversificationScore,
        optimizations
      };
    } catch (error) {
      console.error('Portfolio analysis failed:', error);
      throw new Error('Failed to analyze portfolio');
    }
  }

  // Generate AI-powered trading strategies
  async suggestTradingStrategies(
    portfolio: Portfolio,
    marketData: TokenPair[],
    arbitrageOps: ArbitrageOpportunity[]
  ): Promise<TradingStrategy[]> {
    try {
      const strategies: TradingStrategy[] = [];
      
      // Arbitrage strategy if opportunities exist
      if (arbitrageOps.length > 0) {
        const bestOp = arbitrageOps[0];
        strategies.push({
          name: 'DEX-CEX Arbitrage',
          type: 'arbitrage',
          description: `Exploit price differences between OKX DEX and CEX for ${bestOp.pair}`,
          expectedReturn: `${bestOp.spreadPercent.toFixed(2)}%`,
          riskLevel: bestOp.spreadPercent > 2 ? 'medium' : 'low',
          timeframe: '5-15 minutes',
          actions: [
            `Buy ${bestOp.pair} on ${bestOp.dexPrice < bestOp.cexPrice ? 'DEX' : 'CEX'}`,
            `Sell ${bestOp.pair} on ${bestOp.dexPrice < bestOp.cexPrice ? 'CEX' : 'DEX'}`,
            'Monitor gas fees and slippage'
          ],
          confidence: Math.min(bestOp.spreadPercent * 10, 95)
        });
      }
      
      // DCA strategy for volatile assets
      const volatileAssets = portfolio.assets.filter(asset => 
        ['SOL', 'ETH', 'BTC'].includes(asset.symbol) && asset.percentage > 10
      );
      
      if (volatileAssets.length > 0) {
        strategies.push({
          name: 'Smart DCA',
          type: 'dca',
          description: 'Dollar-cost average into volatile assets during favorable market conditions',
          expectedReturn: '8-15% annually',
          riskLevel: 'low',
          timeframe: 'Long-term (3-12 months)',
          actions: [
            'Set up automated purchases during market dips',
            'Adjust DCA frequency based on volatility',
            'Rebalance monthly'
          ],
          confidence: 75
        });
      }
      
      // Momentum strategy
      const trendingPairs = marketData.filter(pair => pair.volume24h > 500000);
      if (trendingPairs.length > 0) {
        strategies.push({
          name: 'Momentum Trading',
          type: 'momentum',
          description: 'Ride the trend on high-volume pairs with strong momentum indicators',
          expectedReturn: '12-25%',
          riskLevel: 'high',
          timeframe: 'Short-term (1-7 days)',
          actions: [
            'Monitor volume spikes on trending pairs',
            'Enter positions on confirmed breakouts',
            'Set tight stop-losses'
          ],
          confidence: 65
        });
      }
      
      return strategies;
    } catch (error) {
      console.error('Strategy generation failed:', error);
      return [];
    }
  }

  // Generate AI insights about market conditions
  async generateMarketInsights(marketData: TokenPair[]): Promise<AIInsight[]> {
    try {
      const insights: AIInsight[] = [];
      
      // Volume analysis
      const highVolumeTokens = marketData.filter(pair => pair.volume24h > 1000000);
      if (highVolumeTokens.length > 0) {
        insights.push({
          type: 'opportunity',
          title: 'High Volume Activity Detected',
          description: `${highVolumeTokens.length} pairs showing exceptional trading volume. Consider momentum strategies.`,
          confidence: 80,
          timeframe: '24 hours',
          actionable: true
        });
      }
      
      // Liquidity analysis
      const lowLiquidityPairs = marketData.filter(pair => pair.liquidity < 500000);
      if (lowLiquidityPairs.length > 0) {
        insights.push({
          type: 'bearish',
          title: 'Low Liquidity Warning',
          description: `${lowLiquidityPairs.length} pairs have low liquidity. Exercise caution with large trades.`,
          confidence: 90,
          timeframe: 'Current',
          actionable: true
        });
      }
      
      // Market sentiment
      const avgVolume = marketData.reduce((sum, pair) => sum + pair.volume24h, 0) / marketData.length;
      const sentiment = avgVolume > 800000 ? 'bullish' : avgVolume < 400000 ? 'bearish' : 'neutral';
      
      insights.push({
        type: sentiment,
        title: `Market Sentiment: ${sentiment.toUpperCase()}`,
        description: `Average trading volume suggests ${sentiment} market conditions.`,
        confidence: 70,
        timeframe: '24 hours',
        actionable: sentiment !== 'neutral'
      });
      
      return insights;
    } catch (error) {
      console.error('Insight generation failed:', error);
      return [];
    }
  }

  // Helper methods
  private calculateDiversification(assets: Portfolio['assets']): number {
    if (assets.length === 0) return 0;
    
    // Calculate Herfindahl-Hirschman Index for diversification
    const hhi = assets.reduce((sum, asset) => {
      const weight = asset.percentage / 100;
      return sum + (weight * weight);
    }, 0);
    
    // Convert to diversification score (0-100, higher is better)
    return Math.max(0, (1 - hhi) * 100);
  }
  
  private generatePortfolioAnalysis(
    assets: Portfolio['assets'],
    riskScore: number,
    diversificationScore: number
  ): string {
    const majorHoldings = assets.filter(asset => asset.percentage > 20);
    const cryptoExposure = assets.filter(asset => 
      ['BTC', 'ETH', 'SOL'].includes(asset.symbol)
    ).reduce((sum, asset) => sum + asset.percentage, 0);
    
    let analysis = `Your portfolio shows a ${riskScore > 6 ? 'high' : riskScore > 3 ? 'moderate' : 'conservative'} risk profile. `;
    
    if (diversificationScore < 40) {
      analysis += 'Diversification is limited - consider spreading investments across more assets. ';
    } else if (diversificationScore > 70) {
      analysis += 'Good diversification across multiple assets. ';
    }
    
    if (majorHoldings.length > 0) {
      analysis += `You have concentrated positions in ${majorHoldings.map(h => h.symbol).join(', ')}. `;
    }
    
    if (cryptoExposure > 80) {
      analysis += 'High crypto exposure - consider some risk management strategies.';
    }
    
    return analysis;
  }
  
  private generateSuggestions(assets: Portfolio['assets'], diversificationScore: number): string[] {
    const suggestions: string[] = [];
    
    if (diversificationScore < 50) {
      suggestions.push('Consider adding more assets to improve diversification');
    }
    
    const stablecoinPercentage = assets
      .filter(asset => ['USDC', 'USDT', 'DAI'].includes(asset.symbol))
      .reduce((sum, asset) => sum + asset.percentage, 0);
    
    if (stablecoinPercentage < 10) {
      suggestions.push('Consider holding 10-20% in stablecoins for stability');
    }
    
    const majorAssets = assets.filter(asset => asset.percentage > 30);
    if (majorAssets.length > 0) {
      suggestions.push(`Consider reducing position size in ${majorAssets[0].symbol} to manage concentration risk`);
    }
    
    suggestions.push('Use OKX DEX for efficient swaps when rebalancing');
    suggestions.push('Monitor arbitrage opportunities for additional yield');
    
    return suggestions;
  }
  
  private generateOptimizations(assets: Portfolio['assets'], riskScore: number): string[] {
    const optimizations: string[] = [];
    
    if (riskScore > 7) {
      optimizations.push('Implement stop-loss orders on volatile positions');
      optimizations.push('Consider taking some profits in high-risk assets');
    }
    
    optimizations.push('Set up automated rebalancing on OKX DEX');
    optimizations.push('Use DCA strategies for accumulating during dips');
    
    const smallPositions = assets.filter(asset => asset.percentage < 2);
    if (smallPositions.length > 3) {
      optimizations.push('Consolidate small positions to reduce complexity');
    }
    
    return optimizations;
  }
}

export const okxAICopilot = new OkxAICopilot();