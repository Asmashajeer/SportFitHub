import { IPayment } from "@/models/payment.model";
import { ClientSession } from "mongoose";
import { IBaseRepository } from "./IBase.repository";
import { FilterQuery } from "mongoose";

export interface IPaymentRepository extends IBaseRepository<IPayment> {
    createPayment(data: Partial<IPayment>, session: ClientSession) ,
    updatePayment(id: string, data: Partial<IPayment>, session: ClientSession)
    findByUserId(filter :FilterQuery<IPayment>):Promise<IPayment[]|null>
}