"use client";

import React, { memo } from "react";

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export const Header = memo(({ title = "Vision Stream Manager", subtitle = "Admin Sync Suite" }: HeaderProps) => {
  return (
    <header className="text-center mb-5 sm:mb-8">
      {/* iOS App Icon Branding (Glossy 3D Ribbon Play Icon) */}
      <div className="flex justify-center mb-4 sm:mb-6">
        <svg
          viewBox="0 0 100 100"
          className="w-16 h-16 sm:w-20 sm:h-20 filter drop-shadow-[0_4px_12px_rgba(138,0,255,0.08)] select-none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="bluePurple" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00f0ff" />
              <stop offset="40%" stopColor="#0072ff" />
              <stop offset="100%" stopColor="#8a00ff" />
            </linearGradient>
            <linearGradient id="purplePink" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8a00ff" />
              <stop offset="50%" stopColor="#ff007f" />
              <stop offset="100%" stopColor="#ff5e00" />
            </linearGradient>
          </defs>
          <path
            d="M32 15
               C37 11, 44 12, 48 15
               L84 45
               C90 50, 90 58, 84 63
               L48 93
               C43 97, 34 96, 29 91
               C24 86, 22 78, 22 72
               L22 36
               C22 28, 25 19, 32 15
               Z"
            fill="url(#bluePurple)"
          />
          <path
            d="M40 34
               L68 54
               C71 56, 71 60, 68 62
               L40 82
               C36 85, 31 82, 31 76
               L31 40
               C31 34, 36 31, 40 34
               Z"
            fill="url(#purplePink)"
            opacity="0.95"
          />
        </svg>
      </div>

      <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 tracking-tight leading-none">
        {title}
      </h1>
      <p className="text-[10px] sm:text-xs text-zinc-400 mt-1.5 font-semibold">
        {subtitle}
      </p>
    </header>
  );
});

Header.displayName = "Header";
