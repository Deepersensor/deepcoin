'use client';

import { useState } from 'react';
import { OKXDEXWidget } from '@okxweb3/dex-widget';

export default function OKXWidget() {
  const [widgetConfig] = useState({
    theme: 'dark',
    platform: 'dex',
    width: '100%',
    height: '600px',
    // Add your configuration here
  });

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">OKX DEX Widget Integration</h1>
        <p className="text-gray-400 mb-8">
          Direct access to OKX DEX for seamless trading within DeepCoin
        </p>
        
        <div className="bg-gray-900 rounded-lg p-6">
          <OKXDEXWidget
            {...widgetConfig}
          />
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Powered by OKX DEX API •  Demo
          </p>
        </div>
      </div>
    </div>
  );
}