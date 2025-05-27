'use client';

import { useEffect, useRef } from 'react';

export default function OKXWidget() {
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Prevent multiple script injections
    if (!document.getElementById('okx-dex-widget-script')) {
      const script = document.createElement('script');
      script.id = 'okx-dex-widget-script';
      script.src = 'https://static.okx.com/cdn/dex/widget/plugin.js';
      script.async = true;
      script.onload = () => {
        // @ts-ignore
        if (window.OKXDEXWidget && widgetRef.current) {
          // @ts-ignore
          window.OKXDEXWidget.init({
            container: widgetRef.current,
            theme: 'dark',
            width: '100%',
            height: 600,
            // Add other config options here if needed
          });
        }
      };
      document.body.appendChild(script);
    } else {
      // @ts-ignore
      if (window.OKXDEXWidget && widgetRef.current) {
        // @ts-ignore
        window.OKXDEXWidget.init({
          container: widgetRef.current,
          theme: 'dark',
          width: '100%',
          height: 600,
        });
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">OKX DEX Widget Integration</h1>
        <p className="text-gray-400 mb-8">
          Direct access to OKX DEX for seamless trading within DeepCoin
        </p>
        <div className="bg-gray-900 rounded-lg p-6">
          <div ref={widgetRef} style={{ width: '100%', height: 600 }} />
        </div>
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Powered by OKX DEX API • Demo
          </p>
        </div>
      </div>
    </div>
  );
}