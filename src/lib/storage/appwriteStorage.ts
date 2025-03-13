import { databases } from '../appwrite/client';
import { ID, Query } from 'appwrite';

export class AppwriteStorage {
  private readonly collectionId: string;
  private readonly databaseId: string;

  constructor(databaseId: string, collectionId: string) {
    this.databaseId = databaseId;
    this.collectionId = collectionId;
  }

  async get(key: string) {
    try {
      const document = await databases.getDocument(
        this.databaseId,
        this.collectionId,
        key
      );
      return document.value;
    } catch (error) {
      return undefined;
    }
  }

  async set(key: string, value: any) {
    try {
      // Try to update if exists
      await databases.updateDocument(
        this.databaseId,
        this.collectionId,
        key,
        { value }
      );
      return true;
    } catch {
      // If doesn't exist, create
      try {
        await databases.createDocument(
          this.databaseId,
          this.collectionId,
          key,
          { value }
        );
        return true;
      } catch (error) {
        console.error('Failed to store data:', error);
        return false;
      }
    }
  }

  async delete(key: string) {
    try {
      await databases.deleteDocument(
        this.databaseId,
        this.collectionId,
        key
      );
      return true;
    } catch (error) {
      console.error('Failed to delete data:', error);
      return false;
    }
  }

  async clear() {
    try {
      const documents = await databases.listDocuments(
        this.databaseId,
        this.collectionId
      );

      const deletePromises = documents.documents.map(doc => 
        databases.deleteDocument(this.databaseId, this.collectionId, doc.$id)
      );
      
      await Promise.all(deletePromises);
      return true;
    } catch (error) {
      console.error('Failed to clear storage:', error);
      return false;
    }
  }
}
