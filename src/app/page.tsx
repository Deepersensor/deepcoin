import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-24">
      <div className="z-10 w-full max-w-5xl flex flex-col items-center justify-center text-sm">
        <h1 className="text-5xl font-bold mb-8 text-center">DeepCoin AI</h1>
        <p className="text-xl mb-12 text-center max-w-2xl">
          Advanced cryptocurrency analytics and predictions powered by artificial intelligence
        </p>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mb-16">
          <Link href="/predictions" className="group p-6 border rounded-lg hover:border-blue-500 transition-all">
            <h2 className="text-2xl font-semibold mb-3">
              AI Predictions <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">→</span>
            </h2>
            <p className="text-sm opacity-80">
              Get AI-powered price predictions for all major cryptocurrencies
            </p>
          </Link>

          <Link href="/trading" className="group p-6 border rounded-lg hover:border-blue-500 transition-all">
            <h2 className="text-2xl font-semibold mb-3">
              Smart Trading <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">→</span>
            </h2>
            <p className="text-sm opacity-80">
              Trade cryptocurrencies with AI-assisted insights and automated strategies
            </p>
          </Link>

          <Link href="/market" className="group p-6 border rounded-lg hover:border-blue-500 transition-all">
            <h2 className="text-2xl font-semibold mb-3">
              Market Analysis <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">→</span>
            </h2>
            <p className="text-sm opacity-80">
              Comprehensive market data and historical analysis tools
            </p>
          </Link>

          <Link href="/portfolio" className="group p-6 border rounded-lg hover:border-blue-500 transition-all">
            <h2 className="text-2xl font-semibold mb-3">
              Portfolio Management <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">→</span>
            </h2>
            <p className="text-sm opacity-80">
              Track and optimize your crypto portfolio with AI recommendations
            </p>
          </Link>

          <Link href="/forex" className="group p-6 border rounded-lg hover:border-blue-500 transition-all">
            <h2 className="text-2xl font-semibold mb-3">
              Forex Trading <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">→</span>
            </h2>
            <p className="text-sm opacity-80">
              Trade major forex pairs with AI predictive models
            </p>
          </Link>

          <Link href="/advisor" className="group p-6 border rounded-lg hover:border-blue-500 transition-all">
            <h2 className="text-2xl font-semibold mb-3">
              AI Advisor <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">→</span>
            </h2>
            <p className="text-sm opacity-80">
              Get personalized investment advice from our AI financial advisor
            </p>
          </Link>
        </section>
        
        <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
          <div className="p-4 flex flex-col items-center lg:items-start">
            <h3 className="text-lg font-bold mb-2">Real-time data</h3>
            <p className="text-sm opacity-70">
              Using Blockchair API for accurate, up-to-the-minute blockchain data
            </p>
          </div>
          
          <div className="p-4 flex flex-col items-center lg:items-start">
            <h3 className="text-lg font-bold mb-2">AI Predictions</h3>
            <p className="text-sm opacity-70">
              Advanced machine learning models for price and trend predictions
            </p>
          </div>
          
          <div className="p-4 flex flex-col items-center lg:items-start">
            <h3 className="text-lg font-bold mb-2">Multi-asset</h3>
            <p className="text-sm opacity-70">
              Support for cryptocurrencies, tokens, and forex markets
            </p>
          </div>
          
          <div className="p-4 flex flex-col items-center lg:items-start">
            <h3 className="text-lg font-bold mb-2">Secure</h3>
            <p className="text-sm opacity-70">
              Built with security-first principles and data protection
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
