import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  Briefcase,
  Award,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { useEffect, useState } from "react";
import { trainerService } from "../../service/trainerService";
import { UseAdminStore } from "../../store/useAdminStore";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";
import type { TrainerOverView } from "../../store/trainerSlice";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { TrainerApprovalView } from "./TrainerApprovalView";

const Approvals = () => {
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [activeTrainer, setActiveTrainer] = useState<TrainerOverView | null>(
    null,
  );

  const setPendingTrainers = UseAdminStore((state) => state.setPendingTrainers);
  const setTrainerLoading = UseAdminStore((state) => state.setTrainerLoading);
  const pendingTrainers = UseAdminStore((state) => state.pendingTrainers);

  useEffect(() => {
    const loadPendingTrainers = async () => {
      setTrainerLoading(true);
      try {
        const Data = await trainerService.getPendingTrainers();
        if (!Data.pendingTrainers.length) toast.custom(Data.message);
        setPendingTrainers(Data.pendingTrainers);
      } catch (error) {
        console.error();
        toast.error("Failed to load pending users:" + error);
      } finally {
        setTrainerLoading(false);
      }
    };
    loadPendingTrainers();
  }, []);

  const handleReviewDetails = async (trainer: TrainerOverView) => {
    setActiveTrainer(trainer);
    setIsReviewOpen(true);
  };

  return (
    <>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-8 bg-card  border pt-8 shadow-sm rounded-xl">
          <h1 className="text-3xl font-bold tracking-tight">
            Trainer Approvals
          </h1>
          <p className="text-muted-foreground mt-1">
            Review and verify trainer applications to maintain platform quality.
          </p>
        </div>
        {pendingTrainers?.length ? (
          pendingTrainers.map((trainer, index) => (
            <div key={index} className="space-y-4">
              {/* We use a single outer container for the list */}
              <Card className="border-none shadow-none bg-transparent">
                <CardContent className="p-0 space-y-4">
                  {/* Individual Trainer Approval Card */}
                  <Card className="w-full transition-all hover:shadow-md">
                    <div className="flex flex-col md:flex-row items-center pl-4 gap-4">
                      {/* 1. Identity Section */}
                      <div className="flex-1 min-w-50">
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
                          <CalendarDays className="mr-1 h-3 w-3" />
                          Applied:{" "}
                          {formatDistanceToNow(new Date(trainer.createdAt))} ago
                        </div>
                      </div>

                      {/* 2. Professional Summary Section */}
                      <div className="flex-[1.5] flex flex-wrap gap-3 border-l border-r px-6">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-semibold uppercase text-muted-foreground">
                            Experience
                          </span>
                          <div className="flex items-center gap-1 text-sm font-medium">
                            <Briefcase className="h-3 w-3" />{" "}
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
                            <Award className="h-3 w-3" /> {trainer?.certCount}{" "}
                            Files
                          </div>
                        </div>
                      </div>

                      {/* 3. Action Section */}
                      <div className="flex items-center gap-2 ml-auto">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReviewDetails(trainer)}
                        >
                          Review Details
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:bg-destructive/10"
                        >
                          <XCircle className="mr-2 h-4 w-4" /> Reject
                        </Button>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4" /> Approve
                        </Button>
                      </div>
                    </div>
                  </Card>
                </CardContent>
              </Card>
            </div>
          ))
        ) : (
          <div className="space-y-4">
            <p>No Pending Trainers</p>
          </div>
        )}
      </div>

      <Sheet open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <SheetContent side="right" className="sm:max-w-250 overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-2xl">
              Verification: {activeTrainer?.personalInfo?.fullName}
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
