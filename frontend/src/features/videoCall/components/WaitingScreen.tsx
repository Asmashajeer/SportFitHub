import { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';
import { useVideoCallStore } from '../store/useVideoCallStore';
import { endCall } from '../service/endCall';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { ROLES } from '@/constants/constants';

interface WaitingScreenProps {
  localStream: MediaStream | null;
  from: string; 
}

export const WaitingScreen = ({ localStream,from }: WaitingScreenProps) => {
const navigate=useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const { remoteEmail } = useVideoCallStore();
  const {user}=useAuthStore();
  useEffect(() => {
    if (videoRef.current && localStream) {
      videoRef.current.srcObject = localStream;
    }

  }, [localStream,isCameraOff]);

 

  const toggleMic = () => {
    if (!localStream) return;
    const track = localStream.getAudioTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setIsMuted(!track.enabled);
    }
  };

  const toggleCamera = () => {
    if (!localStream) return;
    const track = localStream.getVideoTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setIsCameraOff(!track.enabled);
    }
  };

  const HandleEndCall=()=>{
    endCall();
    navigate(from,{replace:true})
  }
  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center bg-neutral-950 text-neutral-100">
      <div className="relative aspect-video w-full max-w-3xl overflow-hidden rounded-2xl bg-neutral-900">
        {localStream && !isCameraOff ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="h-full w-full object-cover transform-[scaleX(-1)]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-neutral-500">
            Camera is off
          </div>
        )}
      </div>
        {/* <div className="relative aspect-video w-full max-w-3xl overflow-hidden rounded-2xl bg-neutral-900">
            <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className={`h-full w-full object-cover transform-[scaleX(-1)] ${isCameraOff ? "hidden" : ""}`}
            />
            {isCameraOff && (
                <div className="absolute inset-0 flex items-center justify-center bg-neutral-900 text-neutral-500">
                Camera is off 
                </div>
            )}
        </div> */}
      <div className="mt-6 flex flex-col items-center gap-1">
        <p className="text-base text-neutral-200">
          {remoteEmail
            ? `Waiting for ${remoteEmail} to join…`:
            user?.activeRole===ROLES.USER? 'Waiting for the trainer to join…':'Waiting for the other participant to join…'}
        </p>
        {/* <p className="text-sm tabular-nums text-neutral-500">{formatElapsed(elapsed)}</p> */}
      </div>

      <div className="mt-8 flex items-center gap-4">
        <button
          onClick={toggleMic}
          aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-800 text-neutral-100 hover:bg-neutral-700 focus-visible:outline focus-visible:outline-neutral-400"
        >
          {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
        </button>

        <button
          onClick={toggleCamera}
          aria-label={isCameraOff ? 'Turn camera on' : 'Turn camera off'}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-800 text-neutral-100 hover:bg-neutral-700 focus-visible:outline focus-visible:outline-neutral-400"
        >
          {isCameraOff ? <VideoOff size={20} /> : <Video size={20} />}
        </button>

        <button
          onClick={HandleEndCall}
          aria-label="Leave session"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-500 focus-visible:outline  focus-visible:outline-red-300"
        >
          <PhoneOff size={20} />
        </button>
      </div>
    </div>
  );
};
