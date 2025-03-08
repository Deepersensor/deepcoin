import { NextRequest, NextResponse } from 'next/server';
import { predictionService } from '@/lib/ai/prediction';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const coinSymbol = searchParams.get('symbol');
    const timeframe = searchParams.get('timeframe') as '1d' | '7d' | '30d' | '90d' | '1y';
    
    // Validate required params
    if (!coinSymbol) {
      return NextResponse.json({ error: 'Missing required parameter: symbol' }, { status: 400 });
    }
    
    // Default to 7d if timeframe not provided or invalid
    const validTimeframes = ['1d', '7d', '30d', '90d', '1y'];
    const validatedTimeframe = validTimeframes.includes(timeframe) ? timeframe : '7d';
    
    // Get prediction
    const prediction = await predictionService.getPricePrediction(coinSymbol, validatedTimeframe);
    
    return NextResponse.json({ data: prediction });
  } catch (error) {
    console.error('Error generating prediction:', error);
    return NextResponse.json(
      { error: 'Failed to generate prediction' }, 
      { status: 500 }
    );
  }
}
