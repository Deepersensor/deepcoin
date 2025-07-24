import { Portfolio, TradeRequest, TradeResponse, Price } from './types';

const RECALL_API_URL = 'https://api.recall.network';
const API_KEY = process.env.RECALL_API_KEY;

async function fetchFromApi(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${RECALL_API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Recall API request failed: ${response.statusText}`);
  }

  return response.json();
}

export async function getPortfolio(): Promise<Portfolio> {
  return fetchFromApi('/agent/portfolio');
}

export async function executeTrade(trade: TradeRequest): Promise<TradeResponse> {
  return fetchFromApi('/trade/execute', {
    method: 'POST',
    body: JSON.stringify(trade)
  });
}

export async function getPrice(token: string): Promise<Price> {
  return fetchFromApi(`/price?token=${token}`);
}
