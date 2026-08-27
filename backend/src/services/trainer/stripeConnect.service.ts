import Stripe from 'stripe';
import { ITrainerRepository } from '@/interfaces/repositories/ITrainer.repository';
import { IStripeConnectService } from '@/interfaces/services/trainer/IStripeConnect.service';

export class StripeConnectService implements IStripeConnectService {
    private _trainerRepo: ITrainerRepository;
    private _stripe: Stripe;
  constructor(   trainerRepo: ITrainerRepository,   stripe: Stripe  ) {
    this._trainerRepo=trainerRepo;
       this._stripe= stripe;
  }

  async createConnectAccount(trainerId: string, email: string): Promise<string> {
    const trainer = await this._trainerRepo.findById(trainerId);
    if (trainer?.stripeAccountId) {
      return trainer.stripeAccountId; // already has one, don't create a duplicate
    }

    const account = await this._stripe.accounts.create({
      type: 'express',
      country: 'AE',
      email,
      capabilities: { transfers: { requested: true } },
    });

    await this._trainerRepo. updateTrainerStripeAC(trainerId, {
      stripeAccountId: account.id,
      stripeOnboardingComplete: false,
    } ); 

    return account.id;
  }

  async generateOnboardingLink(trainerId: string): Promise<string> {
    const trainer = await this._trainerRepo.findById(trainerId);
    if (!trainer?.stripeAccountId) {
      throw new Error('Trainer has no Stripe account yet — create one first');
    }

    const accountLink = await this._stripe.accountLinks.create({
      account: trainer.stripeAccountId,
      refresh_url: `${process.env.FRONTEND_URL}/trainer/onboarding/refresh`,
      return_url: `${process.env.FRONTEND_URL}/trainer/earnings`,
      type: 'account_onboarding',
    });

    return accountLink.url;
  }



  async checkOnboardingStatus(trainerId: string): Promise<boolean> {
    const trainer = await this._trainerRepo.findById(trainerId);
    if (!trainer?.stripeAccountId) return false;

    const account = await this._stripe.accounts.retrieve(trainer.stripeAccountId);
    console.log(account);
    const complete = !!account.details_submitted && !!account.payouts_enabled;

    if (complete && !trainer.stripeOnboardingComplete) {
      await this._trainerRepo. updateTrainerStripeAC(trainerId, { stripeOnboardingComplete: true });
    }

    return complete;
  }
}