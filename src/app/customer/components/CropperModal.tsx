'use client';

import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface CropperModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const CropperModal: React.FC<CropperModalProps> = ({ open, onClose, children }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [open]);

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (contentRef.current && !contentRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[10000] bg-black/60 flex items-center justify-center"
      onMouseDown={handleBackdropClick}
    >
      <div ref={contentRef} onMouseDown={e => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default CropperModal;
