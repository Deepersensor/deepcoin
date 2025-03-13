import { NextRequest, NextResponse } from 'next/server';
import { appwriteConfig, account, databases } from '@/lib/appwrite/client';
import { ID, Query } from 'appwrite';

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, walletName, message, signature } = await request.json();

    if (!walletAddress || !walletName) {
      return NextResponse.json(
        { error: 'Wallet address and name are required' },
        { status: 400 }
      );
    }

    // Check if user exists
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
            lastConnected: new Date().toISOString()
          }
        );
      }

      return NextResponse.json({
        success: true,
        walletAddress
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
