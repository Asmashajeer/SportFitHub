import { STATUS_CODE } from "@/constants/messages";
import { IWalletService } from "@/interfaces/services/wallet/IWallet.service";
import { IWalletTransactionService } from "@/interfaces/services/wallet/IWallet.transaction.service";
import { AuthRequest } from "@/middleware/auth.middleware";
import { NextFunction, Request, Response } from "express";

export class WalletController{
    private _walletService:IWalletService;
    private _walletTransactionService:IWalletTransactionService;
    constructor(walletService:IWalletService,walletTransactionService:IWalletTransactionService){
        this._walletService=walletService;
        this._walletTransactionService=walletTransactionService
    }

   getBalance=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
    const authRequest=req as AuthRequest
    const user=authRequest.user;
    const userId=user.id;
    try {
        const balance=await this._walletService.findWallet(userId);
        res.status(STATUS_CODE.SUCCESS.OK).json(balance);
    } catch (error) {
        next(error);
    }
    
  }
  getTransactions =async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
    const authRequest=req as AuthRequest
    const user=authRequest.user;
    const userId=user.id;
    try {
        const transactions=await this._walletTransactionService.getTransactions(userId);
      
        res.status(STATUS_CODE.SUCCESS.OK).json(transactions);
    } catch (error) {
        next(error);
    }
    
  }

}
