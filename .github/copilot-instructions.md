# Copilot Instructions for DeepCoin

## Project Overview
DeepCoin is an AI-powered DeFi platform built with Next.js, integrating advanced AI prediction algorithms, multi-chain wallet support, and real-time trading features. Key integrations include OKX DEX, Solana, Aptos, and the NERO Paymaster for gas sponsorship.

## Architecture & Key Components
- **Frontend**: Located in `src/app/` and `src/components/`, using Next.js routing and React components. Pages for trading, predictions, dashboard, and wallet management.
- **API Layer**: Serverless API routes in `src/app/api/` for authentication, price predictions, and arbitrage logic.
- **AI Logic**: Prediction models and copilot logic in `src/lib/ai/` and `src/lib/services/`.
- **Wallets**: Multi-chain wallet connection logic in `src/components/wallet/` and provider in `src/provider/WalletProvider.tsx`.
- **NERO Paymaster**: Core logic in `src/utils/neroPaymaster.ts` and React hook in `src/hooks/useNeroPaymaster.ts`.
- **Smart Contracts**: Reference contracts in `contracts/` and external assetchain repo.

## Developer Workflows
- **Install dependencies**: `npm install` (or `pnpm install`, `yarn`, `bun`)
- **Set up environment**: Copy `.env.example` to `.env.local` and add API keys (OKX, Blockchair, NERO, Solana RPC)
- **Run dev server**: `npm run dev` (or `pnpm dev`, etc.)
- **Deploy**: Use Vercel for easiest deployment

## NERO Paymaster Integration
- Use environment variables: `NEXT_PUBLIC_NERO_API_ENDPOINT`, `NERO_API_KEY` (server-side only)
- Core utility: `/src/utils/neroPaymaster.ts` implements JSON-RPC methods (`pm_supported_tokens`, `pm_sponsor_userop`, `pm_entrypoints`)
- React hook: `/src/hooks/useNeroPaymaster.ts` for easy integration, token caching, and error/loading states
- Payment types: Type 0 (free), Type 1 (prepay ERC20), Type 2 (postpay ERC20). See `/docx/nero/payment_types.md` for details
- Error handling: Follow `/docx/nero/error_handling.md` for JSON-RPC and AAxx error codes
- Best practices: Cache supported tokens, never expose API keys client-side, use UserOpSDK, track sponsorship usage

## Project-Specific Patterns
- **Do not edit config files directly** (e.g., `package.json`). List required edits separately.
- **Error handling**: Use structured error codes and messages from NERO and EntryPoint contracts
- **Token caching**: Implement 5-minute cache for supported tokens in paymaster logic
- **Wallet integration**: Check paymaster support during wallet connection, store support info in DB

## External Integrations
- **OKX DEX**: Use `@okxweb3/dex-widget` and related packages
- **Blockchair API**: For real-time blockchain data
- **Solana Wallet Adapter**: For multi-chain wallet support
- **Assetchain contracts**: Reference external repo for smart contracts

## Example Usage
```typescript
const { supportedTokens, sponsorUserOp, loading, error } = useNeroPaymaster({ apiKey: 'your_api_key' });
const tokens = await supportedTokens(walletAddress);
const sponsoredOp = await sponsorUserOp(userOperation, { type: 0 });
```

## Key References
- `/src/utils/neroPaymaster.ts`, `/src/hooks/useNeroPaymaster.ts`, `/docx/nero/*`
- `/src/components/wallet/`, `/src/provider/WalletProvider.tsx`
- `/src/lib/ai/`, `/src/lib/services/`, `/src/lib/api/`
- `/contracts/`, [Assetchain contract repo](https://github.com/Deepersensor/assetchaincontracts)

---
For unclear or incomplete sections, please provide feedback to improve these instructions.
