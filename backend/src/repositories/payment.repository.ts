import { ClientSession, FilterQuery } from 'mongoose';
import { IPayment } from '../models/payment.model';
import { BaseRepository } from './base.repository';
import { Model } from 'mongoose';
import { IPaymentRepository } from '@/interfaces/repositories/IPayment.repository';
import { PAYMENT_STATUS } from '@/constants/enums';
import { RevenuePoint } from '@/dtos/response/admin/dashboard.dto';


export class PaymentRepository extends BaseRepository<IPayment> implements IPaymentRepository {
  constructor(model: Model<IPayment>) {
    super(model);
  }
  async createPayment(data: Partial<IPayment>, session: ClientSession) {
    // Note: When using sessions, .create() must take an array
    const [payment] = await this.model.create([data], { session });
    return payment;
  }

  async updatePayment(id: string, data: Partial<IPayment>, session: ClientSession) {
    return await this.model.findByIdAndUpdate(id, data, { session, new: true });
  }

  async findByUserId(filter: FilterQuery<IPayment>): Promise<IPayment[] | null> {
    return await this.model.find(filter);
    // .populate('paymentId' ,'_id receiptUrl' );
  }
  async findAllPayments(filter: FilterQuery<IPayment> = {}, options: { skip: number; limit: number } ): Promise<IPayment[] | null> {
       return await this.model.find(filter)
       .sort({ createdAt: -1 })
       .skip(options?.skip)
       .limit(options?.limit)
       .exec();
     }

  async sumByStatus(status:PAYMENT_STATUS,dateRange:{startDate:Date,endDate:Date}):Promise<number>{
    const match:FilterQuery<IPayment>={status};
    if (dateRange) {
      match.createdAt = { $gte: dateRange.startDate, $lte: dateRange.endDate };
    }

    const result= await this.model.aggregate([
      {$match:match},
      {$group:{_id:null,total:{$sum:'$amount'}}}
    ]);
    return result[0]?.total ?? 0;
  }


  //-----total revenue--
  async sumRevenue(): Promise<number> {
    const result =  await this.model.aggregate([
      { $match: { status: PAYMENT_STATUS.SUCCESS } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    return result[0]?.total || 0;
  }


//-----------revenue by week
  async getWeeklyRevenue(): Promise<RevenuePoint[]> {
    const days = 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (days - 1));
    startDate.setHours(0, 0, 0, 0);

    const results = await this.model.aggregate([
      {
        $match: {
          status: "success",
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          total: { $sum: "$amount" },
        },
      },
    ]);

    const totalsByDate = new Map(results.map((r) => [r._id, r.total]));

    const points: RevenuePoint[] = [];
    for (let i = 0; i < days; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().slice(0, 10); // YYYY-MM-DD
      const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      points.push({ name: label, value: totalsByDate.get(key) || 0 });
    }

    return points;
  }
}




