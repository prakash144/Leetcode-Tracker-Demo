"use client";

import { useCallback, useEffect, useState } from "react";
import type { CustomList } from "@/lib/progressTypes";
import * as listService from "@/services/firebase/customListService";

export const useCustomLists = (uid?: string | null) => {
  const [lists, setLists] = useState<CustomList[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!uid) {
      setLists([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await listService.getUserCustomLists(uid);
      setLists(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load lists");
    } finally {
      setLoading(false);
    }
  }, [uid]);

  useEffect(() => {
    reload();
  }, [reload]);

  const create = useCallback(
    async (name: string, description?: string) => {
      if (!uid) return;
      await listService.createCustomList(uid, name, description || "");
      await reload();
    },
    [uid, reload]
  );

  const rename = useCallback(
    async (listId: string, name: string) => {
      if (!uid) return;
      await listService.renameCustomList(uid, listId, name);
      await reload();
    },
    [uid, reload]
  );

  const remove = useCallback(
    async (listId: string) => {
      if (!uid) return;
      await listService.deleteCustomList(uid, listId);
      await reload();
    },
    [uid, reload]
  );

  const addProblem = useCallback(
    async (listId: string, problemId: string) => {
      if (!uid) return;
      await listService.addProblemToList(uid, listId, problemId);
      setLists((prev) =>
        prev.map((list) =>
          list.id === listId
            ? { ...list, problemIds: [...list.problemIds, problemId] }
            : list
        )
      );
    },
    [uid]
  );

  const removeProblem = useCallback(
    async (listId: string, problemId: string) => {
      if (!uid) return;
      await listService.removeProblemFromList(uid, listId, problemId);
      setLists((prev) =>
        prev.map((list) =>
          list.id === listId
            ? { ...list, problemIds: list.problemIds.filter((id) => id !== problemId) }
            : list
        )
      );
    },
    [uid]
  );

  const isProblemInAnyList = useCallback(
    (problemId: string): string[] => {
      return lists
        .filter((l) => l.problemIds.includes(problemId))
        .map((l) => l.id);
    },
    [lists]
  );

  return {
    lists,
    loading,
    error,
    reload,
    create,
    rename,
    remove,
    addProblem,
    removeProblem,
    isProblemInAnyList,
  };
};
