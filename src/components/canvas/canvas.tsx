'use client'
import { Tldraw } from "tldraw"
import "tldraw/tldraw.css"
import useCanvas from "./hooks/useCanvas"
import Loading from "@/components/ui/loading"
import { Button } from "@/components/ui/button"
import { RotateCw } from "lucide-react"
import useHasSelection from "./hooks/useHasSelection"
import AiDescribe from "@/components/ai-describe/ai-describe"

interface CanvasProps {
  projectId?: string
  isLoggedIn: boolean
  readOnly: boolean
}

export default function Canvas({ projectId, isLoggedIn, readOnly }: CanvasProps) {
  const { setEditor, editor, status, guestPersistenceKey } = useCanvas({
    initialProjectId: projectId,
    isLoggedIn,
    readOnly,
  });
  const isSomeShapeSelected = useHasSelection(editor);

  // task: add a button that modifies a shape
  const handleRotateShape = () => {
    if (!editor) return
    editor.rotateShapesBy(editor.getSelectedShapeIds(), Math.PI / 2)
  }

  return (
    <>
      {readOnly && (
        <div className="absolute top-10 left-0 right-0 bottom-0 z-[1000] w-fit h-fit mx-auto">
          <div className="text-2xl">Read-only mode</div>
        </div>
      )}

      <StatusComponent status={status} />

      {!readOnly && status === "idle" && (
        <div className="absolute bottom-[62px] left-0 right-0 ms-auto me-auto w-fit z-[1000] gap-2 flex">
          <RotateButton
            onClick={handleRotateShape}
            disabled={!isSomeShapeSelected}
          />
          <AiDescribe editor={editor} isLoggedIn={isLoggedIn} isShapeSelected={isSomeShapeSelected} />
        </div>
      )}

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

const RotateButton = ({ onClick, disabled }: { onClick: () => void; disabled: boolean }) => (
  <Button
    onClick={onClick}
    disabled={disabled}><RotateCw />Rotate</Button>
)
