import { PenaltyRepository } from '@/repositories/penalty.repository';
import { PENALTY, TRAINER_STATUS } from '@/constants/enums';
import { differenceInDays } from 'date-fns';
import { IPenaltyService } from '@/interfaces/services/trainer/IPenalty.service';
import { sendNotificationEmail } from '@/utils/sendNotfication.mail';

import { IUser } from '@/models/user.model';
import { IPenaltyLedgerRepository } from '@/interfaces/repositories/IPenaltyLedger.repository';

export class PenaltyService implements IPenaltyService {
  private _penaltyRepo: PenaltyRepository;
  private _penaltyLedgerRepo: IPenaltyLedgerRepository;

  constructor(penaltyRepo: PenaltyRepository, penaltyLedgerRepo: IPenaltyLedgerRepository) {
    this._penaltyRepo = penaltyRepo;
    this._penaltyLedgerRepo = penaltyLedgerRepo;
   
  }

  async applyPenalty(trainerId: string, sessionId: string, slotId: string, startDateTime: Date, sessionRevenue: number): Promise<void> {
    const alreadyPenalized = await this._penaltyLedgerRepo.findByOccurrence(sessionId, slotId, startDateTime);
    if (alreadyPenalized) return;
    const trainer = await this._penaltyRepo.findTrainerById(trainerId);
    const user = trainer.userId as unknown as IUser;

    // don't keep striking/penalizing a trainer who's already suspended
    if (trainer.status === TRAINER_STATUS.SUSPENDED) return;

    // reset strikes if last strike was > 90 days ago
    const shouldReset = trainer.lastStrikeDate && differenceInDays(new Date(), new Date(trainer.lastStrikeDate)) > PENALTY.STRIKE_RESET_DAYS;

     if (shouldReset) {
      await this._penaltyRepo.updatePenalty(trainerId, { strikePoints: 0, cancellationCount: 0 });
    }
    // increment strike
    const updatedTrainer = await this._penaltyRepo.incrementStrike(trainerId, {
      strikePoints: 1,
      cancellationCount: 1,
      lastStrikeDate: new Date(),
    });

    const { strikePoints } = updatedTrainer;
    const penaltyAmount = (sessionRevenue * PENALTY.CANCELLATION_PENALTY_PERCENT) / 100;

    if (strikePoints === PENALTY.STRIKE_THRESHOLDS.WARNING) {
      await this._handleFirstStrike(user, strikePoints);
    } 
    else if (strikePoints === PENALTY.STRIKE_THRESHOLDS.PENALTY) {
      await this._recordPenalty(trainerId, sessionId, slotId, startDateTime, penaltyAmount);
      await this._handleSecondStrike(user, strikePoints, penaltyAmount);
    } 
    else if (strikePoints >= PENALTY.STRIKE_THRESHOLDS.SUSPENSION) {
      await this._recordPenalty(trainerId, sessionId, slotId, startDateTime, penaltyAmount);
      await this._handleThirdStrike(user, strikePoints, penaltyAmount);
      //update trainer status
      await this._penaltyRepo.updatePenalty(trainerId, {
        status: TRAINER_STATUS.SUSPENDED,
        suspensionReason: 'Suspended due to repeated session cancellations.',
        suspendedAt: new Date(),
      });
    }
  }

  private async _recordPenalty(trainerId: string, sessionId: string, slotId: string, startDateTime: Date, amount: number): Promise<void> {
    await this._penaltyLedgerRepo.createPenalty({
      trainerId,
      sessionId,
      slotId,
      startDateTime,
      amount,
      reason: 'late_cancellation',
      status: 'pending',
    });

    
  }

  // ─── Strike Handlers ────────────────────────────────────────

  private async _handleFirstStrike(user: IUser, strikePoints: number): Promise<void> {
    await sendNotificationEmail({
      to: user.email,
      title: '⚠️ First Strike Warning',
      description: 'You have received your first strike due to a session cancellation.',
      details: {
        userName: user.name,
        strikes: `${strikePoints} / ${PENALTY.STRIKE_THRESHOLDS.SUSPENSION}`,
        financialPenalty: 'None this time',
        warning: '2nd cancellation will result in a financial penalty',
      },
      closingLine: 'Please avoid cancelling sessions to maintain your account standing.',
    });
  }

  private async _handleSecondStrike(user: IUser, strikePoints: number, penaltyAmount: number): Promise<void> {
    await sendNotificationEmail({
      to: user.email,
      title: '🚩 Second Strike — Financial Penalty Applied',
      description: 'A financial penalty will be deducted from your upcoming payout due to session cancellation.',
      details: {
        userName: user.name,
        strikes: `${strikePoints} / ${PENALTY.STRIKE_THRESHOLDS.SUSPENSION}`,
        penaltyDeducted: `AED ${penaltyAmount}`,
        warning: '1 more cancellation will result in account suspension',
      },
      closingLine: 'Please contact support if you believe this is an error.',
    });
  }

  private async _handleThirdStrike(user: IUser, strikePoints: number, penaltyAmount: number): Promise<void> {
    await sendNotificationEmail({
      to: user.email,
      title: '🚫Account Suspended',
      description: 'Your account has been suspended due to repeated session cancellations.',
      details: {
        userName: user.name,
        totalStrikes: strikePoints,
        penaltyDeducted: `AED ${penaltyAmount}`,
        status: 'Suspended',
      },
      closingLine: 'Please contact support to appeal your suspension.',
    });
  }
}
