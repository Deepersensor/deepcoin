# DeepCoin - AI-Powered Cryptocurrency Platform

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

## Deployment

The easiest way to deploy this app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.
