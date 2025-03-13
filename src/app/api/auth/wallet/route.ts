import { NextRequest, NextResponse } from 'next/server';
import { appwriteConfig, databases } from '@/lib/appwrite/client';
import { ID, Query } from 'appwrite';
import { WalletType } from '@/lib/utils/wallet';

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, walletName, walletType, message, signature } = await request.json();

    if (!walletAddress || !walletName || !walletType) {
      return NextResponse.json(
        { error: 'Wallet address, name, and type are required' },
        { status: 400 }
      );
    }

    // Validate wallet type
    if (!Object.values(WalletType).includes(walletType)) {
      return NextResponse.json(
        { error: 'Invalid wallet type' },
        { status: 400 }
      );
    }

    try {
      const existingWallets = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.walletCollectionId,
        [Query.equal('address', walletAddress)]
      );

      if (existingWallets.total === 0) {
        // Create new wallet document
        await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.walletCollectionId,
          ID.unique(),
          {
            address: walletAddress,
            name: walletName,
            walletType: walletType,
            lastConnected: new Date().toISOString()
          }
        );
      } else {
        // Update last connected timestamp
        await databases.updateDocument(
          appwriteConfig.databaseId,
          appwriteConfig.walletCollectionId,
          existingWallets.documents[0].$id,
          {
            lastConnected: new Date().toISOString(),
            name: walletName, // Update name in case user switched wallets with same address
            walletType: walletType // Update type in case that changed
          }
        );
      }

      return NextResponse.json({
        success: true,
        walletAddress,
        walletType
      });
    } catch (error) {
      console.error('Error processing wallet authentication:', error);
      return NextResponse.json(
        { error: 'Failed to authenticate wallet' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in wallet auth route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
