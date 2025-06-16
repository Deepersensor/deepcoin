import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction
} from '@solana/web3.js';

import {
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getAccount,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
  TokenAccountNotFoundError,
  TokenInvalidAccountOwnerError
} from '@solana/spl-token';

const solEndpoint = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';

let connection: Connection;

// Get Sol Connection
export function getConnection() {
  if (!connection) {
    connection = new Connection(solEndpoint, 'recent');
  }
  return connection;
}

// create transaction
export async function createSolTx(
  fromAddress: string,
  toAddress: string,
  amount: number,
  mintAddress?: string
) {
  try {
    const connection = getConnection();
    const tx = new Transaction();
    const fromPublicKey = new PublicKey(fromAddress);
    const toPublicKey = new PublicKey(toAddress);

    if (!tx.feePayer) {
      tx.feePayer = fromPublicKey;
    }

    if (mintAddress) {
      const tokenPublicKey = new PublicKey(mintAddress);
      const fromTokenPubKey = await getAssociatedTokenAddress(
        tokenPublicKey,
        new PublicKey(fromAddress)
      );
      const toTokenPubKey = await getAssociatedTokenAddress(
        tokenPublicKey,
        new PublicKey(toAddress)
      );

      tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

      let account: any;
      try {
        account = await getAccount(connection, toTokenPubKey);
      } catch (error: unknown) {
        if (
          error instanceof TokenAccountNotFoundError ||
          error instanceof TokenInvalidAccountOwnerError
        ) {
          try {
            tx.add(
              createAssociatedTokenAccountInstruction(
                fromPublicKey,
                toTokenPubKey,
                toPublicKey,
                tokenPublicKey
              )
            );
          } catch (error: unknown) {}
        } else {
          throw error;
        }
      }
      console.log('account', account);

      tx.add(
        createTransferInstruction(
          fromTokenPubKey,
          toTokenPubKey,
          fromPublicKey,
          amount,
          [],
          TOKEN_PROGRAM_ID
        )
      );
    } else {
      tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
      tx.add(
        SystemProgram.transfer({
          fromPubkey: fromPublicKey,
          toPubkey: toPublicKey,
          lamports: amount
        })
      );
    }
    return tx;
  } catch (e) {
    console.error('Error creating transaction:', e);
    return null;
  }
}
