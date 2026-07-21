import { PenaltyRepository } from '@/repositories/penalty.repository';
import { WalletService } from '../wallet/wallet.service';
import { PENALTY, TRAINER_STATUS } from '@/constants/enums';
import { differenceInDays } from 'date-fns';
import { IPenaltyService } from '@/interfaces/services/trainer/IPenalty.service';
import { sendNotificationEmail } from '@/utils/sendNotfication.mail';
import { ITrainerProfile } from '@/models/trainerProfile.model';
import { IUser } from '@/models/user.model';

export class PenaltyService implements IPenaltyService {
  private _penaltyRepo: PenaltyRepository;
  private _walletService: WalletService;
  constructor(penaltyRepo: PenaltyRepository, walletService: WalletService) {
    this._penaltyRepo = penaltyRepo;
    this._walletService = walletService;
  }

  async applyPenalty(trainerId: string, sessionRevenue: number): Promise<void> {
    const trainer = await this._penaltyRepo.findTrainerById(trainerId);

    const user = trainer.userId as unknown as IUser;

    // reset strikes if last strike was > 90 days ago
    const shouldReset = trainer.lastStrikeDate && differenceInDays(new Date(), new Date(trainer.lastStrikeDate)) > PENALTY.STRIKE_RESET_DAYS;

    let { strikePoints, penalty, cancellationCount } = trainer;
    if (shouldReset) {
      strikePoints = 0;
      penalty = 0;
      cancellationCount = 0;
    }

    cancellationCount += 1;
    strikePoints += 1;
    const lastStrikeDate = new Date();

    const penaltyAmount = (sessionRevenue * PENALTY.CANCELLATION_PENALTY_PERCENT) / 100;

    if (strikePoints === PENALTY.STRIKE_THRESHOLDS.WARNING) {
      await this._handleFirstStrike(user, strikePoints);
    } else if (strikePoints === PENALTY.STRIKE_THRESHOLDS.PENALTY) {
      penalty += penaltyAmount;
      await this._handleSecondStrike(user, strikePoints, penaltyAmount);
    } else if (strikePoints >= PENALTY.STRIKE_THRESHOLDS.SUSPENSION) {
      penalty += penaltyAmount;
      await this._handleThirdStrike(user, strikePoints, penaltyAmount);
    }

    await this._penaltyRepo.updatePenalty(trainerId, {
      penalty,
      strikePoints,
      cancellationCount,
      lastStrikeDate,
      ...(strikePoints >= PENALTY.STRIKE_THRESHOLDS.SUSPENSION && {
        status: TRAINER_STATUS.SUSPENDED,
        suspensionReason: 'Suspended due to repeated session cancellations.',
        suspendedAt: new Date(),
      }),
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
    await this._walletService.deductFromWallet(user._id.toString(), penaltyAmount);

    await sendNotificationEmail({
      to: user.email,
      title: '🚩 Second Strike — Financial Penalty Applied',
      description: 'A financial penalty has been deducted from your wallet due to session cancellation.',
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
    await this._walletService.deductFromWallet(user._id.toString(), penaltyAmount);

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
