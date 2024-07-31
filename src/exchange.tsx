import axios from 'axios';
import { PrivateKeyAccount } from 'viem';

export class API {
  constructor(public baseUrl: string) {}

  public async post<T>(urlPath: string, payload = {}): Promise<T> {
    try {
      const response = await axios.post(this.baseUrl + urlPath, payload, {});
      return response.data as T;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export class Exchange extends API {
  public static create(baseUrl: string): Exchange {
    return new Exchange(baseUrl);
  }

  constructor(baseUrl: string) {
    super(baseUrl);
  }

  async postAction(action: any, signature: any, nonce: any) {
    console.log(action, signature, nonce);
    const payload = {
      action,
      nonce,
      signature,
    };
    return await this.post('/exchange', payload);
  }
}
