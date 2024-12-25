"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  return (
    <main className="flex flex-col h-screen px-[50px] pt-5 gap-[300px]">

      <div className="flex flex-col justify-center items-center gap-10">
        <div className="text-black text-xl font-normal text-center whitespace-pre-wrap">
          There was an unexpected error
        </div>

        {error.message?.length && (
          <div className="text-black text-sm font-normal text-center whitespace-pre-wrap">
            {error.message}
          </div>
        )}

        <Button
          title="Back to Home"
          type="button"
          onClick={() => router.push("/")}
        />
      </div>
    </main>
  );
}
