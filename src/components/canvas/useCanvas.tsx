'use client'
import { useCallback, useEffect, useRef, useState } from "react"
import { Editor, getSnapshot, TLStoreSnapshot } from "tldraw"
import { trpc } from "@/server/client";
import { v4 as uuidv4 } from 'uuid';
import { useDebounce } from "./useDebounce";

interface Props {
  initialProjectId?: string
  isLoggedIn: boolean
  readOnly: boolean
}

export default function useCanvas({ initialProjectId, isLoggedIn, readOnly }: Props) {
  const [projectId, setProjectId] = useState<string | undefined>(initialProjectId)
  const [editor, setEditor] = useState<Editor | null>(null)
  const [status, setStatus] = useState<'loading' | 'idle' | 'error'>('loading')
  const snapshotResponse = trpc.projects.getSnapshotById.useQuery({ id: projectId ?? '' }, { enabled: !!projectId })
  const updateSnapshotMutation = trpc.projects.updateSnapshot.useMutation()
  const createProjectMutation = trpc.projects.create.useMutation()
  const guestPersistenceKey = useRef<string | undefined>(projectId ? undefined : `guest-editor-${uuidv4()}`);


  useEffect(() => {
    if (snapshotResponse.status === 'success' && editor) {
      editor.loadSnapshot(snapshotResponse.data)
      setStatus('idle')
    } else if (snapshotResponse.status === 'error') {
      setStatus('error')
    }
  }, [snapshotResponse.status, editor])


  useEffect(() => {
    if (!editor) return;

    editor.updateInstanceState({ isReadonly: readOnly });
  }, [editor, readOnly]);


  const updateSnapshot = useCallback(
    async (projectId: string, document: TLStoreSnapshot) => {
      try {
        await updateSnapshotMutation.mutateAsync({
          id: projectId,
          snapshot: JSON.stringify(document),
        });
        setStatus('idle');
      } catch (error) {
        console.error(error);
        setStatus('error');
      }
    },
    [updateSnapshotMutation]
  );

  const debouncedUpdateSnapshot = useDebounce(
    (editorInstance: Editor | null, currentProjectId: string | undefined) => {
      if (editorInstance && currentProjectId) {
        const { document } = getSnapshot(editorInstance.store);
        updateSnapshot(currentProjectId, document);
      }
    },
    500
  );

  useEffect(() => {
    const listeners: (() => void)[] = [];
    if (!editor || !projectId || !isLoggedIn || readOnly) return;

    const listener = editor.store.listen(
      () => {
        debouncedUpdateSnapshot(editor, projectId);
      },
      { scope: 'document', source: 'user' }
    );
    listeners.push(listener);

    return () => {
      listeners.forEach((l) => l());
    };
  }, [editor, projectId, isLoggedIn, readOnly, debouncedUpdateSnapshot]);


  useEffect(() => {
    async function createNewProject() {
      if (!editor) return;
      const { document } = getSnapshot(editor.store);
      try {
        const project = await createProjectMutation.mutateAsync({
          title: "New project",
          snapshot: JSON.stringify(document),
        });
        setProjectId(project.id);
        guestPersistenceKey.current = undefined;
      } catch (error) {
        console.error(error);
        setStatus('error');
      }
    }

    if (!projectId && isLoggedIn && editor) {
      createNewProject();
    } else if (!projectId) {
      setStatus('idle');
    }
  }, [isLoggedIn, editor, projectId, createProjectMutation]);

  return {
    setEditor,
    status,
    guestPersistenceKey: guestPersistenceKey.current
  }
}
