'use client'
import { Tldraw } from "tldraw"
import "tldraw/tldraw.css"
import useCanvas from "./useCanvas"

interface CanvasProps {
  initialProjectId?: string
  isLoggedIn: boolean
  readOnly: boolean
}

export default function CanvasComponent({ initialProjectId, isLoggedIn, readOnly }: CanvasProps) {
  // si no me viene projectId, pero el usuario está logeado, he de crear el proyecto
  const { store, projectId, setEditor } = useCanvas({
    initialProjectId,
    isLoggedIn,
    readOnly,
  });

  return (
    <>
      {readOnly && projectId && (
        <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
          <div className="text-2xl">Proyecto en modo de sólo lectura</div>
        </div>
      )}
      <Tldraw
        persistenceKey={projectId ? undefined : "tldraw"}
        store={store}
        onMount={setEditor} />
    </>
  );
}
