import { NextRequest, NextResponse } from 'next/server';
import { okxAICopilot } from '@/lib/ai/okxCopilot';
import { okxDexService } from '@/lib/services/okxDex';

// OKX AI Copilot API - AI Track
export async function POST(request: NextRequest) {
  try {
    const { action, portfolio, preferences } = await request.json();
    
    if (!action) {
      return NextResponse.json(
        { success: false, error: 'Action parameter required' },
        { status: 400 }
      );
    }
    
    const marketData = await okxDexService.getDexPairs();
    const arbitrageOps = await okxDexService.findArbitrageOpportunities();
    
    let result;
    
    switch (action) {
      case 'analyze_portfolio':
        if (!portfolio) {
          return NextResponse.json(
            { success: false, error: 'Portfolio data required for analysis' },
            { status: 400 }
          );
        }
        result = await okxAICopilot.analyzePortfolio(portfolio);
        break;
        
      case 'suggest_strategies':
        if (!portfolio) {
          return NextResponse.json(
            { success: false, error: 'Portfolio data required for strategy suggestions' },
            { status: 400 }
          );
        }
        result = await okxAICopilot.suggestTradingStrategies(portfolio, marketData, arbitrageOps);
        break;
        
      case 'market_insights':
        result = await okxAICopilot.generateMarketInsights(marketData);
        break;
        
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action parameter' },
          { status: 400 }
        );
    }
    
    return NextResponse.json({
      success: true,
      action,
      data: result,
      timestamp: new Date().toISOString(),
      marketDataCount: marketData.length,
      arbitrageOpportunities: arbitrageOps.length
    });
    
  } catch (error) {
    console.error('AI Copilot API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process AI request',
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    );
  }
}

// Get general AI insights
export async function GET() {
  try {
    const marketData = await okxDexService.getDexPairs();
    const insights = await okxAICopilot.generateMarketInsights(marketData);
    
    return NextResponse.json({
      success: true,
      insights,
      marketSummary: {
        totalPairs: marketData.length,
        totalLiquidity: marketData.reduce((sum, pair) => sum + pair.liquidity, 0),
        totalVolume24h: marketData.reduce((sum, pair) => sum + pair.volume24h, 0)
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('AI Insights API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch AI insights',
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    );
  }
}