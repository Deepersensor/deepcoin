import provider to layout.tsx:


import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { WalletProvider } from "@/provider";

// ... {rest code}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}























Edit src/app/page.tsx & import useWallet to access data from the Provider


'use client'


import {useWallet} from '@aptos-labs/wallet-adapter-react'

export default function Home() {
  const { account, connected, wallet, changeNetwork } = useWallet();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
    {account && account.address}
    </div>
  );
}































For more information about the useWallet hook, you can refer to the following interface:


export interface WalletContextState {
  connected: boolean;
  isLoading: boolean;
  account: AccountInfo | null;
  network: NetworkInfo | null;
  connect(walletName: WalletName): void;
  disconnect(): void;
  wallet: WalletInfo | null;
  wallets?: ReadonlyArray<Wallet | AptosStandardSupportedWallet>;
  signAndSubmitTransaction(transaction: InputTransactionData): Promise<any>;
  signTransaction(
    transactionOrPayload: AnyRawTransaction | Types.TransactionPayload,
    asFeePayer?: boolean,
    options?: InputGenerateTransactionOptions
  ): Promise<AccountAuthenticator>;
  submitTransaction(
    transaction: InputSubmitTransactionData
  ): Promise<PendingTransactionResponse>;
  signMessage(message: SignMessagePayload): Promise<SignMessageResponse>;
  signMessageAndVerify(message: SignMessagePayload): Promise<boolean>;
  changeNetwork(network: Network): Promise<AptosChangeNetworkOutput>;
}