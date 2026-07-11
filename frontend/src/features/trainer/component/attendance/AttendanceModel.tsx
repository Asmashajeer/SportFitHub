import { ATTENDANCE_STATUS, PAYLOAD_MODEL, SESSION_TYPE } from "@/constants/constants";
import type { SessionOccuranceResponseData } from "../../types/trainer.bookings.types";
import { useEffect, useState } from "react";
import { trainerAttendanceService } from "../../service/trainer.attendance.service";

 interface AttendanceModalProps {
  session: SessionOccuranceResponseData
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
        },[session]);

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
        <div
        style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
        }}
        onClick={onClose}
        >
        <div
            style={{
            background: 'var(--surface-2)',
            borderRadius: 12,
            width: 480,
            maxWidth: '92%',
            border: '0.5px solid var(--border)',
            overflow: 'hidden',
            }}
            onClick={e => e.stopPropagation()}
        >
            <div
            style={{
                padding: '1rem 1.25rem',
                borderBottom: '0.5px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}
            >
            <div>
                <p style={{ fontWeight: 500, fontSize: 16, margin: 0 }}>Mark attendance</p>
                {data && (
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                    {data.startTime} - {data.endTime}
                </p>
                )}
            </div>
            <button
                onClick={onClose}
                aria-label="Close"
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 20 }}
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
                <div
                    style={{
                    padding: '0.75rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '0.5px solid var(--border)',
                    background: 'var(--surface-1)',
                    }}
                >
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                    {data.participants.length} participant{data.participants.length !== 1 ? 's' : ''}
                    </span>
                    {data.sessionType===SESSION_TYPE.GROUP && (
                    <button onClick={markAllPresent} style={{ fontSize: 13, padding: '6px 12px', height: 'auto' }}>
                        Mark all present
                    </button>
                    )}
                </div>
    
                <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                    {data.participants.map(p => (
                    <div
                        key={p.bookingSessionId}
                        style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem 1.25rem',
                        borderBottom: '0.5px solid var(--border)',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                        {/* <div
                            style={{
                            width: 36,
                            height: 36,
                            flexShrink: 0,
                            borderRadius: '50%',
                            background: 'var(--bg-accent)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 500,
                            fontSize: 13,
                            color: 'var(--text-accent)',
                            }}
                        >
                            {getInitials(p.name)}
                        </div> */}
                        <div style={{ minWidth: 0 }}>
                            <p
                            style={{
                                fontSize: 14,
                                fontWeight: 500,
                                margin: 0,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}
                            >
                            {p.name}
                            </p>
                            <p
                            style={{
                                fontSize: 12,
                                color: 'var(--text-secondary)',
                                margin: '2px 0 0',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}
                            >
                            {p.email}
                            </p>
                            <p
                            style={{
                                fontSize: 11,
                                color: 'var(--text-muted)',
                                margin: '2px 0 0',
                                fontFamily: 'var(--font-mono)',
                            }}
                            >
                            {p.userId}
                            </p>
                        </div>
                        </div>
    
                        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                        <button
                            onClick={() => setStatus(p.bookingSessionId, ATTENDANCE_STATUS.PRESENT)}
                            style={{
                            fontSize: 12,
                            padding: '5px 10px',
                            height: 'auto',
                            ...(p.attendance === ATTENDANCE_STATUS.PRESENT
                                ? {
                                    background: 'var(--bg-success)',
                                    borderColor: 'var(--border-success)',
                                    color: 'var(--text-success)',
                                }
                                : {}),
                            }}
                        >
                            Present
                        </button>
                        <button
                            onClick={() => setStatus(p.bookingSessionId, ATTENDANCE_STATUS.ABSENT)}
                            style={{
                            fontSize: 12,
                            padding: '5px 10px',
                            height: 'auto',
                            ...(p.attendance === ATTENDANCE_STATUS.ABSENT
                                ? {
                                    background: 'var(--bg-danger)',
                                    borderColor: 'var(--border-danger)',
                                    color: 'var(--text-danger)',
                                }
                                : {}),
                            }}
                        >
                            Absent
                        </button>
                        </div>
                    </div>
                    ))}
                </div>
    
                {error && (
                    <p style={{ color: 'var(--text-danger)', fontSize: 13, padding: '8px 1.25rem 0', margin: 0 }}>
                    {error}
                    </p>
                )}
    
                <div
                    style={{
                    padding: '1rem 1.25rem',
                    borderTop: '0.5px solid var(--border)',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 8,
                    }}
                >
                    <button onClick={onClose} 
                    // disabled={saving} 
                    style={{ fontSize: 14 }}>
                    Cancel
                    </button>
                    <button
                    onClick={handleSave}
                    //   disabled={saving}
                    style={{
                        fontSize: 14,
                        background: 'var(--fill-primary)',
                        color: 'var(--on-primary)',
                        border: 'none',
                    }}
                    >
                    {/* {saving ? 'Saving...' : 'Save attendance'} */}
                    Save attendanc
                    </button>
                </div>
                </>
            )
            )}
        </div>
        </div>
    );
}

