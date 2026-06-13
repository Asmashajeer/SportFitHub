import { IPayment } from "@/models/payment.model"
import { formatInTimeZone } from 'date-fns-tz';
import { getTimezone } from "@/context/timezone.context";
export const toUserPaymentResponseDTO=(payment:IPayment)=>{
    const timezone = getTimezone();
    return{
        id:payment._id.toString(),
        bookingId:payment.bookingId.toString(),  
        bookingUId:payment.bookingUId,      
        userId: payment.userId.toString()   ,     
        transactionId:payment.transactionId  ,
        invoiceId:payment.invoiceId,        
        amount:  payment.amount  ,           
        currency:payment.currency   ,           
        paymentMethod:payment.paymentMethod   ,    
        receiptUrl:payment. receiptUrl ?? undefined,      
        discount: payment.discount ?? undefined,
        status: payment.status,
        createdAt:formatInTimeZone(payment.createdAt,timezone, 'yyyy-MM-dd HH:mm:ssXXX')
    }
}