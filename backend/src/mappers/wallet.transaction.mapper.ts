import { IWalletTransaction } from "@/models/wallet.transaction.model"
import { formatInTimeZone } from 'date-fns-tz';
import { getTimezone } from "@/context/timezone.context";

export const toWalletTransactionResponseDTO=(transaction:IWalletTransaction)=>{
    const timezone = getTimezone();
    return{
        id:transaction._id.toString(),
        userId: transaction.userId.toString(),
        transactionType:transaction.transactionType,
        amount:transaction.amount,
        walletTransactionReason :transaction.walletTransactionReason,
        status:transaction.status,
        description:transaction.description,    
        balanceAfter:transaction.balanceAfter,
        // OPTIONAL 
        // when transaction is booking-related 
        bookingId:transaction.bookingId?.toString(),
        bookingSessionId:transaction.bookingSessionId?.toString(),
        createdAt: formatInTimeZone(transaction.createdAt,timezone, 'yyyy-MM-dd HH:mm:ssXXX'),
        updatedAt: formatInTimeZone(transaction.updatedAt,timezone, 'yyyy-MM-dd HH:mm:ssXXX'),
    }
}