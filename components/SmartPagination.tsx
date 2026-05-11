"use client";

import React, { memo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SmartPaginationProps {
  currentPage: number;
  totalPages: number;
  pageSequence: (number | string)[];
  onPageChange: (page: number) => void;
}

export const SmartPagination = memo(({ currentPage, totalPages, pageSequence, onPageChange }: SmartPaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <nav className="inline-flex items-center bg-white/80 border border-white backdrop-blur-2xl p-1.5 rounded-full shadow-[0_8px_32px_-8px_rgba(0,0,0,0.06)] animate-in slide-in-from-bottom-2 fade-in duration-500">
      {/* Previous Control */}
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="w-8 h-8 flex items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-100 disabled:opacity-20 disabled:hover:bg-transparent transition-all cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-1 px-1">
        {pageSequence.map((p, i) => {
          if (p === "...") {
            return (
              <span key={`dots-${i}`} className="w-6 text-center text-[10px] font-bold text-zinc-300 tracking-widest">
                ...
              </span>
            );
          }
          const active = currentPage === p;
          return (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              className={`min-w-[28px] h-7 px-1 flex items-center justify-center rounded-full text-[11px] font-black tracking-wide transition-all duration-300 ease-out cursor-pointer ${
                active
                  ? "bg-[#007AFF] text-white shadow-[0_4px_12px_-2px_rgba(0,122,255,0.35)] scale-110"
                  : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
              }`}
            >
              {p}
            </button>
          );
        })}
      </div>

      {/* Next Control */}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="w-8 h-8 flex items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-100 disabled:opacity-20 disabled:hover:bg-transparent transition-all cursor-pointer"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
});

SmartPagination.displayName = "SmartPagination";
