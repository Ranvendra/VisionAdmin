"use client";

import React, { memo } from "react";
import { Check, Film, Tv, Calendar, User, Clapperboard, Loader2 } from "lucide-react";

interface MovieRequestItem {
  _id: string;
  userId?: { _id: string; username: string };
  tmdbId: string;
  title: string;
  posterPath?: string;
  mediaType: "movie" | "tv";
  createdAt: string;
}

interface RequestCardProps {
  req: MovieRequestItem;
  idx: number;
  isFulfilling: boolean;
  onFulfill: (id: string, title: string) => void;
  formatDate: (date: string) => string;
}

export const RequestCard = memo(({ req, idx, isFulfilling, onFulfill, formatDate }: RequestCardProps) => {
  return (
    <div
      className={`group h-full relative w-full bg-white/75 backdrop-blur-3xl rounded-[32px] flex items-stretch gap-4 p-3 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.06),inset_0_0_0_1px_rgba(255,255,255,0.7)] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden animate-in fade-in slide-in-from-bottom-4
      ${isFulfilling ? "scale-[0.93] opacity-0 blur-md pointer-events-none" : "scale-100 opacity-100 hover:-translate-y-0.5 hover:shadow-[0_24px_48px_-16px_rgba(0,0,0,0.1)]"}
      `}
      style={{ animationDelay: `${idx * 60}ms` }}
    >
      {/* Specular Top Reflection */}
      <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />

      {/* High-End Cinematic Image Cluster with Ambient Diffused Glow */}
      <div className="shrink-0 h-full aspect-[2/3] relative group/img">
        {/* Dynamic Ambient Drop Shadow derived from the image color footprint */}
        {req.posterPath && (
          <div className="absolute inset-1 rounded-[20px] opacity-50 group-hover:opacity-80 blur-xl transition-all duration-700 scale-95 translate-y-1 pointer-events-none overflow-hidden">
             <img src={`https://image.tmdb.org/t/p/w92${req.posterPath}`} alt="" className="w-full h-full object-cover scale-150" />
          </div>
        )}

        {/* Main Squircle Mask container */}
        <div className="relative h-full w-full rounded-[20px] bg-[#F2F2F7] overflow-hidden shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08)] border border-white/20 z-10">
          {req.posterPath ? (
            <img 
              src={`https://image.tmdb.org/t/p/w342${req.posterPath}`} 
              alt="" 
              className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-1000 ease-out" 
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-50">
              <Clapperboard className="w-5 h-5 text-zinc-300" />
            </div>
          )}
          
          {/* Visual Category Badge Overlay */}
          <div className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-1 rounded-full bg-white/30 backdrop-blur-md border border-white/30 shadow-[0_2px_8px_rgba(0,0,0,0.05)] scale-90 origin-top-left">
            {req.mediaType === "movie" ? (
              <Film className="w-3 h-3 text-zinc-800 drop-shadow-sm" />
            ) : (
              <Tv className="w-3 h-3 text-zinc-800 drop-shadow-sm" />
            )}
          </div>
        </div>
      </div>

      {/* Typography Architecture with Relaxed Contrast (Non-Blacks) */}
      <div className="flex-1 flex flex-col justify-between py-1.5 min-w-0 z-10 h-full">
        <div className="flex flex-col min-w-0 gap-0.5">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-[#007AFF]/10 shadow-[inset_0_1px_2px_rgba(0,122,255,0.1)]">
              <User className="w-2.5 h-2.5 text-[#007AFF]" />
            </div>
            <span className="text-[10px] font-bold text-zinc-500 tracking-wide uppercase truncate">
              {req.userId?.username || "Anon"}
            </span>
          </div>

          <h4 className="text-base sm:text-lg font-extrabold text-zinc-800 tracking-tight leading-tight truncate group-hover:text-zinc-900 transition-colors duration-300 mt-1">
            {req.title}
          </h4>
          
          {/* Super Aesthetic Neutral Machine Label */}
          <div className="mt-2 flex items-center gap-1.5">
            <div className="px-2 py-1 bg-zinc-100 text-zinc-500 text-[8px] font-extrabold uppercase tracking-[0.1em] rounded-lg border border-zinc-200/50 shadow-sm">
              TMDb
            </div>
            <span className="text-xs font-mono font-bold text-[#007AFF] bg-[#007AFF]/5 px-2 py-0.5 rounded-lg border border-[#007AFF]/10 select-all">
              {req.tmdbId}
            </span>
          </div>
        </div>

        {/* Elegant Meta Ledger Line */}
        <div className="flex items-center gap-2 text-zinc-400 mt-auto pt-2 border-t border-zinc-100/80">
          <Calendar className="w-3.5 h-3.5 stroke-[1.5px] text-zinc-300" />
          <span className="text-[9px] font-semibold tracking-wider uppercase text-zinc-400/90">
            {formatDate(req.createdAt)}
          </span>
        </div>
      </div>

      {/* Specialized Apple-Style 'Added' (Fulfill) Action */}
      <div className="shrink-0 self-center pr-1.5 z-10">
        <button
          onClick={() => onFulfill(req._id, req.title)}
          disabled={isFulfilling}
          className="h-10 px-4 rounded-full flex items-center justify-center gap-2 bg-[#34C759] hover:bg-[#30B651] text-white shadow-[0_6px_16px_-4px_rgba(52,199,89,0.45)] active:scale-[0.94] transition-all duration-300 disabled:opacity-50 cursor-pointer group/fulfill relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/fulfill:opacity-100 transition-opacity duration-300" />
          {isFulfilling ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Check className="w-4 h-4 stroke-[2.5px] group-hover/fulfill:scale-110 transition-transform duration-300" />
              <span className="text-[11px] font-extrabold tracking-widest uppercase drop-shadow-sm hidden sm:inline-block">Added</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
});

RequestCard.displayName = "RequestCard";
