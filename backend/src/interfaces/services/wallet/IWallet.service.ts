import { IWallet } from "@/models/wallet.model";
import { ClientSession } from "mongoose";

export interface IWalletService{
  findWallet(userId: string): Promise<IWallet> 
  addToWallet(userId: string,amount:number,session:ClientSession): Promise<IWallet>
}