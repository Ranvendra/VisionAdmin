"use client";

import React, { memo } from "react";
import { CheckCircle2, AlertTriangle, X } from "lucide-react";

interface ToastProps {
  message: string;
  type: "success" | "error" | null;
  onDismiss: () => void;
}

export const Toast = memo(({ message, type, onDismiss }: ToastProps) => {
  if (!type) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4">
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-zinc-200/60 shadow-[0_12px_36px_rgba(0,0,0,0.05)] relative overflow-hidden">
        <div className="shrink-0 mt-0.5">
          {type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-[#34c759]" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-rose-500" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
              {type === "success" ? "Commit Verified" : "System Error"}
            </p>
            <span className="text-[9px] text-zinc-400">now</span>
          </div>
          <p className="text-xs mt-0.5 text-zinc-700 font-semibold leading-normal">
            {message}
          </p>
        </div>
        <button
          onClick={onDismiss}
          className="text-zinc-400 hover:text-zinc-600 transition-colors shrink-0 rounded-full p-0.5 hover:bg-zinc-100 cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
});

Toast.displayName = "Toast";
