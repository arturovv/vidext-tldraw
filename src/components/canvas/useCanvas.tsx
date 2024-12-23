'use client'
import { useEffect, useState } from "react"
import { createTLStore, Editor, getSnapshot, loadSnapshot, TLStoreWithStatus } from "tldraw"

interface Props {
  initialProjectId?: string
  isLoggedIn: boolean
  readOnly: boolean
}

export default function useCanvas({ initialProjectId, isLoggedIn, readOnly }: Props) {
  const [storeWithStatus, setStoreWithStatus] = useState<TLStoreWithStatus | undefined>(initialProjectId ? {
    status: 'loading',
  } : undefined)
  const [projectId, setProjectId] = useState(initialProjectId)
  const [editor, setEditor] = useState<Editor | null>(null)

  useEffect(() => {
    let cancelled = false
    async function loadRemoteSnapshot(projectId: string) {
      // Get the snapshot
      const snapshot = await getProjectSnapshotById(projectId)
      if (cancelled) return

      // Create the store
      const newStore = createTLStore()

      // Load the snapshot
      loadSnapshot(newStore, snapshot)

      // Update the store with status
      setStoreWithStatus({
        store: newStore,
        status: 'synced-remote',
        connectionStatus: 'online',
      })
    }

    if (projectId) {
      loadRemoteSnapshot(projectId)
    } else {
      // to work locally
      setStoreWithStatus(undefined)
    }

    return () => {
      cancelled = true
    }
  }, [projectId])

  useEffect(() => {
    if (!editor) {
      return
    }

    editor.updateInstanceState({ isReadonly: readOnly })

    const listeners: (() => void)[] = []

    if (!projectId && isLoggedIn) {
      // create the project
      const { document, session } = getSnapshot(editor.store)
      createProject(document)
    }

    if (projectId && isLoggedIn && !readOnly) {
      const listener = editor.store.listen(
        (update) => {
          // to-do debounce
          const { document, session } = getSnapshot(editor.store)
          saveProject(document)
        },
        { scope: 'document', source: 'user' })

      listeners.push(listener)
    }

    return () => {
      listeners.forEach((l) => l())
    }

  }, [editor, readOnly])


  const saveProject = async (project: any) => {
    // to-do
    console.log(project)
  }

  const createProject = async (project: any) => {
    // to-do
    console.log(project)
    // setProjectId(project.id)
  }

  const getProjectSnapshotById = async (projectId: string) => {
    // to-do
    console.log(projectId)
    return {}
  }

  return {
    store: storeWithStatus,
    projectId,
    setProjectId,
    setEditor
  }
}
