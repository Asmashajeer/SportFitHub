import { IWallet } from "@/models/wallet.model";

import { ClientSession, Types } from "mongoose";

export interface IWalletRepository {
    findByUserId(userId:string|Types.ObjectId): Promise<IWallet> 
   addToWallet(userId:string|Types.ObjectId,amount:number,session:ClientSession):Promise<IWallet>
}