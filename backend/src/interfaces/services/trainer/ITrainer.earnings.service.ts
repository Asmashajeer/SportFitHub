export interface ITrainerEarningsService{
    getEarningsSummary(trainerId: string);
    getSessionEarnings(trainerId: string, page: number)
    getPayoutHistory(trainerId: string)
}