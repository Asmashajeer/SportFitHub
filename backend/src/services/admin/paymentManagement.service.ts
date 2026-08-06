import { ERROR_MESSAGES, STATUS_CODE } from '@/constants/messages';

import { AdminPaymentsFilterDTO } from '@/dtos/request/admin/admin.payments.request.dto';
import { AdminPaymentsResponseDTOwithPagination, PaymentAdminResponseDTO, } from '@/dtos/response/admin/payment.response.dto';
import { IPaymentRepository } from '@/interfaces/repositories/IPayment.repository';
import { IPaymentsManagementService } from '@/interfaces/services/admin/IPaymentsManagement.service';
import { toPaymentAdminResponseDTO } from '@/mappers/admin/admin.payment.mappers';
import { IPayment } from '@/models/payment.model';

import AppError from '@/utils/AppError';
import { FilterQuery } from 'mongoose';

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
