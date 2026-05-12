"use client";

import React, { memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Play, UserRound, Inbox } from "lucide-react";

export const Navigation = memo(() => {
  const pathname = usePathname();
  const isStreams = pathname === "/";
  const isUsers = pathname === "/users";
  const isRequests = pathname === "/requests";

  const navItems = [
    { href: "/", label: "Streams", active: isStreams, Icon: Play },
    { href: "/users", label: "Users", active: isUsers, Icon: UserRound },
    { href: "/requests", label: "Requests", active: isRequests, Icon: Inbox },
  ];

  return (
    <header className="w-full shrink-0 z-20 relative flex justify-center items-center h-20 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl border-b border-zinc-200/40 dark:border-zinc-800/40 shadow-[0_2px_16px_-4px_rgba(0,0,0,0.02)] px-6">
      {/* Premium Pill Dashboard Navigation */}
      <div className="flex p-1 bg-zinc-100/80 dark:bg-zinc-800/50 rounded-full border border-zinc-200/40 dark:border-zinc-700/30 shadow-sm">
        {navItems.map(({ href, label, active, Icon }) => (
          <Link
            key={href}
            href={href}
            className={`group relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2.5 rounded-full text-[9px] sm:text-[11px] font-extrabold uppercase tracking-wider transition-all duration-300 ease-out active:scale-95 ${
              active
                ? "bg-[#007AFF] text-white shadow-[0_4px_16px_-4px_rgba(0,122,255,0.4)]"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50"
            }`}
          >
            <Icon 
              className={`w-4 h-4 transition-transform duration-300 group-hover:-translate-y-0.5 ${
                active ? "fill-white/10 stroke-[2.5px]" : "opacity-60 group-hover:opacity-100"
              }`} 
            />
            <span className="inline-block">{label}</span>
          </Link>
        ))}
      </div>
    </header>
  );
});

Navigation.displayName = "Navigation";
