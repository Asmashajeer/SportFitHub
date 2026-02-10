import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trainerService } from "../../service/trainerService";

import {
  ExternalLink,
  CreditCard,
  Building2,
  ShieldCheck,
  Award,
} from "lucide-react";
import { UseAdminStore } from "../../store/useAdminStore";
import { useEffect } from "react";
import type { ICertification, TrainerOverView } from "../../store/trainerSlice";
import {
  DOC_VERIFY_STATUS,
  TRAINER_STATUS,
  type Doc_status_type,
} from "@/constants/constants";
import toast from "react-hot-toast";

export const TrainerApprovalView = ({
  trainer,
  onClose,
}: {
  trainer: TrainerOverView;
  onClose: () => void;
}) => {
  const selectedTrainer = UseAdminStore((state) => state.selectedTrainer);
  const setSelectedTrainer = UseAdminStore((state) => state.setSelectedTrainer);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { trainerData } = await trainerService.getTrainer(trainer.id);

      setSelectedTrainer(trainerData);
    };

    fetchCurrentUser();
  }, [trainer]);

  //update cerificates/id status
  const updateStatus = async (
    id: string,
    targetField: "certificationInfo" | "idVerification",
    status: Doc_status_type,
    reason?: string,
  ) => {
    console.log("------", id);
    if (status === DOC_VERIFY_STATUS.REJECTED) {
      const reply = window.prompt("Enter rejection reason:");
      reason = reply ? reply : "";
    }
    try {
      const data = await trainerService.updateFileStatus(
        id,
        targetField,
        status,
        reason,
      );

      if (data.success) {
        toast.success(`certificationInfo updated to ${status}`);
        setSelectedTrainer(data.trainerData);
      }
    } catch (error) {
      toast.error("Failed to update status. Please try again.");
      console.error("Update Error:", error);
    }
  };

  //update Trainer application Status

  const trainerApplicationStatus = async (
    id: string,
    status: Doc_status_type,
    reason?: string,
  ) => {
    console.log("------", id);
    if (status === TRAINER_STATUS.REJECTED) {
      const reply = window.prompt("Enter rejection reason:");
      reason = reply ? reply : "";
    }
    try {
      const data = await trainerService.updateTrainerStatus(id, status, reason);

      if (data.success) {
        toast.success(`Trainer ${status}`);
        setSelectedTrainer(data.trainerData);
        onClose();
      }
    } catch (error) {
      toast.error("Failed to update status. Please try again.");
      console.error("Update Error:", error);
    }
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
      {/* LEFT COLUMN: Data Sections (2/3 width) */}
      <div className="lg:col-span-2 space-y-4">
        <Accordion
          type="multiple"
          defaultValue={["personal", "id"]}
          className="w-full"
        >
          {/* Basic info */}
          <AccordionItem value="Branding" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-green-600 h-5 w-5" />
                <span className="font-bold">Branding Information</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4 border-t pt-4">
              <div className="grid grid-cols-2 gap-y-4">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">
                    DisplayName
                  </p>
                  <p className="text-sm font-medium">
                    {selectedTrainer?.displayName}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">
                    Core Discipline{" "}
                  </p>
                  <p className="text-sm font-medium">
                    {selectedTrainer?.category}: (
                    {selectedTrainer?.coreDiscipline})
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">
                    Expertise{" "}
                  </p>
                  <p className="text-sm font-medium">
                    {selectedTrainer?.specialties}{" "}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground uppercase">
                    Exp Lang{" "}
                  </p>
                  <p className="text-sm font-medium">
                    {selectedTrainer?.experience} ({selectedTrainer?.languages})
                  </p>
                </div>

                <div className="col-span-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">
                    Bio
                  </p>
                  <p className="text-sm">{selectedTrainer?.bio} </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          {/* Personal & Address */}
          <AccordionItem value="personal" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-green-600 h-5 w-5" />
                <span className="font-bold">
                  Personal & Contact Information
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4 border-t pt-4">
              <div className="grid grid-cols-2 gap-y-4">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">
                    Full Name
                  </p>
                  <p className="text-sm font-medium">
                    {selectedTrainer?.personalInfo.fullName}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">
                    DOB Gender{" "}
                  </p>
                  <p className="text-sm font-medium">
                    {selectedTrainer?.personalInfo.DOB} (
                    {selectedTrainer?.personalInfo.gender})
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">
                    Phone{" "}
                  </p>
                  <p className="text-sm font-medium">
                    {selectedTrainer?.personalInfo.phone}
                  </p>
                </div>

                <div className="col-span-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">
                    Address
                  </p>
                  <p className="text-sm">
                    {selectedTrainer?.personalInfo.address.street},{" "}
                    {selectedTrainer?.personalInfo.address.city},{" "}
                    {selectedTrainer?.personalInfo.address.state} -{" "}
                    {selectedTrainer?.personalInfo.address.zip}
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          {/*Certificates &Licence  */}
          <AccordionItem
            value="Certificates"
            className="border rounded-lg px-4"
          >
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3">
                <Award className="text-green-600 h-5 w-5" />
                <span className="font-bold">Professional Certificates </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4 border-t pt-4">
              <div className="grid grid-cols-2 gap-y-4">
                {selectedTrainer?.certificationInfo.documents.map(
                  (cert: ICertification, i: number) => (
                    <div
                      key={i}
                      className="text-sm p-3 border rounded-md hover:bg-muted/30"
                    >
                      <p className="font-normal text-primary">
                        Name:{cert.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Issued: {new Date(cert.issuedAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground mb-2">
                        Expires: {new Date(cert.validUpto).toLocaleDateString()}
                      </p>

                      <Button
                        variant="link"
                        className="p-0 h-auto text-xs"
                        asChild
                      >
                        <a
                          href={cert.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Document
                        </a>
                      </Button>
                    </div>
                  ),
                )}
              </div>
              {selectedTrainer?.certificationInfo.documents.length && (
                <div className="flex items-end right-0 justify-around">
                  <p>
                    status:{" "}
                    {selectedTrainer?.certificationInfo?.status.toUpperCase()}
                  </p>
                  {selectedTrainer?.certificationInfo?.status ===
                    DOC_VERIFY_STATUS.PENDING && (
                    <div className="flex items-center gap-2 ">
                      <Button
                        onClick={() =>
                          updateStatus(
                            selectedTrainer?.id,
                            "certificationInfo",
                            DOC_VERIFY_STATUS.VERIFIED,
                          )
                        }
                      >
                        Verify
                      </Button>
                      <Button
                        variant={"destructive"}
                        onClick={() =>
                          updateStatus(
                            selectedTrainer?.id,
                            "certificationInfo",
                            DOC_VERIFY_STATUS.REJECTED,
                          )
                        }
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>

          {/* Govt ID Verification */}
          <AccordionItem value="id" className="border rounded-lg mt-4 px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <CreditCard className="text-orange-600 h-5 w-5" />
                <span className="font-bold">Government ID Verification</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4 border-t pt-4">
              <div className="flex flex-col md:flex-row gap-4 items-start">
                <div className="flex-1 space-y-3">
                  <p className="text-sm">
                    Type:{" "}
                    <strong>{selectedTrainer?.idVerification.idType}</strong>
                  </p>
                  <p className="text-sm">
                    Number:{" "}
                    <strong>{selectedTrainer?.idVerification.idNumber}</strong>
                  </p>
                  <Badge
                    variant={
                      selectedTrainer?.idVerification.verified
                        ? "default"
                        : "destructive"
                    }
                  >
                    Current Status: {selectedTrainer?.idVerification.status}
                  </Badge>
                </div>

                <div className="w-full md:w-48 aspect-video bg-muted rounded flex flex-col items-center justify-center border border-dashed border-gray-400">
                  <p className="text-[10px] text-muted-foreground mb-2 text-center px-2">
                    ID Attachment
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={selectedTrainer?.idVerification.idAttachment}
                      target="_blank"
                    >
                      <ExternalLink className="h-3 w-3 mr-2" />
                      Preview ID
                    </a>
                  </Button>
                </div>
                {selectedTrainer?.idVerification.status ===
                  DOC_VERIFY_STATUS.PENDING && (
                  <div className="flex items-center gap-2 ">
                    <Button
                      onClick={() =>
                        updateStatus(
                          selectedTrainer?.id,
                          "idVerification",
                          DOC_VERIFY_STATUS.VERIFIED,
                        )
                      }
                    >
                      Verify
                    </Button>
                    <Button
                      variant={"destructive"}
                      onClick={() =>
                        updateStatus(
                          selectedTrainer?.id,
                          "idVerification",
                          DOC_VERIFY_STATUS.REJECTED,
                        )
                      }
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
          {/* Availability & Schedule */}
          <AccordionItem value="personal" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-green-600 h-5 w-5" />
                <span className="font-bold">Availability & Schedule</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4 border-t pt-4">
              <div className="grid grid-cols-2 gap-y-4">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">
                    SessionCharge
                  </p>
                  <p className="text-sm font-medium">
                    {selectedTrainer?.pricing.sessionCharge}{" "}
                    {selectedTrainer?.pricing.currency}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">
                    Availabilty:{" "}
                    <span className="text-sm font-medium">
                      {selectedTrainer?.availability.isAvailable
                        ? "Active"
                        : "Not Available"}{" "}
                    </span>
                  </p>
                  <div className="space-y-2">
                    {selectedTrainer?.availability &&
                      Object.entries(selectedTrainer.availability)
                        .filter(
                          ([key, value]) =>
                            key !== "isAvailable" &&
                            typeof value === "object" &&
                            value.available,
                        )
                        .map(([day, info]: [string, any]) => (
                          <div
                            key={day}
                            className="flex justify-between items-center text-sm border-b pb-1 border-muted/50"
                          >
                            <span className="font-medium capitalize">
                              {day}
                            </span>
                            <span className="text-muted-foreground">
                              {info.startTime} - {info.endTime}
                            </span>
                          </div>
                        ))}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          {/* Payment & Bank Info */}
          <AccordionItem
            value="payment"
            className="border rounded-lg mt-4 px-4"
          >
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <Building2 className="text-green-600 h-5 w-5" />
                <span className="font-bold">Banking & Payment Data</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4 border-t pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-secondary/20 rounded">
                  <p className="text-xs text-muted-foreground uppercase font-bold">
                    Bank Account
                  </p>
                  <p className="text-sm">
                    Name:{" "}
                    {selectedTrainer?.paymentInfo.bankAccount?.accountName}
                  </p>
                  <p className="text-sm">
                    A/C:{" "}
                    {selectedTrainer?.paymentInfo.bankAccount?.accountNumber}
                  </p>
                  <p className="text-sm">
                    IFSC: {selectedTrainer?.paymentInfo.bankAccount?.ifscCode}
                  </p>
                </div>
                <div className="p-3 bg-secondary/20 rounded">
                  <p className="text-xs text-muted-foreground uppercase font-bold">
                    UPI ID
                  </p>
                  <p className="text-sm font-mono mt-2">
                    {selectedTrainer?.paymentInfo.upiId || "Not Provided"}
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="space-y-4">
        {/* ADMIN ACTION BOX */}
        <div className="border rounded-lg bg-secondary/10 p-4 sticky top-4">
          <h4 className="font-bold text-sm mb-4">Verification Actions</h4>
          {selectedTrainer && (
            <div className="space-y-2">
              <Button
                className="w-full bg-green-600 hover:bg-green-700 h-12"
                onClick={() =>
                  trainerApplicationStatus(
                    selectedTrainer?.id,
                    TRAINER_STATUS.APPROVED,
                  )
                }
              >
                Approve Application
              </Button>
              <Button
                variant="outline"
                className="w-full h-12 border-destructive text-destructive hover:bg-destructive/5"
                onClick={() =>
                  trainerApplicationStatus(
                    selectedTrainer?.id,
                    TRAINER_STATUS.REJECTED,
                  )
                }
              >
                Reject Application
              </Button>
              <Button
                variant="outline"
                className="w-full h-12 border-b-amber-200 text-amber-200 hover:bg-amber-600/5"
                onClick={() =>
                  trainerApplicationStatus(
                    selectedTrainer?.id,
                    TRAINER_STATUS.UNDER_REVIEW,
                  )
                }
              >
                Under Review
              </Button>
            </div>
          )}
          <p className="text-[10px] text-center text-muted-foreground mt-4 italic">
            Approval will notify the selectedTrainer? and activate their public
            profile.
          </p>
        </div>
      </div>
    </div>
  );
};
