export interface IStripeConnectService {
  createConnectAccount(trainerId: string, email: string): Promise<string>; // returns stripeAccountId
  generateOnboardingLink(trainerId: string): Promise<string>; // returns URL to redirect trainer to
  checkOnboardingStatus(trainerId: string): Promise<boolean>;
}