'use client';

import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { ArrowUpIcon, ArrowDownIcon, PlusIcon, KeyIcon } from '@heroicons/react/24/solid';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface CryptoData {
  symbol: string;
  name: string;
  currentPrice: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  priceHistory: number[];
  predictedPrice: number;
  predictionAccuracy: number;
}

const timeframes = [
  { value: '1d', label: '24 Hours' },
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
  { value: '90d', label: '90 Days' },
  { value: '1y', label: '1 Year' },
];

export default function DashboardPage() {
  const [selectedCoin, setSelectedCoin] = useState('BTC');
  const [timeframe, setTimeframe] = useState('7d');
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [conversionAmount, setConversionAmount] = useState('1000');
  const [showApiForm, setShowApiForm] = useState(false);
  const [apiKeys, setApiKeys] = useState([
    { id: 1, name: 'Blockchair API', status: 'active', expiresIn: '25 days' },
    { id: 2, name: 'CoinAPI', status: 'expiring', expiresIn: '3 days' },
  ]);

  // Fetch crypto data
  useEffect(() => {
    const fetchData = async () => {
      // Simulated API call - replace with real data
      const mockData: CryptoData[] = [
        {
          symbol: 'BTC',
          name: 'Bitcoin',
          currentPrice: 50000,
          change24h: 5.2,
          marketCap: 1000000000000,
          volume24h: 50000000000,
          priceHistory: Array(30).fill(0).map(() => 40000 + Math.random() * 20000),
          predictedPrice: 52000,
          predictionAccuracy: 85,
        },
        // Add more mock data for other coins
      ];
      setCryptoData(mockData);
    };

    fetchData();
  }, [selectedCoin, timeframe]);

  const selectedCoinData = cryptoData.find(c => c.symbol === selectedCoin);

  const chartData = {
    labels: Array(30).fill('').map((_, i) => i.toString()),
    datasets: [
      {
        label: 'Price',
        data: selectedCoinData?.priceHistory || [],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value: any) => `$${value.toLocaleString()}`,
        },
      },
    },
  };

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Converter & API Keys */}
        <div className="space-y-6">
          {/* Conversion Calculator */}
          <motion.div 
            className="bg-gray-900 bg-opacity-60 backdrop-filter backdrop-blur-lg rounded-xl p-6 border border-gray-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-xl font-semibold mb-4">Conversion Calculator</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Amount (USD)</label>
                <input
                  type="number"
                  value={conversionAmount}
                  onChange={(e) => setConversionAmount(e.target.value)}
                  className="cosmic-input"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">To Cryptocurrency</label>
                <select 
                  value={selectedCoin}
                  onChange={(e) => setSelectedCoin(e.target.value)}
                  className="cosmic-input"
                >
                  {cryptoData.map(coin => (
                    <option key={coin.symbol} value={coin.symbol}>{coin.name}</option>
                  ))}
                </select>
              </div>

              {selectedCoinData && (
                <div className="mt-4 p-4 bg-gray-800 bg-opacity-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span>You'll receive:</span>
                    <span className="text-lg font-bold">
                      {(parseFloat(conversionAmount) / selectedCoinData.currentPrice).toFixed(8)} {selectedCoin}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Potential value in 7 days:</span>
                    <span className={`font-medium ${selectedCoinData.predictedPrice > selectedCoinData.currentPrice ? 'text-green-400' : 'text-red-400'}`}>
                      ${((parseFloat(conversionAmount) / selectedCoinData.currentPrice) * selectedCoinData.predictedPrice).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* API Keys Management */}
          <motion.div 
            className="bg-gray-900 bg-opacity-60 backdrop-filter backdrop-blur-lg rounded-xl p-6 border border-gray-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">API Keys</h2>
              <button
                onClick={() => setShowApiForm(!showApiForm)}
                className="p-2 text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <PlusIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              {apiKeys.map(key => (
                <div key={key.id} className="p-3 bg-gray-800 bg-opacity-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <KeyIcon className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="font-medium">{key.name}</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      key.status === 'active' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'
                    }`}>
                      {key.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 mt-1">Expires in {key.expiresIn}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Columns - Charts & Stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Price Chart */}
          <motion.div 
            className="bg-gray-900 bg-opacity-60 backdrop-filter backdrop-blur-lg rounded-xl p-6 border border-gray-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Price Chart</h2>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="cosmic-input w-32"
              >
                {timeframes.map(tf => (
                  <option key={tf.value} value={tf.value}>{tf.label}</option>
                ))}
              </select>
            </div>
            
            <div className="h-[400px]">
              <Line data={chartData} options={chartOptions} />
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedCoinData && (
              <>
                <motion.div 
                  className="bg-gray-900 bg-opacity-60 backdrop-filter backdrop-blur-lg rounded-xl p-6 border border-gray-800"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-lg font-medium mb-4">Price Statistics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Current Price</span>
                      <span className="font-medium">${selectedCoinData.currentPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">24h Change</span>
                      <span className={`font-medium flex items-center ${
                        selectedCoinData.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {selectedCoinData.change24h >= 0 ? 
                          <ArrowUpIcon className="h-4 w-4 mr-1" /> : 
                          <ArrowDownIcon className="h-4 w-4 mr-1" />
                        }
                        {Math.abs(selectedCoinData.change24h)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Market Cap</span>
                      <span className="font-medium">${selectedCoinData.marketCap.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">24h Volume</span>
                      <span className="font-medium">${selectedCoinData.volume24h.toLocaleString()}</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  className="bg-gray-900 bg-opacity-60 backdrop-filter backdrop-blur-lg rounded-xl p-6 border border-gray-800"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="text-lg font-medium mb-4">Prediction Metrics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Predicted Price</span>
                      <span className="font-medium">${selectedCoinData.predictedPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Prediction Accuracy</span>
                      <span className={`font-medium ${
                        selectedCoinData.predictionAccuracy >= 80 ? 'text-green-400' :
                        selectedCoinData.predictionAccuracy >= 60 ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {selectedCoinData.predictionAccuracy}%
                      </span>
                    </div>
                    <div className="mt-4">
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            selectedCoinData.predictionAccuracy >= 80 ? 'bg-green-400' :
                            selectedCoinData.predictionAccuracy >= 60 ? 'bg-yellow-400' :
                            'bg-red-400'
                          }`}
                          style={{ width: `${selectedCoinData.predictionAccuracy}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
