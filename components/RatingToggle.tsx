"use client";

import React, { memo } from "react";

interface RatingToggleProps {
  label: string;
  isActive: boolean;
  onToggle: () => void;
}

export const RatingToggle = memo(({ label, isActive, onToggle }: RatingToggleProps) => {
  return (
    <div className="space-y-1">
      <label className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 ml-1">
        {label}
      </label>
      <div
        onClick={onToggle}
        className="flex items-center justify-between px-4 py-3 rounded-2xl bg-zinc-100/70 cursor-pointer select-none h-11"
      >
        <span className="font-bold text-zinc-600 text-xs ml-0.5">18+ Adult Rated</span>
        {/* Visual iOS Switch capsule */}
        <div
          className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-150 ease-in-out ${
            isActive ? "bg-[#34c759]" : "bg-zinc-200"
          }`}
        >
          <div
            className={`bg-white w-5 h-5 rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.15)] transform transition-transform duration-150 ease-in-out ${
              isActive ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </div>
      </div>
    </div>
  );
});

RatingToggle.displayName = "RatingToggle";
