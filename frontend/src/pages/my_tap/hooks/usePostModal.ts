import { useCallback, useMemo, useState } from "react";

export type WithId = { id: string };

export function usePostModal<T extends WithId>(list: T[]) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const open = useCallback((id: string) => setSelectedId(id), []);
  const close = useCallback(() => setSelectedId(null), []);

  const index = useMemo(
    () => (selectedId ? list.findIndex((p) => p.id === selectedId) : -1),
    [list, selectedId]
  );

  const isOpen = selectedId !== null;
  const prevId = index > 0 ? list[index - 1].id : null;
  const nextId = index >= 0 && index < list.length - 1 ? list[index + 1].id : null;

  const goPrev = useCallback(() => { if (prevId) setSelectedId(prevId); }, [prevId]);
  const goNext = useCallback(() => { if (nextId) setSelectedId(nextId); }, [nextId]);

  return { isOpen, selectedId, index, open, close, goPrev, goNext };
}
