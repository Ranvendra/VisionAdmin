"use client";

import React, { memo, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

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
    const [showPassword, setShowPassword] = useState(false);

    // Decide the ultimate rendered type
    const isPasswordField = type === "password";
    const finalType = isPasswordField ? (showPassword ? "text" : "password") : type;

    return (
      <div className="space-y-1">
        <label className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 ml-1">
          {label}
        </label>
        
        <div className="relative flex items-center">
          <input
            type={finalType}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full px-4 py-2.5 rounded-2xl bg-zinc-100/70 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500 transition-all duration-150 ${
              isPasswordField ? "pr-12" : ""
            } ${
              error ? "ring-2 ring-rose-500/20 border border-rose-500" : "border border-transparent"
            }`}
          />
          
          {isPasswordField && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 p-2 text-zinc-400 hover:text-zinc-600 active:text-zinc-900 transition-colors rounded-xl hover:bg-zinc-100/80 focus:outline-none"
            >
              {showPassword ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </button>
          )}
        </div>

        {error && (
          <p className="text-[10px] text-rose-500 font-bold ml-1.5">{error}</p>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";
