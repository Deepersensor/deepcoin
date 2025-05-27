import { NextRequest, NextResponse } from 'next/server';
import { okxDexService } from '@/lib/services/okxDex';

// OKX DEX Arbitrage API - Trading Track
export async function GET() {
  try {
    const opportunities = await okxDexService.findArbitrageOpportunities();
    
    return NextResponse.json({
      success: true,
      opportunities,
      timestamp: new Date().toISOString(),
      count: opportunities.length
    });
  } catch (error) {
    console.error('Arbitrage API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch arbitrage opportunities',
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { baseToken, quoteToken, amount, slippage = 1 } = await request.json();
    
    if (!baseToken || !quoteToken || !amount) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    // Execute arbitrage trade (mock implementation)
    const result = await okxDexService.executeSwap({
      fromToken: baseToken,
      toToken: quoteToken,
      amount: parseFloat(amount),
      slippage: parseFloat(slippage)
    });
    
    return NextResponse.json({
      success: result.success,
      ...result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Arbitrage execution error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to execute arbitrage trade',
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    );
  }
}