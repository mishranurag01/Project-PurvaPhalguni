import React from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'warning' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl border shadow-lg backdrop-blur-md transition-all duration-300 animate-fade-in-up flex items-start gap-3 ${
              isSuccess
                ? 'bg-[#FAF8F5]/95 border-[#C59B4B] text-[#0F172A]'
                : isError
                ? 'bg-rose-50/95 border-rose-300 text-rose-950'
                : isWarning
                ? 'bg-amber-50/95 border-amber-300 text-amber-950'
                : 'bg-white/95 border-[#E8E2D8] text-[#0F172A]'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-[#C59B4B]" />}
              {isError && <AlertTriangle className="w-4 h-4 text-rose-600" />}
              {isWarning && <AlertTriangle className="w-4 h-4 text-amber-600" />}
              {!isSuccess && !isError && !isWarning && <Info className="w-4 h-4 text-[#526071]" />}
            </div>

            <div className="flex-1 text-xs">
              <h5 className="font-semibold text-[#0F172A]">{toast.title}</h5>
              {toast.message && <p className="text-[#526071] mt-0.5 leading-relaxed">{toast.message}</p>}
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="text-[#94A3B8] hover:text-[#0F172A] p-0.5 transition-colors cursor-pointer"
              aria-label="Dismiss toast"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
