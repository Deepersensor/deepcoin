'use client';

import { useState, useEffect } from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';
import DashboardLayout from '@/components/layout/DashboardLayout';

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
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">AI Price Predictions</h1>
          <p className="text-gray-400">
            Advanced machine learning models analyze market trends, on-chain data, and sentiment to predict cryptocurrency prices.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-900 bg-opacity-60 backdrop-filter backdrop-blur-lg rounded-xl p-6 border border-gray-800">
            <label htmlFor="coin-select" className="block text-sm font-medium mb-2">
              Select Cryptocurrency
            </label>
            <select
              id="coin-select"
              value={selectedCoin}
              onChange={(e) => setSelectedCoin(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 bg-opacity-50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
            >
              {popularCoins.map((coin) => (
                <option key={coin} value={coin}>{coin}</option>
              ))}
            </select>
          </div>
          
          <div className="bg-gray-900 bg-opacity-60 backdrop-filter backdrop-blur-lg rounded-xl p-6 border border-gray-800">
            <label htmlFor="timeframe-select" className="block text-sm font-medium mb-2">
              Prediction Timeframe
            </label>
            <select
              id="timeframe-select"
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value as any)}
              className="w-full px-3 py-2 bg-gray-800 bg-opacity-50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
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
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
              <p className="text-gray-400">Analyzing market data and generating prediction...</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-900 bg-opacity-20 border border-red-500 text-red-400 p-4 rounded-lg">
            {error}
          </div>
        )}
        
        {!loading && prediction && (
          <div className="bg-gray-900 bg-opacity-60 backdrop-filter backdrop-blur-lg rounded-xl p-8 border border-gray-800">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Prediction Results */}
              <div>
                <h2 className="text-2xl font-semibold mb-6 flex items-center">
                  🔮 {selectedCoin} Price Prediction
                </h2>
                
                <div className="space-y-4">
                  <div className="p-4 bg-blue-900 bg-opacity-20 border border-blue-500 rounded-lg">
                    <p className="text-sm text-gray-300">Current Price</p>
                    <p className="text-2xl font-bold text-blue-400">
                      ${prediction.currentPrice.toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-purple-900 bg-opacity-20 border border-purple-500 rounded-lg">
                    <p className="text-sm text-gray-300">Predicted Price ({timeframe})</p>
                    <p className="text-2xl font-bold text-purple-400">
                      ${prediction.predictedPrice.toLocaleString()}
                    </p>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${
                    prediction.percentageChange >= 0 
                      ? 'bg-green-900 bg-opacity-20 border border-green-500' 
                      : 'bg-red-900 bg-opacity-20 border border-red-500'
                  }`}>
                    <p className="text-sm text-gray-300">Expected Change</p>
                    <p className={`text-2xl font-bold ${
                      prediction.percentageChange >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {prediction.percentageChange >= 0 ? '+' : ''}{prediction.percentageChange.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Prediction Factors */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Key Prediction Factors</h3>
                <div className="space-y-3">
                  {prediction.factors.map((factor, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-800 bg-opacity-50 rounded-lg">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-300">{factor}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-gray-800 bg-opacity-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-300">Confidence Level</span>
                    <span className={`text-sm font-medium ${
                      prediction.confidence === 'high' ? 'text-green-400' :
                      prediction.confidence === 'medium' ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {prediction.confidence.toUpperCase()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        prediction.confidence === 'high' ? 'bg-green-400 w-5/6' :
                        prediction.confidence === 'medium' ? 'bg-yellow-400 w-3/5' : 'bg-red-400 w-2/5'
                      }`}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-700 pt-6 mt-8">
              <div className="bg-yellow-900 bg-opacity-20 border border-yellow-500 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-400">⚠️</span>
                  <p className="text-sm text-yellow-200">
                    <strong>Disclaimer:</strong> These predictions are generated using AI models and historical data. 
                    Cryptocurrency investments are highly volatile and risky. Always do your own research and 
                    never invest more than you can afford to lose.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
