import axios from 'axios';

/**
 * Blockchair API client
 * Documentation: https://blockchair.com/api
 */
export class BlockchairClient {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.blockchair.com';

  constructor() {
    const apiKey = process.env.BLOCKCHAIR_API_KEY;
    if (!apiKey) {
      throw new Error('BLOCKCHAIR_API_KEY is not defined in environment variables');
    }
    this.apiKey = apiKey;
  }

  /**
   * Get data for specific blockchain
   */
  async getBlockchainData(chain: string, endpoint: string, params: Record<string, any> = {}) {
    try {
      const response = await axios.get(`${this.baseUrl}/${chain}/${endpoint}`, {
        params: {
          ...params,
          key: this.apiKey
        }
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching data from Blockchair API: ${error}`);
      throw error;
    }
  }

  /**
   * Get market data for cryptocurrency
   */
  async getMarketData(coin: string) {
    return this.getBlockchainData(coin, 'stats');
  }

  /**
   * Search across multiple blockchains
   */
  async search(query: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/search`, {
        params: {
          q: query,
          key: this.apiKey
        }
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error searching with Blockchair API: ${error}`);
      throw error;
    }
  }

  /**
   * Get transaction details
   */
  async getTransaction(chain: string, txId: string) {
    return this.getBlockchainData(chain, `transaction/${txId}`);
  }

  /**
   * Get address details and history
   */
  async getAddress(chain: string, address: string) {
    return this.getBlockchainData(chain, `address/${address}`);
  }
}

// Export singleton instance
export const blockchairClient = new BlockchairClient();
