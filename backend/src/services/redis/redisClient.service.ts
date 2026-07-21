import redisConfig from '@/config/redis.config';
import { createClient, RedisClientType } from 'redis';
class RedisClientService {
  private _client: RedisClientType;
  private isConnected = false;
  constructor() {
    this._client = createClient({
      url: redisConfig.redis_url,
    });

    this._client.on('error', (error) => {
      console.error('Redis client Error', error);
      this.isConnected = false;
    });
    this._client.on('connect', () => {
      console.log('Redis Client connected');
      this.isConnected = true;
    });
  }

  async connect(): Promise<void> {
    if (!this.isConnected) await this._client.connect();
  }
  async disconnect(): Promise<void> {
    if (this.isConnected) await this._client.quit();
  }
  async getClient(): Promise<RedisClientType> {
    return this._client;
  }
  get connected(): boolean {
    return this.isConnected;
  }
  async get(key: string): Promise<string | null> {
    try {
      const value = await this._client.get(key);
      return value as string;
    } catch (err) {
      console.error('Redis GET error:', err);
      return null;
    }
  }
}

export default RedisClientService;

//

// async set(key:string,seconds:number,value:string):Promise<boolean>{
//     try {
//         await this._client.setEx(key,seconds,value);
//         return true;
//     } catch (error) {
//          console.error('Redis SETEX error:', error);
//          return false;
//     }
// }

// async del(key:string):Promise<void>{
//     try {
//         await this._client.del(key);
//     } catch (error) {
//          console.error('Redis DEL error:', error);
//     }
// }
