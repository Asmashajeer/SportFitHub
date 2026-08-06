import { useVideoCallStore } from "../store/useVideoCallStore";
import { VIDEO_CALL_STATUS } from "@/constants/constants";
import { acceptCall } from "../service/acceptCall";

import { Phone, PhoneOff } from "lucide-react";
import { endCall, rejectCall } from "../service/endCall";

export const ConnectingCallScreen = () => {
  const { callStatus, remoteEmail } = useVideoCallStore();
  const isOutgoing = callStatus === VIDEO_CALL_STATUS.OUTGOING;
  const isRinging = callStatus === VIDEO_CALL_STATUS.RINGING;

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-6 bg-neutral-950 text-neutral-100">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-neutral-800 text-2xl font-medium">
        {remoteEmail ? remoteEmail[0]?.toUpperCase() : "?"}
      </div>

      <div className="flex flex-col items-center gap-1">
        <p className="text-lg text-neutral-100">{remoteEmail ?? "Unknown"}</p>
        <p className="text-sm text-neutral-500">
          {isOutgoing ? "Calling…" : "Incoming call"}
        </p>
      </div>

      {isOutgoing && (
        <button
          onClick={endCall}
          aria-label="Cancel call"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-500 focus-visible:outline  focus-visible:outline-red-300"
        >
          <PhoneOff size={22} />
        </button>
      )}

      {isRinging && (
        <div className="flex items-center gap-6">
          <button
            onClick={rejectCall}
            aria-label="Decline call"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-500 focus-visible:outline  focus-visible:outline-red-300"
          >
            <PhoneOff size={22} />
          </button>
          <button
            onClick={acceptCall}
            aria-label="Accept call"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white hover:bg-green-500 focus-visible:outline  focus-visible:outline-green-300"
          >
            <Phone size={22} />
          </button>
        </div>
      )}
    </div>
  );
};