"use client";

import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Header } from "@/components/Header";
import { Toast } from "@/components/Toast";
import { FormInput } from "@/components/FormInput";
import { RatingToggle } from "@/components/RatingToggle";
import { DeviceSelector } from "@/components/DeviceSelector";
import { usePreservedForm } from "@/hooks/usePreservedForm";

export default function VisionUserManager() {
  const { formData, updateField, clearForm } = usePreservedForm("vision_user_manager", {
    username: "",
    password: "",
    isAdult: false,
    maxDevicesAllowed: "1",
  });

  const [submitting, setSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | null }>({
    message: "",
    type: null,
  });

  useEffect(() => {
    if (toast.type) {
      const timer = setTimeout(() => setToast({ message: "", type: null }), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!formData.username.trim()) errors.username = "Username required.";
    if (!formData.password.trim()) errors.password = "Password required.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitting(true);

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username.trim(),
          password: formData.password.trim(),
          isAdult: formData.isAdult,
          maxDevicesAllowed: parseInt(formData.maxDevicesAllowed, 10),
        }),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setToast({
          message: `Database Verified: "${data.user.username}" committed.`,
          type: "success",
        });
        clearForm();
        setFormErrors({});
      } else {
        setToast({ message: data.error || "Database commit failed.", type: "error" });
      }
    } catch {
      setToast({ message: "Failed to connect to database.", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex-1 overflow-y-auto w-full flex flex-col items-center justify-center py-8 px-4 sm:px-6 md:px-8 antialiased bg-[#F5F5F7]">
      <Toast message={toast.message} type={toast.type} onDismiss={() => setToast({ message: "", type: null })} />

      <div className="w-full max-w-lg bg-white border border-zinc-200/60 rounded-[32px] p-6 sm:p-10 shadow-[0_16px_48px_rgba(0,0,0,0.02)]">
        <Header title="Vision User Manager" subtitle="Profile Index Control" />

        <form onSubmit={handleSubmit} className="space-y-5">
          <FormInput
            label="Username"
            value={formData.username}
            onChange={(val) => updateField("username", val)}
            placeholder="e.g., newuser123"
            error={formErrors.username}
          />
          <FormInput
            label="Password"
            type="password"
            value={formData.password}
            onChange={(val) => updateField("password", val)}
            placeholder="••••••••"
            error={formErrors.password}
          />
          <RatingToggle
            label="Profile Age Restriction"
            toggleLabel="Child Profile (Restricted)"
            isActive={!formData.isAdult}
            onToggle={() => updateField("isAdult", !formData.isAdult)}
          />

          <DeviceSelector
            label="Max Allowed Devices"
            value={formData.maxDevicesAllowed}
            onChange={(val) => updateField("maxDevicesAllowed", val)}
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 px-6 rounded-2xl font-bold text-sm text-white bg-[#34c759] hover:bg-[#30b651] active:scale-[0.97] transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_4px_16px_rgba(52,199,89,0.15)] cursor-pointer"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Syncing...</span>
              </>
            ) : (
              "Send"
            )}
          </button>
        </form>
      </div>

    </main>
  );
}

