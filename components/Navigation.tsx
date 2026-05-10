"use client";

import React, { memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Play, UserRound } from "lucide-react";

export const Navigation = memo(() => {
  const pathname = usePathname();
  const isUsers = pathname === "/users";
  const isStreams = pathname === "/";

  return (
    <div className="fixed top-8 left-0 right-0 z-50 flex justify-center pointer-events-none">
      {/* Minimal slim pill container */}
      <div className="inline-flex p-1 bg-white/60 backdrop-blur-2xl rounded-full border border-white/80 shadow-[0_4px_24px_rgba(0,0,0,0.04)] pointer-events-auto">
        <Link
          href="/"
          className={`relative flex items-center gap-2 px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all duration-300 ${
            isStreams
              ? "bg-blue-600 text-white shadow-[0_4px_12px_rgba(37,99,235,0.25)]"
              : "text-zinc-400 hover:text-zinc-800 hover:bg-zinc-50/50"
          }`}
        >
          <Play className={`w-3 h-3 ${isStreams ? "fill-white" : "opacity-50"}`} />
          Streams
        </Link>
        
        <Link
          href="/users"
          className={`relative flex items-center gap-2 px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all duration-300 ${
            isUsers
              ? "bg-blue-600 text-white shadow-[0_4px_12px_rgba(37,99,235,0.25)]"
              : "text-zinc-400 hover:text-zinc-800 hover:bg-zinc-50/50"
          }`}
        >
          <UserRound className={`w-3.5 h-3.5 ${isUsers ? "fill-white" : "opacity-50"}`} />
          Users
        </Link>
      </div>
    </div>
  );
});

Navigation.displayName = "Navigation";
