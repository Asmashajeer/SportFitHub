export interface IPayoutService {
  runWeeklyPayout(): Promise<void>;
}