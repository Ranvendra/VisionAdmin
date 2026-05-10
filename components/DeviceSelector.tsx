"use client";

import React, { memo } from "react";

interface DeviceSelectorProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
}

export const DeviceSelector = memo(({ label, value, onChange }: DeviceSelectorProps) => {
  const options = ["1", "2", "3"];
  
  return (
    <div className="space-y-1 border-t border-zinc-100 pt-5">
      <label className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 ml-1">
        {label}
      </label>
      <div className="p-1 bg-zinc-100 rounded-2xl flex items-center h-10 border border-zinc-200/50">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center transition-all duration-150 cursor-pointer ${
              value === opt
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            {opt} {opt === "1" ? "Device" : "Devices"}
          </button>
        ))}
      </div>
    </div>
  );
});

DeviceSelector.displayName = "DeviceSelector";
