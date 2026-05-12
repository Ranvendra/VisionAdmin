"use client";

import { useState, useEffect, useCallback, useRef } from "react";

// Module-level cache guarantees instant restoration during client-side routing navigations
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const memoryCache: Record<string, any> = {};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function usePreservedForm<T extends Record<string, any>>(
  formKey: string,
  initialData: T
) {
  const [formData, setFormData] = useState<T>(initialData);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Store initial data reference to avoid unnecessary re-triggers while maintaining hook hygiene
  const initialRef = useRef(initialData);

  // 2. Effect hook for loading saved state without interrupting rendering tree.
  useEffect(() => {
    let currentData = { ...initialRef.current };

    // Step A: Check if existing in fast memory
    if (memoryCache[formKey]) {
      currentData = { ...currentData, ...memoryCache[formKey] };
    } else {
      // Step B: Fallback to cold storage (LocalStorage)
      try {
        const stored = localStorage.getItem(`vision_preserve_${formKey}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          currentData = { ...currentData, ...parsed };
          // Populate the memory cache for future switches
          memoryCache[formKey] = currentData;
        }
      } catch {
        // Silent fail for storage API non-critical access
      }
    }

    // Prevent hydration mismatch in Next.js by restoring local data safely post-mount.
    setFormData(currentData);
    setIsLoaded(true);
  }, [formKey]);

  // 3. Function to update a discrete field value
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateField = useCallback((field: keyof T, value: any) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      // Propagate update to high-performance memory
      memoryCache[formKey] = next;

      // Propagate to disk as non-blocking background update
      try {
        localStorage.setItem(`vision_preserve_${formKey}`, JSON.stringify(next));
      } catch {
        // Silent fail
      }

      return next;
    });
  }, [formKey]);

  // 4. Simple cleanup utility to wipe context post-success submit
  const clearForm = useCallback(() => {
    setFormData(initialRef.current);
    delete memoryCache[formKey];
    try {
      localStorage.removeItem(`vision_preserve_${formKey}`);
    } catch {
      // Silent fail
    }
  }, [formKey]);

  return {
    formData,
    updateField,
    clearForm,
    isLoaded
  };
}

