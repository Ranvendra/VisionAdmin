"use client";

import React, { memo } from "react";

interface SegmentedControlProps {
  label: string;
  value: "movie" | "series";
  onChange: (val: "movie" | "series") => void;
}

export const SegmentedControl = memo(({ label, value, onChange }: SegmentedControlProps) => {
  return (
    <div className="space-y-1 border-t border-zinc-100 pt-5">
      <label className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 ml-1">
        {label}
      </label>
      <div className="p-1 bg-zinc-100 rounded-2xl flex items-center h-10 border border-zinc-200/50">
        <button
          type="button"
          onClick={() => onChange("movie")}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-150 cursor-pointer ${
            value === "movie"
              ? "bg-white text-zinc-900 shadow-sm"
              : "text-zinc-500 hover:text-zinc-800"
          }`}
        >
          Movie
        </button>
        <button
          type="button"
          onClick={() => onChange("series")}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-150 cursor-pointer ${
            value === "series"
              ? "bg-white text-zinc-900 shadow-sm"
              : "text-zinc-500 hover:text-zinc-800"
          }`}
        >
          TV Series
        </button>
      </div>
    </div>
  );
});

SegmentedControl.displayName = "SegmentedControl";
