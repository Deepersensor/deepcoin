import { NextRequest, NextResponse } from 'next/server';
import { appwriteConfig, databases } from '@/lib/appwrite/client';
import { ID, Query } from 'appwrite';
import { WalletType } from '@/lib/utils/wallet';
import { pmSupportedTokens, createMinimalUserOp } from '@/utils/neroPaymaster';

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, walletName, walletType, message, signature, checkPaymaster } = await request.json();

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

    let paymasterInfo = null;
    
    // Check paymaster support if requested
    if (checkPaymaster) {
      try {
        const apiKey = process.env.NERO_API_KEY;
        if (apiKey) {
          const userOp = createMinimalUserOp(walletAddress);
          paymasterInfo = await pmSupportedTokens(userOp, apiKey);
        }
      } catch (error) {
        console.warn('Failed to check paymaster support:', error);
        // Continue without paymaster info - not critical for auth
      }
    }

    try {
      const existingWallets = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.walletCollectionId,
        [Query.equal('address', walletAddress)]
      );

      const walletData = {
        address: walletAddress,
        name: walletName,
        walletType: walletType,
        lastConnected: new Date().toISOString(),
        ...(paymasterInfo && {
          paymasterSupported: true,
          freeGasAvailable: paymasterInfo.freeGas,
          supportedTokensCount: paymasterInfo.tokens.length
        })
      };

      if (existingWallets.total === 0) {
        // Create new wallet document
        await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.walletCollectionId,
          ID.unique(),
          walletData
        );
      } else {
        // Update existing wallet
        await databases.updateDocument(
          appwriteConfig.databaseId,
          appwriteConfig.walletCollectionId,
          existingWallets.documents[0].$id,
          walletData
        );
      }

      return NextResponse.json({
        success: true,
        walletAddress,
        walletType,
        paymasterInfo
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
