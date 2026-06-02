import { IWallet } from "@/models/wallet.model";
import { BaseRepository } from "./base.repository";
import { ClientSession, Model, Types } from "mongoose";
import { IWalletRepository } from "@/interfaces/repositories/IWallet.repository";

export class WalletRepository extends BaseRepository<IWallet> implements IWalletRepository {
  constructor(model: Model<IWallet>) {
    super(model);
  }
  async findByUserId(userId: string|Types.ObjectId): Promise<IWallet> {
    const wallet = await this.model.findOne({userId:userId});
    if (wallet) return wallet;
    return this.model.create({
      userId: new Types.ObjectId(userId),
      balance: 0,
    });
  }
  async addToWallet(userId:string|Types.ObjectId,amount:number,session:ClientSession):Promise<IWallet>{
    await this.findByUserId(userId);
    const wallet =await this.model.findOneAndUpdate({userId:userId},{$inc:{balance:amount}},{ new: true ,session})
    return wallet;
  }
  async deductFromWallet(userId:string|Types.ObjectId,amount:number,session:ClientSession):Promise<IWallet>{
    await this.findByUserId(userId);
   
    const wallet =await this.model.findOneAndUpdate({userId:userId},{$inc:{balance:-amount}},{ new: true ,session})
    return wallet;
  }
}