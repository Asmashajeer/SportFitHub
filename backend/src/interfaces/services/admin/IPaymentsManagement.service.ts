import { PaymentAdminResponseDTO } from "@/dtos/response/admin/payment.response.dto";
import { IPayment } from "@/models/payment.model";
import { FilterQuery } from "mongoose";

export interface IPaymentsManagementService{
getAllPayments(): Promise<PaymentAdminResponseDTO[]>
}