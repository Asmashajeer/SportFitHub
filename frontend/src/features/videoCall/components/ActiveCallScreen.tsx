import { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';
import { useVideoCallStore } from '../store/useVideoCallStore';
import { endCall } from '../service/endCall';
import { useNavigate } from 'react-router-dom';

interface ActiveCallScreenProps {
  localStream: MediaStream | null;
  from: string;
}

export const ActiveCallScreen = ({
  localStream,
  from,
}: ActiveCallScreenProps) => {
  const navigate = useNavigate();
  const { remoteStream, remoteEmail } = useVideoCallStore();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream, isCameraOff]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  useEffect(() => {
    const timer = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

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

  const formatElapsed = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60)
      .toString()
      .padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return h > 0 ? `${h}:${m}:${sec}` : `${m}:${sec}`;
  };

  const handleEndCall = () => {
    endCall();
    navigate(from, { replace: true });
  };

  return (
  <div className="relative h-screen w-full overflow-hidden bg-neutral-950 text-neutral-100">
  {/* remote video — trainer, fills the screen */}
  <div className="absolute inset-4 rounded-2xl">
    {remoteStream ? (
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        className="h-full w-full object-cover"
      />
    ) : (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-neutral-500">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-neutral-800 text-2xl font-medium text-neutral-300">
          {remoteEmail ? remoteEmail[0]?.toUpperCase() : '?'}
        </div>
        <p className="text-sm">Waiting for video…</p>
      </div>
    )}
  </div>

  {/* top bar: trainer name + elapsed time */}
  <div className="absolute left-0 right-0 top-0 flex items-center justify-between bg-linear-to-b from-black/60 to-transparent px-5 py-4">
    <p className="text-sm text-neutral-200">{remoteEmail ?? 'Connected'}</p>
    <p className="text-sm tabular-nums text-neutral-300">{formatElapsed(elapsed)}</p>
  </div>

  {/* local preview — client's own camera, small PiP, so they can check their form */}
  <div className="absolute right-4 top-16 h-32 w-24 overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 shadow-lg sm:h-40 sm:w-28">
    {localStream && !isCameraOff ? (
      <>
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          className="h-full w-full object-cover transform-[scaleX(-1)]"
        />
        {isMuted && (
          <div className="absolute bottom-1.5 right-1.5 rounded-full bg-black/50 p-1">
            <MicOff size={12} />
          </div>
        )}
      </>
    ) : (
      <div className="flex h-full w-full items-center justify-center text-xs text-neutral-500">
        Camera off
      </div>
    )}
  </div>

  {/* controls */}
  <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-4 bg-linear-to-t from-black/60 to-transparent px-5 py-8">
    <button onClick={toggleMic} aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'} className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-800/90 text-neutral-100 hover:bg-neutral-700 focus-visible:outline focus-visible:outline-neutral-400">
      {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
    </button>
    <button onClick={toggleCamera} aria-label={isCameraOff ? 'Turn camera on' : 'Turn camera off'} className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-800/90 text-neutral-100 hover:bg-neutral-700 focus-visible:outline focus-visible:outline-neutral-400">
      {isCameraOff ? <VideoOff size={22} /> : <Video size={22} />}
    </button>
    <button onClick={handleEndCall} aria-label="End call" className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-500 focus-visible:outline focus-visible:outline-red-300">
      <PhoneOff size={22} />
    </button>
  </div>
</div>
  );
};
