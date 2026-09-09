import { PAYMENT_STATUS } from '@/constants/enums';
import { ERROR_MESSAGES, STATUS_CODE } from '@/constants/messages';
import { AdminPaymentsFilterDTO } from '@/dtos/request/admin/admin.payments.request.dto';
import {  AdminPaymentOverviewResponseDTO, AdminPaymentsResponseDTOwithPagination } from '@/dtos/response/admin/payment.response.dto';

import { IPaymentRepository } from '@/interfaces/repositories/IPayment.repository';
import { IPayoutBatchRepository } from '@/interfaces/repositories/IPayoutBatch.repository';
import { IPayoutLedgerRepository } from '@/interfaces/repositories/IPayoutLedger.repository';
import { IWalletTransactionRepository } from '@/interfaces/repositories/IWallet.transaction.repository';
import { IPaymentsManagementService } from '@/interfaces/services/admin/IPaymentsManagement.service';
import { toPaymentAdminResponseDTO } from '@/mappers/admin/admin.payment.mappers';
import { IPayment } from '@/models/payment.model';


import AppError from '@/utils/AppError';
import { fromZonedTime } from 'date-fns-tz';
import { FilterQuery } from 'mongoose';

export class PaymentsManagementService implements IPaymentsManagementService {
  private _paymentRepo: IPaymentRepository;
  private _walletTransactionRepo:IWalletTransactionRepository;
  private _payoutBatchRepo:IPayoutBatchRepository;
  private _payoutLedgerRepo:IPayoutLedgerRepository;
  

  constructor(paymentRepo: IPaymentRepository,walletTransactionRepo:IWalletTransactionRepository,payoutBatchRepo:IPayoutBatchRepository,payoutLedgerRepo:IPayoutLedgerRepository) {
    this._paymentRepo = paymentRepo;
      this._walletTransactionRepo=walletTransactionRepo;
     this._payoutBatchRepo=payoutBatchRepo;
     this._payoutLedgerRepo=payoutLedgerRepo;
  }

// --------------------------payments OVERview----------
  async getPaymentsOverview(dateRange:{startDate:Date,endDate:Date}):Promise<AdminPaymentOverviewResponseDTO> {
  const grossRevenue = await this._paymentRepo.sumByStatus(PAYMENT_STATUS.SUCCESS, dateRange);
  const totalRefunds = await this._walletTransactionRepo.sumRefunds(dateRange); // from wallet_transaction
  const netRevenue = grossRevenue - totalRefunds;

  const totalPayouts = await this._payoutBatchRepo.sumNetAmount(dateRange);
  const pendingPayoutLiability =await this._payoutLedgerRepo.sumPayableAcrossAllTrainers();

  return {
    range: dateRange ?? null,
    grossRevenue,
    totalRefunds,
    netRevenue,
    totalPayouts,
    commissionEarned: netRevenue - totalPayouts-pendingPayoutLiability,
    pendingPayoutLiability
  };
}



  //-----------find payments--by admin----
  async getAllPayments(timezone:string,filter: AdminPaymentsFilterDTO): Promise<AdminPaymentsResponseDTOwithPagination> {    
    const { page, limit, status, date, search } = filter;
    const skip = (page - 1) * limit;

    const query: FilterQuery<IPayment> = {};   
    if (status && status !== 'all') {
      query.status = status;
    }
    if (search) query.paymentMethod = { $regex: search, $options: 'i' };
    if (date) {         
      //convert to utc date
      const startDay = fromZonedTime(`${date}T00:00:00`, timezone);
      const endofDay = fromZonedTime(`${date}T23:59:59`, timezone);
      query.date = { $gte: startDay, $lte: endofDay };
    }
     const [paymentsData, totalCount] = await Promise.all(
      [this._paymentRepo.findAllPayments(query, { skip, limit }),
       this._paymentRepo.count(query)]);
     if (!paymentsData) throw new AppError(ERROR_MESSAGES.GENERAL.NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);
        console.log('payment pagination  ->',page, Math.floor(totalCount / limit));
    const payments = paymentsData.map((payment) => toPaymentAdminResponseDTO(payment));
    return {
      payments,
      total: totalCount,
      totalPages: Math.floor(totalCount / limit),
      page,
    };
    
   
    
  }
}
