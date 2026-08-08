import { ERROR_MESSAGES, STATUS_CODE } from '@/constants/messages';
import {  PaymentAdminResponseDTO, } from '@/dtos/response/admin/payment.response.dto';
import { IPaymentRepository } from '@/interfaces/repositories/IPayment.repository';
import { IPaymentsManagementService } from '@/interfaces/services/admin/IPaymentsManagement.service';
import { toPaymentAdminResponseDTO } from '@/mappers/admin/admin.payment.mappers';


import AppError from '@/utils/AppError';

export class PaymentsManagementService implements IPaymentsManagementService {
  private _paymentRepo: IPaymentRepository;

  constructor(paymentRepo: IPaymentRepository) {
    this._paymentRepo = paymentRepo;
  }

  //-----------find user payments------
  async getAllPayments(): Promise<PaymentAdminResponseDTO[]> {    
       
    const paymentsData = await this._paymentRepo.findAll();
    if (!paymentsData) throw new AppError(ERROR_MESSAGES.GENERAL.NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);

    const payments = paymentsData.map((payment) => toPaymentAdminResponseDTO(payment));
    return payments;
  }
}
