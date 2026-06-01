// src/components/ui/Modal.tsx
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  // Prevent scrolling when modal is open
  //   useEffect(() => {
  //     if (isOpen) document.body.style.overflow = 'hidden';
  //     else document.body.style.overflow = 'unset';
  //     return () => { document.body.style.overflow = 'unset'; };
  //   }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      {/* stopPropagation prevents closing when clicking inside the modal */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          {title && (
            <h2 className="text-xl font-bold tracking-tight text-white">
              {title}
            </h2>
          )}
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {children}
      </div>
    </div>,
    document.body
  );
};
