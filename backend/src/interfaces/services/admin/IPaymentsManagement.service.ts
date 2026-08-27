import { AdminPaymentsFilterDTO } from "@/dtos/request/admin/admin.payments.request.dto";
import { AdminPaymentOverviewResponseDTO, AdminPaymentsResponseDTOwithPagination } from "@/dtos/response/admin/payment.response.dto";


export interface IPaymentsManagementService{
    getPaymentsOverview(dateRange:{startDate:Date,endDate:Date}):Promise<AdminPaymentOverviewResponseDTO>
    getAllPayments(timezone:string,filter: AdminPaymentsFilterDTO): Promise<AdminPaymentsResponseDTOwithPagination> 
}