
import { WalletTransactionResponseDTO } from "@/dtos/response/wallet/wallet.transaction.response.DTO";
import { IWalletRepository } from "@/interfaces/repositories/IWallet.repository";
import { IWalletTransactionRepository } from "@/interfaces/repositories/IWallet.transaction.repository";
import { IWalletTransactionService } from "@/interfaces/services/wallet/IWallet.transaction.service";
import { toWalletTransactionResponseDTO } from "@/mappers/wallet.transaction.mapper";
import { IWalletTransaction } from "@/models/wallet.transaction.model";
import { ClientSession } from "mongoose";

export class WalletTransactionService implements IWalletTransactionService{
    private _walletRepo:IWalletRepository;
    private _walletTransactionRepo:IWalletTransactionRepository;
    constructor(walletRepository:IWalletRepository,walletTransactionRepository:IWalletTransactionRepository){
        this._walletRepo=walletRepository;
        this._walletTransactionRepo=walletTransactionRepository
    }
    async addTransaction(data:Partial<IWalletTransaction>,session:ClientSession): Promise<WalletTransactionResponseDTO> {
        const transaction = await this._walletTransactionRepo.createTransaction(data,session);
        const  walletTransaction=toWalletTransactionResponseDTO(transaction);
       return walletTransaction;
       
    }
    async getTransactions(userId:string): Promise<WalletTransactionResponseDTO[]> {
        const transactions = await this._walletTransactionRepo.findTransaction(userId);
        
        const  walletTransactions=transactions.map((transaction)=>toWalletTransactionResponseDTO(transaction));
       return walletTransactions;
       
    }
}