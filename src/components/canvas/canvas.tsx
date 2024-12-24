'use client'
import { Tldraw } from "tldraw"
import "tldraw/tldraw.css"
import useCanvas from "./useCanvas"

interface CanvasProps {
  projectId?: string
  isLoggedIn: boolean
  readOnly: boolean
}

export default function CanvasComponent({ projectId, isLoggedIn, readOnly }: CanvasProps) {
  const { setEditor, status, guestPersistenceKey } = useCanvas({
    initialProjectId: projectId,
    isLoggedIn,
    readOnly,
  });

  if (status === 'loading') {
    return (
      <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
        <div className="text-2xl">Cargando...</div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
        <div className="text-2xl">Error al cargar el proyecto</div>
      </div>
    )
  }

  return (
    <>
      {readOnly && (
        <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
          <div className="text-2xl">Proyecto en modo de sólo lectura</div>
        </div>
      )}
      <Tldraw
        onMount={setEditor}
        persistenceKey={guestPersistenceKey} />
    </>
  );
}
