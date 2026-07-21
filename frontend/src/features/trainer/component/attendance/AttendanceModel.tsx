import { ATTENDANCE_STATUS, SESSION_TYPE } from "@/constants/constants";
import type { SessionOccuranceResponseData } from "../../types/trainer.bookings.types";
import { useEffect, useState } from "react";
import { trainerAttendanceService } from "../../service/trainer.attendance.service";
import { formatTo12Hour } from "@/utils/formatDate";
import { Button } from "@/components/ui/Button";


 interface AttendanceModalProps {
  session:SessionOccuranceResponseData
  slotId: string;
  onClose: () => void;
  onSaved?: () => void;
}
export function AttendanceModal({ session, slotId, onClose, onSaved }: AttendanceModalProps) {
    const [data, setData] = useState<SessionOccuranceResponseData>(session);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
   
        useEffect(()=>{         
            setData(session);         
            if(data )setLoading(false);
        },[]);

    const setStatus = (bookingSessionId: string, status: boolean) => {
        setData(prev =>
        prev
            ? {
                ...prev,
                participants: prev.participants.map(p =>
                p.bookingSessionId === bookingSessionId ? { ...p, attendance: status } : p
                ),
            }
            : prev
        );
    };
 
    const markAllPresent = () => {
        setData(prev =>
        prev
            ? { ...prev, participants: prev.participants.map(p => ({ ...p, attendance: ATTENDANCE_STATUS.PRESENT })) }
            : prev
        );
    };
    const handleSave = async () => {
        if (!data) return;
    
        const records = data.participants.filter(p => p.attendance !== null).map(p => ({ bookingSessionId: p.bookingSessionId, attendance: p.attendance }));
    
        if (records.length === 0) {
            setError('Mark at least one participant before saving');
            return;
        }
    
        // setSaving(true);
        setError(null);
        try {            
            await trainerAttendanceService.markAttendance( data.sessionId, records );
            onSaved?.();
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save attendance');
        } finally {
        //   setSaving(false);
        }
    };
    return (
       <div className="fixed inset-0 bg-zinc-800/70 flex items-center justify-center z-1000"
            onClick={onClose}            >
            <div className=" bg-zinc-700 rounded-xl w-120 max-w-[92%] border-[0.5px] border-border overflow-hidden"
                onClick={(e) => e.stopPropagation()}            >
                <div className="px-5 py-4 border-b-[0.5px] border-border flex items-center justify-between">
                    <div>
                        <p className="font-medium text-base m-0">Mark attendance</p>
                        {data && (
                            <div className="flex items-center justify-between  gap-2 text-[13px]  mt-1 mb-0">
                                <p className="text-green-600 text-sm font-bold">{data.sessionName}</p>
                                <p>{formatTo12Hour( data.startTime)} - {formatTo12Hour(data.endTime)}</p>                            
                            </div>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        aria-label="Close"
                        className="border-none bg-transparent cursor-pointer text-xl"
                    >
                        &times;
                    </button>
                </div>
    
                {loading ? (
                <div style={{ padding: '2rem 1.25rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    Loading participants...
                </div>
                ) : error && !data ? (
                    <div style={{ padding: '2rem 1.25rem', textAlign: 'center', color: 'var(--text-danger)' }}>
                        {error}
                    </div>
                ) : (
                data && (
                        <>
                            <div className="px-5 py-3 flex items-center justify-between border-b-[0.5px] border-[var(--border)] bg-[var(--surface-1)]">
                            <span className="text-[13px] text-[var(--text-secondary)]">
                                {data.participants.length} participant{data.participants.length !== 1 ? 's' : ''}
                            </span>
                            {data.sessionType === SESSION_TYPE.GROUP && (
                                <button onClick={markAllPresent} className="text-[13px] h-auto px-3 py-1.5">
                                Mark all present
                                </button>
                            )}
                            </div>

                            <div className="max-h-80 overflow-y-auto">
                            {data.participants.map((p) => (
                            <div
                                key={p.bookingSessionId}
                                className="flex items-center justify-between px-5 py-3 border-b-[0.5px] border-[var(--border)]"
                                >
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="min-w-0">
                                    <p className="text-sm font-medium m-0 whitespace-nowrap overflow-hidden text-ellipsis">
                                        {p.name}
                                    </p>
                                    <p className="text-xs text-[var(--text-secondary)] mt-0.5 mb-0 whitespace-nowrap overflow-hidden text-ellipsis">
                                        {p.email}
                                    </p>
                                    <p className="text-[11px] text-[var(--text-muted)] mt-0.5 mb-0 font-mono">
                                        {/* {p.userId} */}
                                    </p>
                                    </div>
                                </div>

                              <div className="flex gap-1.5 flex-shrink-0">
                                <button
                                    onClick={() => setStatus(p.bookingSessionId, ATTENDANCE_STATUS.PRESENT)}
                                    className={`text-xs h-auto px-2.5 py-[5px] rounded border ${
                                    p.attendance === ATTENDANCE_STATUS.PRESENT
                                        ? 'bg-green-100 border-green-500 text-green-700'
                                        : 'bg-transparent border-zinc-700 text-zinc-400'
                                    }`}
                                >
                                    Present
                                </button>
                                <button
                                    onClick={() => setStatus(p.bookingSessionId, ATTENDANCE_STATUS.ABSENT)}
                                    className={`text-xs h-auto px-2.5 py-[5px] rounded border ${
                                    p.attendance === ATTENDANCE_STATUS.ABSENT
                                        ? 'bg-red-100 border-red-500 text-red-700'
                                        : 'bg-transparent border-zinc-700 text-zinc-400'
                                    }`}
                                >
                                    Absent
                                </button>
                              </div>
                            </div>
                            ))}
                            </div>

                            {error && (
                            <p className="text-[var(--text-danger)] text-[13px] px-5 pt-2 m-0">
                                {error}
                            </p>
                            )}

                            <div className="px-5 py-4 border-t-[0.5px] border-[var(--border)] flex justify-end gap-2">
                            <Button variant={'secondary'} onClick={onClose} className="text-sm">
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSave}
                                className="text-sm  border-none text-white"
                            >
                                Save attendance
                            </Button>
                            </div>
                        </>
                    ))}
            </div>
        </div>
    );
}

