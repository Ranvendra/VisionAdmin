"use client";

import React, { memo } from "react";

interface FormInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  error?: string;
  type?: string;
}

export const FormInput = memo(
  ({ label, value, onChange, placeholder, error, type = "text" }: FormInputProps) => {
    return (
      <div className="space-y-1">
        <label className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 ml-1">
          {label}
        </label>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full px-4 py-2.5 rounded-2xl bg-zinc-100/70 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500 transition-all duration-150 ${
            error ? "ring-2 ring-rose-500/20 border border-rose-500" : "border border-transparent"
          }`}
        />
        {error && (
          <p className="text-[10px] text-rose-500 font-bold ml-1.5">{error}</p>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";
