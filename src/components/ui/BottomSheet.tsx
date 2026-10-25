import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: string;
  headerRight?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: string;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  headerRight,
  footer,
  children,
  maxWidth = 'max-w-xl',
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-[#3B0726]/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className={`w-full ${maxWidth} rounded-t-[36px] sm:rounded-[36px] bg-[#FCFBF9] border-t sm:border border-[#FBCFE8] shadow-2xl shadow-[#3B0726]/30 max-h-[92vh] flex flex-col overflow-hidden transition-transform duration-200`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag Handle */}
        <div
          onClick={onClose}
          className="pt-3 pb-1.5 flex justify-center cursor-pointer shrink-0"
          aria-label="Fermer le panneau"
        >
          <div className="w-12 h-1.5 rounded-full bg-[#FBCFE8] hover:bg-[#F472B6] transition-colors" />
        </div>

        {/* Header */}
        {(title || headerRight) && (
          <div className="px-5 sm:px-6 pb-3.5 pt-1 border-b border-[#FBCFE8]/70 flex items-center justify-between gap-3 shrink-0 bg-[#FCFBF9]">
            <div className="min-w-0">
              {title && (
                <div className="text-base sm:text-lg font-bold text-[#3B0726] font-display leading-tight">
                  {title}
                </div>
              )}
              {subtitle && (
                <p className="text-xs text-[#7A616F] font-medium mt-0.5 truncate">
                  {subtitle}
                </p>
              )}
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {headerRight}
              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 min-w-[36px] min-h-[36px] rounded-full bg-[#FDF2F8] hover:bg-[#FCE7F3] text-[#831843] flex items-center justify-center transition-colors"
                aria-label="Fermer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-4 space-y-4 text-xs text-[#3B0726]">
          {children}
        </div>

        {/* Sticky Footer - Always elevated above navigation and safe for iOS/Android bottom bar */}
        {footer && (
          <div className="px-5 sm:px-6 py-3.5 border-t border-[#FBCFE8]/70 bg-[#FCFBF9] shrink-0 pb-[max(1.25rem,calc(env(safe-area-inset-bottom)+0.75rem))] shadow-[0_-8px_20px_rgba(59,7,38,0.06)]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
