"use client";

import { AlertCircle, CheckCircle2, X } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

type Tone = "success" | "error";
type ToastItem = { id: number; message: string; tone: Tone };

const ToastContext = createContext<{
  show: (message: string, tone?: Tone) => void;
} | null>(null);

let nextToastId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const show = useCallback((message: string, tone: Tone = "success") => {
    if (!message) return;
    nextToastId += 1;
    setToasts((current) =>
      [...current, { id: nextToastId, message, tone }].slice(-3),
    );
  }, []);

  const dismiss = (id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="toast-pop nova-card pointer-events-auto flex items-start gap-3 p-4 text-sm text-ink"
          >
            {toast.tone === "error" ? (
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-control bg-blush text-sale">
                <AlertCircle aria-hidden="true" className="h-4 w-4" />
              </span>
            ) : (
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-control bg-primary-tint">
                <CheckCircle2 aria-hidden="true" className="h-4 w-4 text-success" />
              </span>
            )}
            <p className="flex-1 leading-relaxed">{toast.message}</p>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              aria-label="Dismiss notification"
              className="grid h-8 w-8 shrink-0 place-items-center rounded-control text-muted transition-colors hover:bg-primary-tint hover:text-primary"
            >
              <X aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside ToastProvider.");
  return context;
}
