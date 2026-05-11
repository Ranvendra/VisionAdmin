"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Loader2, Inbox } from "lucide-react";
import { Header } from "@/components/Header";
import { Toast } from "@/components/Toast";
import { RequestCard } from "@/components/RequestCard";
import { SmartPagination } from "@/components/SmartPagination";

interface MovieRequestItem {
  _id: string;
  userId?: { _id: string; username: string };
  tmdbId: string;
  title: string;
  posterPath?: string;
  mediaType: "movie" | "tv";
  createdAt: string;
}

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function MediaRequestsDashboard() {
  const [requests, setRequests] = useState<MovieRequestItem[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({ total: 0, page: 1, limit: 5, totalPages: 1 });
  const [currentPage, setCurrentPage] = useState(1);
  
  const [loading, setLoading] = useState(true);
  const [fulfillingIds, setFulfillingIds] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | null }>({ message: "", type: null });

  const fetchRequests = useCallback(async (pageToFetch: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/requests?page=${pageToFetch}&limit=3`);
      const data = await response.json();
      if (data.success) {
        setRequests(data.data || []);
        setPagination(data.pagination);
      } else {
        throw new Error(data.error || "Ecosystem fetch failed.");
      }
    } catch (err: any) {
      setToast({ message: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRequests(currentPage); }, [currentPage, fetchRequests]);

  useEffect(() => {
    if (toast.type) {
      const timer = setTimeout(() => setToast({ message: "", type: null }), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleFulfill = async (id: string, title: string) => {
    if (!window.confirm(`Mark "${title}" as added/fulfilled?`)) return;
    setFulfillingIds((prev) => new Set([...prev, id]));
    try {
      const response = await fetch(`/api/requests/${id}`, { method: "PATCH" });
      const data = await response.json();
      if (data.success) {
        setTimeout(() => {
          setRequests((prev) => prev.filter((req) => req._id !== id));
          setFulfillingIds((prev) => { const u = new Set(prev); u.delete(id); return u; });
          if (requests.length === 1 && currentPage > 1) setCurrentPage(prev => prev - 1);
          else fetchRequests(currentPage);
        }, 350);
        setToast({ message: `"${title}" committed to fulfilled ledger.`, type: "success" });
      } else { throw new Error(data.error || "Routine fail."); }
    } catch (err: any) {
      setFulfillingIds((prev) => { const u = new Set(prev); u.delete(id); return u; });
      setToast({ message: err.message, type: "error" });
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase() + 
      " • " + d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  };

  const pageSequence = useMemo(() => {
    const t = pagination.totalPages;
    const c = pagination.page;
    if (t <= 7) return Array.from({ length: t }, (_, i) => i + 1);
    const s: (number | string)[] = [1];
    const start = Math.max(2, c - 2);
    const end = Math.min(t - 1, c + 2);
    if (start > 2) s.push("...");
    for (let i = start; i <= end; i++) s.push(i);
    if (end < t - 1) s.push("...");
    s.push(t);
    return s;
  }, [pagination.totalPages, pagination.page]);

  return (
    <main className="flex-1 w-full h-full overflow-hidden flex flex-col items-center bg-[#F5F5F7] antialiased relative">
      <Toast message={toast.message} type={toast.type} onDismiss={() => setToast({ message: "", type: null })} />

      <div className="w-full max-w-xl h-full flex flex-col px-4 py-3 sm:py-6 min-h-0">
        <div className="shrink-0 mb-2 scale-[0.85] sm:scale-100 transition-transform origin-top">
          <Header title="Media Orchestration" subtitle="Locked Viewport Flow System" />
        </div>

        <div className="flex-1 min-h-0 w-full flex flex-col">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center py-8 animate-in fade-in duration-300">
               <div className="relative"><div className="absolute inset-0 rounded-full bg-[#007AFF]/10 blur-xl scale-150 animate-pulse" /><Loader2 className="w-10 h-10 text-[#007AFF] animate-spin relative z-10" /></div>
               <span className="text-[10px] font-bold mt-6 text-[#007AFF] tracking-[0.2em] uppercase">Establishing Pipe</span>
            </div>
          ) : requests.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center px-8 bg-white/40 backdrop-blur-3xl border border-white rounded-[32px] shadow-[0_16px_48px_-12px_rgba(0,0,0,0.04)]">
               <Inbox className="w-12 h-12 text-zinc-300 mb-4" /><h3 className="text-xl font-extrabold text-zinc-900 tracking-tight">Zero Nodes</h3><p className="text-xs text-zinc-400 mt-2 text-center">Standby maintained.</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col min-h-0 relative">
              <div className="shrink-0 flex items-center justify-between mb-2 px-2">
                <div className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-[#34C759] animate-pulse" /><span className="text-[9px] font-extrabold tracking-[0.15em] text-zinc-400 uppercase">Queue: {pagination.total}</span></div>
              </div>

              <div className="flex-1 grid grid-rows-3 gap-2.5 min-h-0 relative w-full">
                {requests.map((req, idx) => (
                  <RequestCard 
                    key={req._id} 
                    req={req} 
                    idx={idx} 
                    isFulfilling={fulfillingIds.has(req._id)} 
                    onFulfill={handleFulfill} 
                    formatDate={formatDate} 
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="shrink-0 w-full pt-4 pb-2 flex justify-center">
          {!loading && (
            <SmartPagination 
              currentPage={currentPage} 
              totalPages={pagination.totalPages} 
              pageSequence={pageSequence} 
              onPageChange={setCurrentPage} 
            />
          )}
        </div>
      </div>
    </main>
  );
}
