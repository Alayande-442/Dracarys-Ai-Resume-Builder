"use client";

import { useToast } from "@/hooks/use-toast";
import useDebounce from "@/hooks/useDebounce";
import { ResumeValues } from "@/lib/validation";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { saveResume } from "./actions";
import { Button } from "@/components/ui/button";

export default function useAutoSaveResume(resumeData?: ResumeValues) {
  const searchParams = useSearchParams();
  const { toast } = useToast();

  // ✅ Debounce only if resumeData is available
  const debouncedResumeData = useDebounce(resumeData, 1500);

  // ✅ Safe default with optional chaining
  const [resumeId, setResumeId] = useState<string | undefined>(
    resumeData?.id ?? undefined,
  );

  const [lastSavedData, setLastSavedData] = useState<ResumeValues | undefined>(
    resumeData ? structuredClone(resumeData) : undefined,
  );

  const [isSaving, setIsSaving] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setIsError(false);
  }, [debouncedResumeData]);

  useEffect(() => {
    if (!debouncedResumeData) return;

    async function save() {
      try {
        setIsSaving(true);
        setIsError(false);

        const newData = structuredClone(debouncedResumeData);

        const updatedResume = await saveResume({
          ...newData,
          ...(lastSavedData?.photo?.toString() ===
            newData.photo?.toString() && {
            photo: undefined,
          }),
          id: resumeId,
        });

        setResumeId(updatedResume.id);
        setLastSavedData(newData);

        if (searchParams.get("resumeId") !== updatedResume.id) {
          const newSearchParams = new URLSearchParams(searchParams);
          newSearchParams.set("resumeId", updatedResume.id);
          window.history.replaceState(
            null,
            "",
            `?${newSearchParams.toString()}`,
          );
        }
      } catch (error) {
        setIsError(true);
        console.error(error);
        const { dismiss } = toast({
          variant: "destructive",
          description: (
            <div className="space-y-3">
              <p>Could not save changes.</p>
              <Button
                variant="secondary"
                onClick={() => {
                  dismiss();
                  save(); // Retry
                }}
              >
                Retry
              </Button>
            </div>
          ),
        });
      } finally {
        setIsSaving(false);
      }
    }

    const hasUnsavedChanges =
      JSON.stringify(debouncedResumeData) !== JSON.stringify(lastSavedData);

    if (hasUnsavedChanges && debouncedResumeData && !isSaving && !isError) {
      save();
    }
  }, [
    debouncedResumeData,
    isSaving,
    lastSavedData,
    isError,
    searchParams,
    resumeId,
    toast,
  ]);

  return {
    isSaving,
    hasUnsavedChanges:
      resumeData !== undefined &&
      JSON.stringify(resumeData) !== JSON.stringify(lastSavedData),
  };
}
