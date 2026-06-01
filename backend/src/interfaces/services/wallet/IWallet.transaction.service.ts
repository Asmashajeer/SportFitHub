
import { WalletTransactionResponseDTO } from "@/dtos/response/wallet/wallet.transaction.response.DTO";
import { IWalletTransaction } from "@/models/wallet.transaction.model";
import { ClientSession } from "mongoose";

export interface IWalletTransactionService{
   addTransaction(data:Partial<IWalletTransaction>,session:ClientSession): Promise<WalletTransactionResponseDTO>
   getTransactions(userId:string): Promise<WalletTransactionResponseDTO[]>
}