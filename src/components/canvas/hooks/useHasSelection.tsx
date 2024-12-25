import { useState, useEffect } from 'react';
import { Editor } from "tldraw"

function useHasSelection(editor: Editor | null) {
  const [hasSelection, setHasSelection] = useState(false);

  useEffect(() => {
    if (editor) {
      const updateSelectionState = () => {
        setHasSelection(editor.getSelectedShapeIds().length > 0);
      };

      // Actualiza el estado inicial al montar el componente
      updateSelectionState();

      // Suscríbete a los eventos de cambio de selección del editor
      editor.on('change', updateSelectionState);

      // Limpia la suscripción al desmontar el componente
      return () => {
        editor.off('change', updateSelectionState);
      };
    }
  }, [editor]);

  return hasSelection;
}

export default useHasSelection;