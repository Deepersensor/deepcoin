'use client';

import { useState, useEffect } from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

// Types for our component
interface Prediction {
  currentPrice: number;
  predictedPrice: number;
  percentageChange: number;
  confidence: 'low' | 'medium' | 'high';
  factors: string[];
}

// Sample coins for the dropdown
const popularCoins = ['BTC', 'ETH', 'SOL', 'BNB', 'XRP', 'ADA', 'DOGE', 'DOT'];

export default function PredictionsPage() {
  const [selectedCoin, setSelectedCoin] = useState('BTC');
  const [timeframe, setTimeframe] = useState<'1d' | '7d' | '30d' | '90d' | '1y'>('7d');
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch prediction when coin or timeframe changes
  useEffect(() => {
    const fetchPrediction = async () => {
      setLoading(true);
      setError('');
      
      try {
        const response = await fetch(`/api/crypto/predictions?symbol=${selectedCoin}&timeframe=${timeframe}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch prediction');
        }
        
        const result = await response.json();
        setPrediction(result.data);
      } catch (err) {
        console.error('Error fetching prediction:', err);
        setError('Failed to generate prediction. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPrediction();
  }, [selectedCoin, timeframe]);

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">AI Price Predictions</h1>
      
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div>
          <label htmlFor="coin-select" className="block text-sm font-medium mb-2">
            Select Cryptocurrency
          </label>
          <select
            id="coin-select"
            value={selectedCoin}
            onChange={(e) => setSelectedCoin(e.target.value)}
            className="p-2 border rounded w-full md:w-48"
          >
            {popularCoins.map((coin) => (
              <option key={coin} value={coin}>{coin}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="timeframe-select" className="block text-sm font-medium mb-2">
            Prediction Timeframe
          </label>
          <select
            id="timeframe-select"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as any)}
            className="p-2 border rounded w-full md:w-48"
          >
            <option value="1d">1 Day</option>
            <option value="7d">1 Week</option>
            <option value="30d">1 Month</option>
            <option value="90d">3 Months</option>
            <option value="1y">1 Year</option>
          </select>
        </div>
      </div>
      
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded mb-4">
          {error}
        </div>
      )}
      
      {!loading && prediction && (
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">{selectedCoin} Price Prediction</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Price:</span>
                  <span className="font-medium">${prediction.currentPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Predicted Price:</span>
                  <span className="font-medium">${prediction.predictedPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Expected Change:</span>
                  <span className={`font-medium flex items-center ${prediction.percentageChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {prediction.percentageChange >= 0 ? 
                      <ArrowUpIcon className="w-4 h-4 mr-1" /> : 
                      <ArrowDownIcon className="w-4 h-4 mr-1" />
                    }
                    {Math.abs(prediction.percentageChange).toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Confidence Level:</span>
                  <span className={`font-medium ${
                    prediction.confidence === 'high' ? 'text-green-600' : 
                    prediction.confidence === 'medium' ? 'text-yellow-600' : 
                    'text-red-600'
                  }`}>
                    {prediction.confidence.charAt(0).toUpperCase() + prediction.confidence.slice(1)}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Influential Factors</h2>
              <ul className="list-disc pl-5 space-y-2">
                {prediction.factors.map((factor, index) => (
                  <li key={index}>{factor}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="border-t pt-4 mt-4">
            <p className="text-sm text-gray-500">
              This prediction uses advanced AI models analyzing market trends, on-chain data, and sentiment analysis.
              Please note that all predictions are estimates and not financial advice.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
