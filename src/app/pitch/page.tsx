import { Metadata } from 'next';
import PitchClient from './pageClient';

export const metadata: Metadata = {
  title: 'DeepCoin Pitch Deck - AI-Powered DeFi Platform',
  description: 'Revolutionary AI-powered cryptocurrency platform combining advanced prediction algorithms with blockchain integration',
};

export default function PitchPage() {
  return <PitchClient />;
}
