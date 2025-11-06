"use client";
import { DotLoader, TextLoader } from "@/components/ui/loader";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { createTasteProfile } from "@/lib/actions/create-taste-profile";

export default function onboardingPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"running" | "done" | "error">("running");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      try {
        await createTasteProfile();
        setStatus("done");
        setTimeout(() => {
          router.push("/app");
        }, 500);
      } catch (error) {
        setStatus("error");
      }
    });
  }, []);
  return (
    <div className=" min-h-screen font-sans bg-background">
      <main className="w-full flex flex-col h-screen">
        <div className="flex flex-1 flex-col gap-8 justify-center items-center">
          {status === "running" && (
            <>
              <DotLoader />
              <TextLoader
                className="text-3xl"
                text="Creating taste profile..."
              />
            </>
          )}
          {status === "done" && (
            <h1 className="text-3xl font-bold">Done! Redirecting…</h1>
          )}
          {status === "error" && (
            <h1 className="text-3xl font-bold opacity-75">
              Something went wrong while building your profile. Try refreshing
              or logging in again.
            </h1>
          )}
        </div>
      </main>
    </div>
  );
}
