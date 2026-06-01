export interface ISlotLockService{
    lockSlot(lockKey: string, userId: string, ttlSeconds: number): Promise<boolean>
    refreshLock(lockKey: string, userId: string, ttlSeconds: number ): Promise<void>
    releaseLock(lockKey: string): Promise<void> 
    getLockOwner(lockKey: string): Promise<string | {}>
    isLocked(lockKey: string):Promise<boolean>
}