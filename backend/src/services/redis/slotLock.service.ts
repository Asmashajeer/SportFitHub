
import { ISlotLockService } from "@/interfaces/services/booking/ISlotLock.service";
import RedisClientService from "./redisClient.service";


class SlotLockService implements ISlotLockService{
    private readonly _redisClientService:RedisClientService;
    constructor(redisClientService:RedisClientService){
        this._redisClientService=redisClientService;
    }

    async lockSlot(lockKey:string, userId: string, ttlSeconds: number = 900): Promise<boolean> {
        // const lockKey = `lock:slot:${sessionId}:${date}:${slotId}`;
        const client = this._redisClientService.getClient();

        const result = await (await client).SET(lockKey, userId, { EX: ttlSeconds, NX: true })

        return result === 'OK';
    }


    // Refresh the lock periodically on checkout page
   async refreshLock(lockKey:string, userId: string, ttlSeconds: number = 900): Promise<void> {
        // const lockKey = `lock:slot:${sessionId}:${date}:${slotId}`;
        const client = this._redisClientService.getClient();

        //  verify it's the same user before refreshing
        const currentOwner = await  (await client).get(lockKey);
        if (currentOwner === userId) {
            await (await client).setEx(lockKey,ttlSeconds, userId  );
        }
  }

    //   Release the lock
    async releaseLock(lockKey:string): Promise<void> {
        // const lockKey = `lock:slot:${sessionId}:${date}:${slotId}`;
        const client = this._redisClientService.getClient();
        await (await client).del(lockKey);
    }

    //get owner of lock
    async getLockOwner(lockKey:string): Promise<string | null> {
        //   const lockKey = `lock:slot:${sessionId}:${date}:${slotId}`;
        const client = await this._redisClientService.getClient();
        return client.get(lockKey) as Promise<string | null>;
    }

    //chseck if  locked by anyone
    async isLocked(lockKey:string):Promise<boolean>{
       const owner=await this.getLockOwner(lockKey);
        return owner!==null;
    }


}
export default SlotLockService;