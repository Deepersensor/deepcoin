'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArbitrageOpportunity, TokenPair } from '@/lib/services/okxDex';
import { TradingStrategy, AIInsight } from '@/lib/ai/okxCopilot';

export default function OKXDashboard() {
  const [arbitrageOps, setArbitrageOps] = useState<ArbitrageOpportunity[]>([]);
  const [tradingStrategies, setTradingStrategies] = useState<TradingStrategy[]>([]);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'arbitrage' | 'ai' | 'insights'>('arbitrage');

  useEffect(() => {
    fetchOKXData();
  }, []);

  const fetchOKXData = async () => {
    try {
      setLoading(true);
      
      // Fetch arbitrage opportunities
      const arbResponse = await fetch('/api/okx/arbitrage');
      const arbData = await arbResponse.json();
      if (arbData.success) {
        setArbitrageOps(arbData.opportunities);
      }
      
      // Fetch AI insights
      const insightsResponse = await fetch('/api/okx/copilot');
      const insightsData = await insightsResponse.json();
      if (insightsData.success) {
        setAiInsights(insightsData.insights);
      }
      
      // Mock portfolio for strategy suggestions
      const mockPortfolio = {
        totalValue: 50000,
        assets: [
          { symbol: 'SOL', amount: 100, value: 20000, percentage: 40 },
          { symbol: 'ETH', amount: 8, value: 15000, percentage: 30 },
          { symbol: 'USDC', amount: 15000, value: 15000, percentage: 30 }
        ],
        performance24h: 2.5,
        riskScore: 6
      };
      
      const strategiesResponse = await fetch('/api/okx/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'suggest_strategies', 
          portfolio: mockPortfolio 
        })
      });
      const strategiesData = await strategiesResponse.json();
      if (strategiesData.success) {
        setTradingStrategies(strategiesData.data);
      }
      
    } catch (error) {
      console.error('Failed to fetch OKX data:', error);
    } finally {
      setLoading(false);
    }
  };

  const executeArbitrage = async (opportunity: ArbitrageOpportunity) => {
    try {
      const [baseToken, quoteToken] = opportunity.pair.split('/');
      const response = await fetch('/api/okx/arbitrage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          baseToken,
          quoteToken,
          amount: 1000, // Mock amount
          slippage: 1
        })
      });
      
      const result = await response.json();
      if (result.success) {
        alert(`Trade executed successfully! TX: ${result.txHash}`);
      } else {
        alert(`Trade failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Trade execution failed:', error);
      alert('Trade execution failed');
    }
  };

  const TabButton = ({ tab, label }: { tab: string; label: string }) => (
    <button
      onClick={() => setActiveTab(tab as any)}
      className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
        activeTab === tab
          ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white'
          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
      }`}
    >
      {label}
    </button>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-xl">Loading OKX Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold mb-2">OKX Integration Dashboard</h1>
          <p className="text-gray-400 mb-8">
             Demo: Trading Track (Arbitrage Bot) + AI Track (AI Copilot)
          </p>
          
          {/* Tab Navigation */}
          <div className="flex gap-4 mb-8">
            <TabButton tab="arbitrage" label="🔄 Arbitrage (Trading Track)" />
            <TabButton tab="ai" label="🤖 AI Strategies (AI Track)" />
            <TabButton tab="insights" label="📊 Market Insights" />
          </div>
          
          {/* Arbitrage Tab */}
          {activeTab === 'arbitrage' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid gap-6"
            >
              <div className="bg-gray-900 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">🚀 Live Arbitrage Opportunities</h2>
                <p className="text-gray-400 mb-6">
                  Real-time DEX-CEX arbitrage detection using OKX API
                </p>
                
                {arbitrageOps.length === 0 ? (
                  <p className="text-gray-500">No profitable opportunities found</p>
                ) : (
                  <div className="grid gap-4">
                    {arbitrageOps.map((op, index) => (
                      <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="text-lg font-semibold">{op.pair}</h3>
                            <p className="text-sm text-gray-400">
                              Spread: {op.spreadPercent.toFixed(2)}% • Volume: ${op.volume.toLocaleString()}
                            </p>
                            <div className="flex gap-4 mt-2 text-sm">
                              <span>DEX: ${op.dexPrice.toFixed(4)}</span>
                              <span>CEX: ${op.cexPrice.toFixed(4)}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-lg font-bold ${op.profitable ? 'text-green-400' : 'text-yellow-400'}`}>
                              {op.profitable ? '✅ Profitable' : '⚠️ Monitor'}
                            </div>
                            <button
                              onClick={() => executeArbitrage(op)}
                              className="mt-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm transition-colors"
                              disabled={!op.profitable}
                            >
                              Execute Trade
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
          
          {/* AI Strategies Tab */}
          {activeTab === 'ai' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid gap-6"
            >
              <div className="bg-gray-900 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">🤖 AI-Powered Trading Strategies</h2>
                <p className="text-gray-400 mb-6">
                  Intelligent strategies generated using OKX market data and AI algorithms
                </p>
                
                {tradingStrategies.length === 0 ? (
                  <p className="text-gray-500">No strategies available</p>
                ) : (
                  <div className="grid gap-4">
                    {tradingStrategies.map((strategy, index) => (
                      <div key={index} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-semibold">{strategy.name}</h3>
                            <p className="text-gray-400 mt-1">{strategy.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-400">Confidence</div>
                            <div className="text-lg font-bold text-green-400">{strategy.confidence}%</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <div className="text-sm text-gray-400">Expected Return</div>
                            <div className="font-semibold text-green-400">{strategy.expectedReturn}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-400">Risk Level</div>
                            <div className={`font-semibold ${
                              strategy.riskLevel === 'low' ? 'text-green-400' :
                              strategy.riskLevel === 'medium' ? 'text-yellow-400' : 'text-red-400'
                            }`}>
                              {strategy.riskLevel.toUpperCase()}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-400">Timeframe</div>
                            <div className="font-semibold">{strategy.timeframe}</div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-sm text-gray-400 mb-2">Action Steps:</div>
                          <ul className="space-y-1">
                            {strategy.actions.map((action, actionIndex) => (
                              <li key={actionIndex} className="text-sm">• {action}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
          
          {/* Market Insights Tab */}
          {activeTab === 'insights' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid gap-6"
            >
              <div className="bg-gray-900 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">📊 AI Market Insights</h2>
                <p className="text-gray-400 mb-6">
                  Real-time market analysis powered by AI and OKX data
                </p>
                
                {aiInsights.length === 0 ? (
                  <p className="text-gray-500">No insights available</p>
                ) : (
                  <div className="grid gap-4">
                    {aiInsights.map((insight, index) => (
                      <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className={`text-2xl ${
                                insight.type === 'bullish' ? '🟢' :
                                insight.type === 'bearish' ? '🔴' :
                                insight.type === 'opportunity' ? '🟡' : '⚪'
                              }`}>
                                {insight.type === 'bullish' ? '📈' :
                                 insight.type === 'bearish' ? '📉' :
                                 insight.type === 'opportunity' ? '💡' : '📊'}
                              </span>
                              <h3 className="text-lg font-semibold">{insight.title}</h3>
                            </div>
                            <p className="text-gray-300 mb-2">{insight.description}</p>
                            <div className="flex gap-4 text-sm text-gray-400">
                              <span>Confidence: {insight.confidence}%</span>
                              <span>Timeframe: {insight.timeframe}</span>
                              {insight.actionable && <span className="text-yellow-400">• Actionable</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
          
          {/* Refresh Button */}
          <div className="mt-8 text-center">
            <button
              onClick={fetchOKXData}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 rounded-lg font-medium transition-all duration-300"
            >
              🔄 Refresh OKX Data
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}