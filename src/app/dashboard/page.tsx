'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
import { Line } from 'react-chartjs-2';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { cryptoApiService, CryptoData } from '@/lib/services/cryptoApi';

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

const timeframes = [
  { value: '1d', label: '24 Hours', days: 1 },
  { value: '7d', label: '7 Days', days: 7 },
  { value: '30d', label: '30 Days', days: 30 },
  { value: '90d', label: '90 Days', days: 90 },
];

const popularCoins = ['BTC', 'ETH', 'SOL', 'BNB', 'XRP', 'ADA', 'DOGE', 'DOT'];

export default function DashboardPage() {
  const [selectedCoin, setSelectedCoin] = useState('BTC');
  const [timeframe, setTimeframe] = useState('7d');
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [conversionAmount, setConversionAmount] = useState('1000');
  const [showApiForm, setShowApiForm] = useState(false);
  const [apiKeys, setApiKeys] = useState([
    { id: 1, name: 'CoinGecko API', status: 'active', expiresIn: 'Free tier' },
    { id: 2, name: 'Blockchair API', status: 'expiring', expiresIn: '3 days' },
  ]);

  // Fetch crypto data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch current prices for popular coins
        const pricesData = await cryptoApiService.getCryptoPrices(popularCoins);
        
        // Fetch historical data for each coin
        const enrichedData = await Promise.all(
          pricesData.map(async (coin) => {
            try {
              const timeframeDays = timeframes.find(t => t.value === timeframe)?.days || 7;
              const historicalPrices = await cryptoApiService.getHistoricalPrices(coin.symbol, timeframeDays);
              return {
                ...coin,
                priceHistory: historicalPrices
              };
            } catch (error) {
              console.error(`Error fetching historical data for ${coin.symbol}:`, error);
              return coin; // Return coin data without historical prices
            }
          })
        );
        
        setCryptoData(enrichedData);
      } catch (error) {
        console.error('Error fetching crypto data:', error);
        setError('Failed to fetch cryptocurrency data. Please try again.');
        
        // Fallback handled by cryptoApiService
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeframe]);

  const selectedCoinData = cryptoData.find(c => c.symbol === selectedCoin);

  const chartData = {
    labels: selectedCoinData?.priceHistory.map((_, i) => i.toString()) || [],
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
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value: any) => `$${Number(value).toLocaleString()}`,
          color: 'rgba(255, 255, 255, 0.7)',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      x: {
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {error && (
        <div className="mb-6 p-4 bg-red-900 bg-opacity-20 border border-red-500 rounded-lg text-red-400">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Converter & API Keys */}
        <div className="space-y-6">
          <motion.div 
            className="bg-gray-900 bg-opacity-60 backdrop-filter backdrop-blur-lg rounded-xl p-6 border border-gray-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-lg font-semibold mb-4">Quick Converter</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Amount (USD)</label>
                <input
                  type="number"
                  value={conversionAmount}
                  onChange={(e) => setConversionAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 bg-opacity-50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  placeholder="1000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Convert to</label>
                <select
                  value={selectedCoin}
                  onChange={(e) => setSelectedCoin(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 bg-opacity-50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                >
                  {popularCoins.map((coin) => (
                    <option key={coin} value={coin}>{coin}</option>
                  ))}
                </select>
              </div>
              {selectedCoinData && (
                <div className="p-4 bg-blue-900 bg-opacity-20 border border-blue-500 rounded-lg">
                  <p className="text-sm text-gray-300">You get approximately:</p>
                  <p className="text-xl font-bold text-blue-400">
                    {(parseFloat(conversionAmount) / selectedCoinData.currentPrice).toFixed(6)} {selectedCoin}
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div 
            className="bg-gray-900 bg-opacity-60 backdrop-filter backdrop-blur-lg rounded-xl p-6 border border-gray-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">API Keys</h3>
              <button
                onClick={() => setShowApiForm(!showApiForm)}
                className="text-cyan-400 hover:text-cyan-300 text-sm"
              >
                + Add New
              </button>
            </div>
            <div className="space-y-3">
              {apiKeys.map((key) => (
                <div
                  key={key.id}
                  className="flex justify-between items-center p-3 bg-gray-800 bg-opacity-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{key.name}</p>
                    <p className="text-sm text-gray-400">Expires: {key.expiresIn}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs ${
                    key.status === 'active' 
                      ? 'bg-green-900 bg-opacity-60 text-green-400' 
                      : 'bg-yellow-900 bg-opacity-60 text-yellow-400'
                  }`}>
                    {key.status}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Charts & Stats */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              className="bg-gray-900 bg-opacity-60 backdrop-filter backdrop-blur-lg rounded-xl p-6 border border-gray-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Select Cryptocurrency</h3>
              </div>
              <select
                value={selectedCoin}
                onChange={(e) => setSelectedCoin(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 bg-opacity-50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
              >
                {popularCoins.map((coin) => (
                  <option key={coin} value={coin}>{coin}</option>
                ))}
              </select>
            </motion.div>

            <motion.div 
              className="bg-gray-900 bg-opacity-60 backdrop-filter backdrop-blur-lg rounded-xl p-6 border border-gray-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Timeframe</h3>
              </div>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 bg-opacity-50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
              >
                {timeframes.map((tf) => (
                  <option key={tf.value} value={tf.value}>{tf.label}</option>
                ))}
              </select>
            </motion.div>
          </div>

          {selectedCoinData && (
            <motion.div 
              className="bg-gray-900 bg-opacity-60 backdrop-filter backdrop-blur-lg rounded-xl p-6 border border-gray-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold">{selectedCoinData.name} ({selectedCoin})</h3>
                  <p className="text-3xl font-bold text-cyan-400">
                    ${selectedCoinData.currentPrice.toLocaleString()}
                  </p>
                  <p className={`text-sm ${selectedCoinData.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {selectedCoinData.change24h >= 0 ? '+' : ''}{selectedCoinData.change24h.toFixed(2)}% (24h)
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Market Cap</p>
                  <p className="font-semibold">${(selectedCoinData.marketCap / 1e9).toFixed(2)}B</p>
                  <p className="text-sm text-gray-400 mt-2">Volume (24h)</p>
                  <p className="font-semibold">${(selectedCoinData.volume24h / 1e9).toFixed(2)}B</p>
                </div>
              </div>
              
              <div className="h-64">
                <Line data={chartData} options={chartOptions} />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
