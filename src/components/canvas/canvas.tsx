'use client'
import { Tldraw } from "tldraw"
import "tldraw/tldraw.css"
import useCanvas from "./hooks/useCanvas"
import Loading from "@/components/ui/loading"

interface CanvasProps {
  projectId?: string
  isLoggedIn: boolean
  readOnly: boolean
}

export default function Canvas({ projectId, isLoggedIn, readOnly }: CanvasProps) {
  const { setEditor, status, guestPersistenceKey } = useCanvas({
    initialProjectId: projectId,
    isLoggedIn,
    readOnly,
  });

  return (
    <>
      {readOnly && (
        <div className="fixed top-10 left-0 right-0 bottom-0 flex justify-center z-10">
          <div className="text-2xl">Read-only mode</div>
        </div>
      )}

      <StatusComponent status={status} />

      <Tldraw
        onMount={setEditor}
        persistenceKey={guestPersistenceKey} />
    </>
  );
}

const StatusComponent = ({ status }: { status: "loading" | "idle" | "error" }) => status === "idle" ? null : (
  <div className="absolute w-full h-full bg-white flex items-center justify-center z-[1000]">
    {status === "loading" ? (
      <Loading />
    ) : (
      <div className="text-2xl">There was an error loading the project</div>
    )}
  </div>
)
