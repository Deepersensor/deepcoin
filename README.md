# DeepCoin - AI-Powered Cryptocurrency Platform

**DeepCoin** is a comprehensive AI-powered DeFi platform eligible for multiple hackathons, combining advanced AI prediction algorithms with blockchain integrations for **OKX Solana Accelerate Hackathon** and **NextAIHack 1.0**.

## 🏆 Hackathon Eligibility

### OKX Solana Accelerate Hackathon
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

### NextAIHack 1.0
#### 🌐 Assetchain Integration
- **Native Assetchain Support**: Full Web3 integration with Assetchain blockchain
- **AI Asset Analysis**: Real-time AI-powered analysis of Assetchain tokens via `/api/nextai/assetchain`
- **Smart Contract Intelligence**: AI recommendations for safe contract interactions
- **Gas Optimization**: AI-powered transaction timing for optimal gas fees

#### 🤖 NextAI Copilot Features
- **Web3 Portfolio Analysis**: Comprehensive portfolio health and diversification analysis
- **DeFi Strategy Generation**: Risk-based AI strategies for Assetchain DeFi protocols
- **Market Insights**: Real-time AI insights specific to Assetchain ecosystem
- **Cross-chain Bridge Intelligence**: AI recommendations for optimal cross-chain operations

## Features

- **AI-Powered Price Predictions**: Get price forecasts for all major cryptocurrencies
- **Smart Trading**: AI-assisted trading insights and automated strategies
- **Market Analysis**: Comprehensive data and historical analysis tools
- **Portfolio Management**: Track and optimize your crypto investments
- **Forex Trading**: Trade major forex pairs with AI predictive models
- **AI Financial Advisor**: Get personalized investment advice

## Getting Started

### 🚀 Quick Start (OKX Hackathon)
1. **Install OKX dependencies**: 
   ```bash
   npm install @okxweb3/dex-widget @solana/web3.js @solana/wallet-adapter-react @solana/wallet-adapter-wallets @solana/wallet-adapter-react-ui
   ```
2. **Set up environment variables** (OKX API keys, Solana RPC)
3. **Run development server**: `npm run dev`
4. **Explore OKX features**: Visit `/okx` for the hackathon dashboard

### 🤖 Quick Start (NextAIHack)
1. **Install Assetchain dependencies**:
   ```bash
   npm install @assetchain/sdk web3 @types/web3
   ```
2. **Set up Assetchain RPC** in environment variables
3. **Run development server**: `npm run dev`
4. **Explore NextAI features**: Visit `/nextai` for the AI-powered Assetchain dashboard

### 📱 Social Media Requirements (NextAIHack)
- **Tag**: @nextbridgeafric in all posts
- **Hashtags**: #NextAIHack #Assetchain
- **Post project announcement on Day 1**
- **Share progress updates with screenshots**
- **Final submission announcement with live demo link**

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
- [OKX DEX API](https://www.okx.com/docs-v5/en/)
- [Solana Wallet Adapter]()


## Deployment

The easiest way to deploy this app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.
