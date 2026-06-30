"use client";

import { useState } from "react";
import {
  ExternalLink,
  FolderKanban,
  ListPlus,
  PencilLine,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import Footer from "@/app/components/Footer";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import ErrorState from "@/components/states/ErrorState";
import LoadingState from "@/components/states/LoadingState";
import { Button } from "@/components/ui/button";
import { useProblemWorkspaceData } from "@/features/problems/hooks/useProblemWorkspaceData";
import { useCustomLists } from "@/hooks/useCustomLists";

const MyListsPage = () => {
  const { auth, questionsState } = useProblemWorkspaceData();
  const {
    lists,
    loading,
    error,
    create,
    rename,
    remove,
  } = useCustomLists(auth.user?.uid);

  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const progressMap = questionsState.questions.reduce<Record<string, boolean>>((acc, q) => {
    acc[q.problemId] = true;
    return acc;
  }, {});

  const handleCreate = async () => {
    if (!newName.trim()) return;
    await create(newName.trim(), newDesc.trim());
    setNewName("");
    setNewDesc("");
    setShowCreate(false);
  };

  const handleRename = async (listId: string) => {
    if (!editName.trim()) return;
    await rename(listId, editName.trim());
    setEditingId(null);
    setEditName("");
  };

  const handleDelete = async (listId: string) => {
    if (!window.confirm("Delete this list? Problems will not be affected.")) return;
    await remove(listId);
  };

  return (
    <AppShell
      user={auth.user}
      authLoading={auth.loading}
      isAuthConfigured={auth.isConfigured}
      onLogin={auth.login}
      onLogout={auth.logout}
      footer={<Footer />}
    >
      <PageHeader
        eyebrow="My Lists"
        title="Problem Collections"
        description="Organize problems into custom lists for focused interview prep."
        actions={
          auth.user && (
            <Button
              type="button"
              onClick={() => setShowCreate(true)}
              className="bg-green-500 text-black hover:bg-green-400"
            >
              <Plus className="size-4" />
              New List
            </Button>
          )
        }
      />

      <div className="mx-auto max-w-7xl space-y-6 p-4 sm:px-6 lg:px-8 pb-12">
        {!auth.user && (
          <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-900/70 px-4 py-12 text-center">
            <FolderKanban className="mx-auto size-10 text-zinc-600 mb-3" />
            <p className="text-sm text-zinc-400">Sign in to create and manage custom problem lists.</p>
          </div>
        )}

        {error && <ErrorState message={error} />}
        {loading && <LoadingState message="Loading lists..." />}

        {auth.user && !loading && !error && (
          <>
            {showCreate && (
              <section className="rounded-xl border border-green-500/30 bg-green-500/5 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-white">New List</h3>
                  <button
                    type="button"
                    onClick={() => setShowCreate(false)}
                    className="text-zinc-500 hover:text-zinc-300"
                    aria-label="Cancel"
                  >
                    <X className="size-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="List name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-green-500 focus:outline-none"
                    autoFocus
                  />
                  <input
                    type="text"
                    placeholder="Description (optional)"
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-green-500 focus:outline-none"
                  />
                  <Button
                    type="button"
                    size="sm"
                    disabled={!newName.trim()}
                    onClick={handleCreate}
                    className="bg-green-500 text-black hover:bg-green-400"
                  >
                    <ListPlus className="size-4" />
                    Create List
                  </Button>
                </div>
              </section>
            )}

            {lists.length === 0 && !showCreate && (
              <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-900/70 px-4 py-12 text-center">
                <FolderKanban className="mx-auto size-10 text-zinc-600 mb-3" />
                <p className="text-sm text-zinc-400">No lists yet. Create your first list to start organizing problems.</p>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {lists.map((list) => {
                const visibleCount = list.problemIds.filter((id) => progressMap[id]).length;
                return (
                  <div
                    key={list.id}
                    className="flex flex-col rounded-xl border border-zinc-800 bg-zinc-900/80 p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      {editingId === list.id ? (
                        <div className="flex-1 flex gap-2">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleRename(list.id)}
                            className="flex-1 rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1 text-sm text-white focus:border-green-500 focus:outline-none"
                            autoFocus
                          />
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => handleRename(list.id)}
                            className="bg-green-500 text-black h-7 px-2 text-xs hover:bg-green-400"
                          >
                            Save
                          </Button>
                        </div>
                      ) : (
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-sm font-semibold text-white">{list.name}</h3>
                          {list.description && (
                            <p className="mt-0.5 truncate text-xs text-zinc-500">{list.description}</p>
                          )}
                        </div>
                      )}
                      <div className="flex shrink-0 gap-1">
                        {editingId !== list.id && (
                          <button
                            type="button"
                            onClick={() => { setEditingId(list.id); setEditName(list.name); }}
                            className="rounded p-1 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
                            aria-label="Rename list"
                          >
                            <PencilLine className="size-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDelete(list.id)}
                          className="rounded p-1 text-zinc-500 hover:text-red-400 hover:bg-zinc-800"
                          aria-label="Delete list"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-3 text-xs text-zinc-500">
                      <span>
                        <span className="text-zinc-200 font-medium">{list.problemIds.length}</span> problems
                      </span>
                      {visibleCount > 0 && (
                        <span>
                          <span className="text-green-400 font-medium">{visibleCount}</span> in dataset
                        </span>
                      )}
                    </div>

                    {list.problemIds.length > 0 && (
                      <div className="mt-3 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-green-500"
                          style={{ width: `${Math.min(100, (visibleCount / Math.max(list.problemIds.length, 1)) * 100)}%` }}
                        />
                      </div>
                    )}

                    <div className="mt-4 flex gap-2">
                      <Button
                        asChild
                        type="button"
                        variant="outline"
                        size="sm"
                        className="border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700 h-7 text-xs"
                      >
                        <a href="/problems" className="inline-flex items-center gap-1.5">
                          <ExternalLink className="size-3" />
                          Open Problems
                        </a>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
};

export default MyListsPage;