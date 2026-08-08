import { PaymentAdminResponseDTO } from "@/dtos/response/admin/payment.response.dto";


export interface IPaymentsManagementService{
getAllPayments(): Promise<PaymentAdminResponseDTO[]>
}