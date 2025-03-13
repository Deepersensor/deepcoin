import { Client, Account, Storage, Databases } from 'appwrite';

const appwriteEndpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const appwriteProjectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '67cd736e003c06abc247';

export const client = new Client()
  .setEndpoint(appwriteEndpoint)
  .setProject(appwriteProjectId);

export const account = new Account(client);
export const storage = new Storage(client);
export const databases = new Databases(client);

export const appwriteConfig = {
  endpoint: appwriteEndpoint,
  projectId: appwriteProjectId,
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'default',
  userCollectionId: process.env.NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID || 'users',
  walletCollectionId: process.env.NEXT_PUBLIC_APPWRITE_WALLET_COLLECTION_ID || 'wallets',
};
