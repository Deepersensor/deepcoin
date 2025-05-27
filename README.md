# DeepCoin - AI-Powered Cryptocurrency Platform

## 🏆 OKX Solana Accelerate Hackathon Submission

### Tracks: Trading & AI

**DeepCoin** combines advanced AI prediction algorithms with OKX DEX integration to create a comprehensive DeFi trading and portfolio management platform eligible for both the **Trading** and **AI** tracks of the OKX Solana Accelerate Hackathon.

#### 🔄 Trading Track Features
- **DEX-CEX Arbitrage Bot**: Real-time detection of price differences between OKX DEX and centralized exchanges
- **Automated Execution**: Smart contract integration for seamless trade execution via `/api/okx/arbitrage`
- **Risk Management**: Built-in slippage protection and position sizing

#### 🤖 AI Track Features  
- **AI Portfolio Analyzer**: Intelligent analysis of crypto holdings with optimization suggestions via `/api/okx/copilot`
- **Smart Trading Strategies**: AI-generated strategies based on risk tolerance and market conditions
- **DeFi Copilot**: AI assistant for optimal swap suggestions and DeFi operations

#### 🔗 OKX Integration
- **OKX DEX API**: Full integration with OKX DEX for token swaps and liquidity data
- **OKX DEX Widget**: Embedded trading interface at `/okx/widget`
- **Real-time Data**: Live market data and arbitrage opportunities
- **Multi-chain Support**: Solana-focused with cross-chain capabilities

### 🚀 Quick Start
1. **Install dependencies**: 
   ```bash
   npm install @solana/web3.js @solana/wallet-adapter-react @solana/wallet-adapter-wallets @solana/wallet-adapter-react-ui
   ```
2. **Set up environment variables** (OKX API keys, Solana RPC)
3. **Run development server**: `npm run dev`
4. **Explore OKX features**: Visit `/okx` for the hackathon dashboard

### 📊 Hackathon Demo Routes
- `/okx` - Main OKX integration dashboard (Trading + AI tracks)
- `/okx/widget` - OKX DEX widget integration
- `/api/okx/arbitrage` - Arbitrage bot API (Trading track)
- `/api/okx/copilot` - AI Copilot API (AI track)

### 🛠️ Technologies Used
- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, Framer Motion
- **Blockchain**: Solana Web3.js, OKX DEX Widget (`@okxweb3/dex-widget`)
- **AI**: Custom prediction algorithms, portfolio optimization
- **APIs**: OKX DEX API integration, real-time market data

### 💡 Hackathon Eligibility
- ✅ **Trading Track**: DEX-CEX arbitrage bot with OKX integration
- ✅ **AI Track**: AI-powered trading strategies and portfolio analysis
- ✅ **OKX API Integration**: Comprehensive use of OKX DEX tools
- ✅ **Solana Focused**: Built for Solana ecosystem with multi-chain support
- ✅ **Innovation**: Novel combination of AI and DeFi trading strategies

---

## 📝 Original Project Description

# synopsis
This is a comprehensive cryptocurrency and financial services platform built with Next.js, leveraging AI for predictive analytics and trading insights. The platform connects to the Blockchair.com API to provide real-time blockchain and cryptocurrency data.

## Features

- **AI-Powered Price Predictions**: Get price forecasts for all major cryptocurrencies
- **Smart Trading**: AI-assisted trading insights and automated strategies
- **Market Analysis**: Comprehensive data and historical analysis tools
- **Portfolio Management**: Track and optimize your crypto investments
- **Forex Trading**: Trade major forex pairs with AI predictive models
- **AI Financial Advisor**: Get personalized investment advice

## Getting Started

First, set up your environment variables:

1. Copy `.env.example` to `.env.local` and add your API keys:

```bash
cp .env.example .env.local
```

2. Install dependencies:

```bash
npm install
# or
yarn 
# or
pnpm install
# or
bun install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## API Integration

This project uses the [Blockchair API](https://blockchair.com/api) to fetch real-time blockchain data. You'll need to sign up for an API key and add it to your `.env.local` file.

## AI Models

The prediction functionality uses machine learning models to analyze:
- Historical price data
- On-chain metrics
- Market sentiment
- Technical indicators
- Cross-asset correlations

## Learn More

To learn more about the tools and technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [Blockchair API Docs](https://blockchair.com/api)
- [TailwindCSS](https://tailwindcss.com/docs)
- [Movement Labs](https://movementlabs.xyz/)

## Deployment

The easiest way to deploy this app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.
