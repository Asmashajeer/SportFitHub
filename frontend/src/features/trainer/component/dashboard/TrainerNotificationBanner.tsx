import { Button } from '@/components/ui/Button';
import { AlertCircle } from 'lucide-react';
import { useTrainerStore } from '../../store/useTrainerStore';
import { useEffect } from 'react';
import { DOC_VERIFY_STATUS, TRAINER_STATUS } from '@/constants/constants';
import { format, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';

const TrainerNotificationBanner = () => {
  const { profile, fetchProfile } = useTrainerStore();

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="flex flex-col md:flex-row items-start p-4 bg-slate-900 border-l-4 border-red-600 rounded-r-lg">
      {profile?.certificationInfo.status === DOC_VERIFY_STATUS.REJECTED && (
        <div className="w-full flex items-start gap-3 p-4 border-red-500 rounded-lg animate-pulse-subtle">
          <AlertCircle className="text-red-600 h-5 w-5 mt-0.5" />
          <div className="flex-1 items-start gap-3  ">
            <h4 className=" flex items-start text-sm  text-red-400">
              <strong>Action Required </strong>: Certificates
            </h4>
            <p className="  flex text-sm text-red-400 ">
              <strong>Reason for rejection : </strong>{' '}
              {profile?.certificationInfo?.rejectReason ||
                'No reason provided. Please contact support.'}
            </p>
          </div>
        </div>
      )}

      {profile?.idVerification.status === DOC_VERIFY_STATUS.REJECTED && (
        <div className="flex items-center  p-4  border-l-4 border-red-200 rounded-r-lg animate-pulse-subtle">
          <AlertCircle className="text-red-600 h-5 w-5 mt-0.5" />
          <div className="">
            <h4 className="text-sm font-bold text-red-800">
              Action Required: Id Verification
            </h4>
            <p className="text-sm text-red-700 mt-1">
              <strong>Reason for rejection:</strong>{' '}
              {profile?.idVerification.rejectReason ||
                'No reason provided. Please contact support.'}
            </p>
          </div>
        </div>
      )}
      {/* OVERALL APPROVAL REJECTION */}
      {profile?.status === TRAINER_STATUS.REJECTED && (
        <div className="flex items-start w-full">
          <div className="flex-1">
            <p className=" text-white font-bold">
              Your account application was not approved.
            </p>
            <p className="text-red-500">
              Reason : "{profile.rejectionReason} "
              {profile?.rejectedAt && (
                <span className="text-red-100">
                  {' '}
                  Rejected on: {format(parseISO(profile.rejectedAt), 'PPP')}
                </span>
              )}
            </p>
            <p className="text-slate-400 text-sm">
              Please update the flagged sections above to request a re-review.
            </p>
            <div className="flex items-end  justify-end pt-4 ">
              <Button variant="outline">
                <Link to="/trainer/profile" className="text-primary right-0">
                  Fix & Re-submit
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerNotificationBanner;
