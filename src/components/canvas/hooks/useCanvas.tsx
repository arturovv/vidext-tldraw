'use client'
import { useCallback, useEffect, useState } from "react"
import { Editor, getSnapshot } from "tldraw"
import { trpc } from "@/server/client";
import { useDebounce } from "./useDebounce";

interface Props {
  initialProjectId?: string
  isLoggedIn: boolean
  readOnly: boolean
}

const LS_HAS_CHANGES_KEY = 'hasChanges'
const LS_GUEST_PERSISTENCE_KEY = 'guestPersistenceKey'

export default function useCanvas({ initialProjectId, isLoggedIn, readOnly }: Props) {
  const [projectId, setProjectId] = useState<string | undefined>(initialProjectId)
  const [editor, setEditor] = useState<Editor | null>(null)
  const [status, setStatus] = useState<'loading' | 'idle' | 'error'>('loading')
  const [guestPersistenceKey, setGuestPersistenceKey] = useState<string | undefined>(undefined)
  const snapshotQuery = trpc.projects.getSnapshotById.useQuery({ id: projectId ?? '' }, { enabled: !!projectId })
  const getActiveProjectQuery = trpc.projects.getUserActiveProject.useQuery(undefined, { enabled: isLoggedIn && !projectId });
  const updateSnapshotMutation = trpc.projects.updateSnapshot.useMutation()
  const createProjectMutation = trpc.projects.create.useMutation()

  useEffect(() => {
    const item = localStorage.getItem(LS_GUEST_PERSISTENCE_KEY)
    if (item) {
      setGuestPersistenceKey(item)
    } else {
      const guestPersistenceKey = crypto.randomUUID()
      localStorage.setItem(LS_GUEST_PERSISTENCE_KEY, guestPersistenceKey)
      setGuestPersistenceKey(guestPersistenceKey)
    }
  }, [])

  useEffect(() => {
    if (snapshotQuery.status === 'success' && editor) {
      editor.loadSnapshot(snapshotQuery.data)
      setStatus('idle')
    } else if (snapshotQuery.status === 'error') {
      setStatus('error')
    }
  }, [snapshotQuery.status, editor])


  useEffect(() => {
    if (!editor) return;

    editor.updateInstanceState({ isReadonly: readOnly });
  }, [editor, readOnly]);


  const updateSnapshot = useCallback(
    async (editorInstance: Editor, projectId: string) => {
      try {
        const { document } = getSnapshot(editorInstance.store);
        await updateSnapshotMutation.mutateAsync({
          id: projectId,
          snapshot: JSON.stringify(document),
        });
      } catch (error) {
        console.error(error);
        setStatus('error');
      }
    },
    [updateSnapshotMutation]
  );

  const debouncedUpdateSnapshot = useDebounce(updateSnapshot, 500);

  useEffect(() => {
    if (!editor || readOnly) return;

    const unlisten = editor.store.listen(
      () => {
        if (!projectId || !isLoggedIn) {
          localStorage.setItem(LS_HAS_CHANGES_KEY, 'true');
          unlisten();
        } else {
          debouncedUpdateSnapshot(editor, projectId);
        }
      },
      { scope: 'document', source: 'user' }
    );

    return () => {
      unlisten();
    };
  }, [editor, projectId, debouncedUpdateSnapshot]);


  useEffect(() => {
    if (!editor || projectId || getActiveProjectQuery.isLoading || !guestPersistenceKey) return;

    async function createNewProject(editorInstance: Editor) {
      const { document } = getSnapshot(editorInstance.store);
      try {
        const project = await createProjectMutation.mutateAsync({
          title: "New project",
          snapshot: JSON.stringify(document),
        });
        setProjectId(project.id);
        setGuestPersistenceKey(undefined);

        localStorage.removeItem(LS_HAS_CHANGES_KEY);
        localStorage.removeItem(LS_GUEST_PERSISTENCE_KEY);
      } catch (error) {
        console.error(error);
        setStatus('error');
      }
    }

    async function loadActiveProject(editorInstance: Editor) {
      if (getActiveProjectQuery.data) {
        setProjectId(getActiveProjectQuery.data.id);
        setGuestPersistenceKey(undefined)
      } else {
        // No hay proyecto activo, crear uno vacío
        await createNewProject(editorInstance);
      }
    }

    if (isLoggedIn) {

      if (localStorage.getItem(LS_HAS_CHANGES_KEY)) {
        // si el usuario ha hecho cambios, crear un nuevo proyecto partiendo de lo que haya en el editor
        createNewProject(editor);
      } else if (getActiveProjectQuery.isSuccess) {
        // Cargar el proyecto activo existente
        loadActiveProject(editor);
      } else if (getActiveProjectQuery.isError) {
        setStatus('error');
      }
    } else {
      // guest mode
      setStatus('idle');
    }

  }, [projectId, editor, getActiveProjectQuery.status, guestPersistenceKey]);

  return {
    setEditor,
    status,
    guestPersistenceKey
  }
}
