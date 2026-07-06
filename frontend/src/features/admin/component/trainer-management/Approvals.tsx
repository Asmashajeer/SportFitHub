import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Briefcase, Award } from 'lucide-react';

import { useEffect, useState } from 'react';
import { trainerManagementService } from '../../service/trainerManagementService';
import { UseAdminStore } from '../../store/useAdminStore';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import type { TrainerOverView } from '../../store/trainerSlice';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { TrainerApprovalView } from './TrainerApprovalView';
import { formatDateReadable } from '@/utils/formatDate';
import { TRAINER_STATUS } from '@/constants/constants';

const Approvals = () => {
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [activeTrainer, setActiveTrainer] = useState<TrainerOverView | null>(
    null
  );

  const setPendingTrainers = UseAdminStore((state) => state.setPendingTrainers);
  const setTrainerLoading = UseAdminStore((state) => state.setTrainerLoading);
  const pendingTrainers = UseAdminStore((state) => state.pendingTrainers);

  useEffect(() => {
    const loadPendingTrainers = async () => {
      setTrainerLoading(true);
      try {
        const Data = await trainerManagementService.getPendingTrainers();
        setPendingTrainers(Data.pendingTrainers);
        console.log(Data.pendingTrainers);
      } catch (error) {
        toast.error(error?.toString() || 'Something went wrong');
      } finally {
        setTrainerLoading(false);
      }
    };
    loadPendingTrainers();
  }, [isReviewOpen]);

  const handleReviewDetails = async (trainer: TrainerOverView) => {
    setActiveTrainer(trainer);
    setIsReviewOpen(true);
  };
  if(pendingTrainers?.length===0) return;
  return (
    <>
      <div className="p-4 mb-4 max-w-6xl mx-auto bg-zinc-800/80 border rounded-xl ">       
       
          <div className=" text-start  shadow-sm rounded-xl">
            <h6 className="text-lg  tracking-tight">
              Approvals
            </h6>
            <p className="text-muted-foreground mt-1">
              Review and verify trainer applications to maintain platform quality.
            </p>
          </div>
          {pendingTrainers?.length &&
            pendingTrainers.map((trainer, index) => (
            <div key={index} className="space-y-4">
              {/* We use a single outer container for the list */}
              <Card className="border-none shadow-none bg-transparent">
                <CardContent className="p-0 space-y-4">
                  {/* Individual Trainer Approval Card */}
                  <Card className=" relative w-full transition-all hover:shadow-md border  border-amber-800">
                  { trainer.status===TRAINER_STATUS.SUBMITTED && <Badge  className="absolute rounded-none top-0 left-0.5 text-xs bg-green-600 text-gray-100 z-10">New</Badge>}
                    <div className="flex flex-wrap gap-3 items-start">
                      {/* 1. Identity Section */}
                      <div className="flex-1 min-w-35">
                        <div className="flex flex-col items-center  ">
                          <CardTitle className="text-md">
                            {trainer?.personalInfo.fullName}
                          </CardTitle>
                          <Badge
                            variant="outline"
                            className="text-md text-primary font-medium"
                          >
                            @ {trainer?.displayName}
                          </Badge>
                        </div>

                        <div className="flex items-center text-sm  text-muted-foreground">
                          {trainer.status!==TRAINER_STATUS.VARIFICATION_REQUIRED &&
                          <>
                            <CalendarDays className="mr-1 h-3 w-3" />
                            Applied:{' '}
                            {formatDistanceToNow(new Date(trainer.createdAt))} ago
                          </>
                          }  
                        </div>
                      </div>

                      {/* 2. Professional Summary Section */}
                      <div className="flex-2 min-w-45 flex flex-wrap gap-3 border-l border-r px-3 max-sm:border-l-0 max-sm:border-r-0 max-sm:border-t max-sm:border-b max-sm:py-2 max-sm:w-full max-sm:px-0">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-semibold uppercase text-muted-foreground">
                            Experience
                          </span>
                          <div className="flex items-center gap-1 text-sm font-medium">
                            <Briefcase className="h-3 w-3" />{' '}
                            {trainer?.experience} Years
                          </div>
                        </div>

                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-semibold uppercase text-muted-foreground">
                            Specialties
                          </span>
                          <div className="flex gap-1">
                            {trainer?.specialties.map((s) => (
                              <Badge
                                key={s}
                                variant="secondary"
                                className="text-[10px] px-2 py-0"
                              >
                                {s}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-semibold uppercase text-muted-foreground">
                            Documents
                          </span>
                          <div className="flex items-center gap-1 text-sm font-medium text-blue-600">
                            <Award className="h-3 w-3" /> {trainer?.certCount}{' '}
                            Files
                          </div>
                        </div>
                      </div>

                      {/* 3. Action Section */}
                      {/* <div className="flex items-center gap-2 ml-auto"> */}
                        <div className="ml-auto max-sm:ml-0 max-sm:w-full">   
                        <Button
                         className="max-sm:w-full"
                          variant="outline"
                          size="sm"
                          onClick={() => handleReviewDetails(trainer)}
                        >
                          Review Details
                        </Button>
                        
                      </div>
                    </div>
                    {trainer?.verificationRemarks?.fields.length>0 &&
                      <div className='mx-4 p-2 text-start text-xs bg-zinc-800/40 border'>
                        <p>* {trainer.status}</p>
                        <div className='flex items-center gap-2 text-amber-500  px-4'>
                           
                            <p className='font-medium '>{trainer?.verificationRemarks?.fields.join('  , ')}</p>
                            <p className='text-xs font-light  '>Updated at : {formatDateReadable ( trainer?.verificationRemarks?.changedAt)}</p>
                        </div>
                       
                      </div>
                    }
                  </Card>
                </CardContent>
              </Card>
            </div>
          ))}
        
      
      </div>

      <Sheet open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <SheetContent side="right" className="sm:max-w-250 overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-center p-2 text-xl">
              Pending Approval
            </SheetTitle>
          </SheetHeader>

          {activeTrainer ? (
            <TrainerApprovalView
              trainer={activeTrainer}
              onClose={() => setIsReviewOpen(false)}
            />
          ) : (
            <div>No user Selected</div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Approvals;
