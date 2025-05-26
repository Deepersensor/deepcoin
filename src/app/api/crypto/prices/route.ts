import { NextRequest, NextResponse } from 'next/server';
import { cryptoApiService } from '@/lib/services/cryptoApi';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const symbols = searchParams.get('symbols')?.split(',') || [];
    const timeframe = searchParams.get('timeframe') || '7d';
    
    if (symbols.length === 0) {
      return NextResponse.json(
        { error: 'Missing required parameter: symbols' }, 
        { status: 400 }
      );
    }
    
    // Get current prices
    const cryptoData = await cryptoApiService.getCryptoPrices(symbols);
    
    // Add historical data if requested
    if (timeframe !== 'current') {
      const timeframeDays = {
        '1d': 1,
        '7d': 7,
        '30d': 30,
        '90d': 90,
        '1y': 365
      }[timeframe as keyof typeof timeframeDays] || 7;
      
      const enrichedData = await Promise.all(
        cryptoData.map(async (coin) => {
          try {
            const historicalPrices = await cryptoApiService.getHistoricalPrices(
              coin.symbol, 
              timeframeDays
            );
            return { ...coin, priceHistory: historicalPrices };
          } catch (error) {
            console.error(`Error fetching historical data for ${coin.symbol}:`, error);
            return coin;
          }
        })
      );
      
      return NextResponse.json({ data: enrichedData });
    }
    
    return NextResponse.json({ data: cryptoData });
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cryptocurrency prices' }, 
      { status: 500 }
    );
  }
}