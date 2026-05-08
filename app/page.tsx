"use client";

import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Header } from "../components/Header";
import { Toast } from "../components/Toast";
import { FormInput } from "../components/FormInput";
import { RatingToggle } from "../components/RatingToggle";
import { SegmentedControl } from "../components/SegmentedControl";

export default function VisionStreamManager() {
  const [tmdbId, setTmdbId] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState<"movie" | "series">("movie");
  const [isAdult, setIsAdult] = useState(false);
  const [url, setUrl] = useState("");
  const [seasonNumber, setSeasonNumber] = useState("");
  const [episodeNumber, setEpisodeNumber] = useState("");

  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | null }>({ message: "", type: null });

  useEffect(() => {
    if (toast.type) {
      const timer = setTimeout(() => setToast({ message: "", type: null }), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!tmdbId.trim()) errors.tmdbId = "TMDb ID required.";
    else if (!/^\d+$/.test(tmdbId.trim())) errors.tmdbId = "Digits only.";

    if (!name.trim()) errors.name = "Name required.";
    if (!url.trim()) errors.url = "URL required.";
    else {
      try { new URL(url.trim()); } catch { errors.url = "Invalid URL."; }
    }

    if (type === "series") {
      const isInvalid = (val: string) => !val.trim() || isNaN(Number(val)) || Number(val) < 1 || !Number.isInteger(Number(val));
      if (isInvalid(seasonNumber)) errors.seasonNumber = "Required.";
      if (isInvalid(episodeNumber)) errors.episodeNumber = "Required.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const response = await fetch("/api/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tmdbId: tmdbId.trim(), name: name.trim(), type, isAdult, url: url.trim(),
          ...(type === "series" ? { seasonNumber: parseInt(seasonNumber), episodeNumber: parseInt(episodeNumber) } : {}),
        }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setToast({ message: `Database Verified: "${data.stream.name}" committed.`, type: "success" });
        setTmdbId(""); setName(""); setUrl(""); setSeasonNumber(""); setEpisodeNumber(""); setFormErrors({});
      } else {
        setToast({ message: data.error || "Database commit failed.", type: "error" });
      }
    } catch {
      setToast({ message: "Failed to connect to database.", type: "error" });
    } finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-950 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 antialiased">
      <Toast message={toast.message} type={toast.type} onDismiss={() => setToast({ message: "", type: null })} />
      <div className="w-full max-w-lg bg-white border border-zinc-200/60 rounded-[32px] p-6 sm:p-10 shadow-[0_16px_48px_rgba(0,0,0,0.02)]">
        <Header />
        <form onSubmit={handleSubmit} className="space-y-5">
          <FormInput label="TMDb ID" value={tmdbId} onChange={setTmdbId} placeholder="e.g., 1327819" error={formErrors.tmdbId} />
          <FormInput label="Content Name" value={name} onChange={setName} placeholder="e.g., Dhurandhar" error={formErrors.name} />
          <FormInput label="Stream URL" value={url} onChange={setUrl} placeholder="https://example.com/stream.mp4" error={formErrors.url} />
          <RatingToggle label="Content Rating" isActive={isAdult} onToggle={() => setIsAdult(!isAdult)} />
          <SegmentedControl label="Content Type" value={type} onChange={setType} />
          {type === "series" && (
            <div className="grid grid-cols-2 gap-3 mt-2">
              <FormInput label="Season" value={seasonNumber} onChange={setSeasonNumber} placeholder="e.g., 1" error={formErrors.seasonNumber} />
              <FormInput label="Episode" value={episodeNumber} onChange={setEpisodeNumber} placeholder="e.g., 5" error={formErrors.episodeNumber} />
            </div>
          )}
          <button type="submit" disabled={loading} className="w-full py-4 px-6 rounded-2xl font-bold text-sm text-white bg-[#34c759] hover:bg-[#30b651] active:scale-[0.97] transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_4px_16px_rgba(52,199,89,0.15)] cursor-pointer">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Syncing...</span></> : "Send"}
          </button>
        </form>
      </div>
      <footer className="mt-8 text-center text-[10px] text-zinc-400 font-mono tracking-widest uppercase">
        © {new Date().getFullYear()} Vision Admin Suite • iOS v1.6.0
      </footer>
    </main>
  );
}
