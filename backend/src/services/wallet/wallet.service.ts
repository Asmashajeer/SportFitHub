import { IWalletRepository } from "@/interfaces/repositories/IWallet.repository";

import { IWalletService } from "@/interfaces/services/wallet/IWallet.service";
import { IWallet } from "@/models/wallet.model";
import AppError from "@/utils/AppError";


import { ClientSession } from "mongoose";

export class WalletService implements IWalletService{
   
    private _walletRepo:IWalletRepository;
   
    constructor(walletRepository:IWalletRepository){
        this._walletRepo=walletRepository
       
    }
    async findWallet(userId: string): Promise<IWallet> {
        const wallet = await this._walletRepo.findByUserId(userId);
        if (wallet) return wallet;
       
    }
    async addToWallet(userId: string,amount:number,session:ClientSession): Promise<IWallet> {        
        const wallet = await this._walletRepo.addToWallet(userId,amount,session);
        console.log("wallet balance",wallet);
        if (wallet) return wallet;
    }   
    async deductFromWallet(userId: string,amount:number,session:ClientSession): Promise<IWallet> {   
       
        const currentWallet=await this.findWallet(userId);
        if (  currentWallet.balance<amount) {
            throw new AppError("No enough balance");
        }   
        const wallet = await this._walletRepo.deductFromWallet(userId,amount,session);
       return wallet
    }  
}