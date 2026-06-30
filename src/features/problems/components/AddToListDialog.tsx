"use client";

import { useState, useMemo } from "react";
import { Check, ListPlus, Loader2, Plus, Search, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { CustomList } from "@/lib/progressTypes";

interface AddToListDialogProps {
  problemId: string;
  problemTitle: string;
  lists: CustomList[];
  isProblemInList: (problemId: string) => string[];
  onAddProblem: (listId: string, problemId: string) => Promise<void>;
  onRemoveProblem: (listId: string, problemId: string) => Promise<void>;
  onCreateList: (name: string, description?: string) => Promise<void>;
}

const AddToListDialog = ({
  problemId,
  problemTitle,
  lists,
  isProblemInList,
  onAddProblem,
  onRemoveProblem,
  onCreateList,
}: AddToListDialogProps) => {
  const [open, setOpen] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [search, setSearch] = useState("");
  const [toggling, setToggling] = useState<Set<string>>(new Set());

  const containedIn = isProblemInList(problemId);

  const filteredLists = useMemo(
    () =>
      search.trim()
        ? lists.filter((l) =>
            l.name.toLowerCase().includes(search.toLowerCase())
          )
        : lists,
    [lists, search]
  );

  const toggleList = async (listId: string) => {
    setToggling((prev) => new Set(prev).add(listId));
    try {
      if (containedIn.includes(listId)) {
        await onRemoveProblem(listId, problemId);
      } else {
        await onAddProblem(listId, problemId);
      }
    } finally {
      setToggling((prev) => {
        const next = new Set(prev);
        next.delete(listId);
        return next;
      });
    }
  };

  const handleCreateNew = async () => {
    if (!newName.trim()) return;
    await onCreateList(newName.trim(), newDesc.trim() || undefined);
    setNewName("");
    setNewDesc("");
    setShowNew(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 transition-colors border border-transparent hover:border-zinc-700/50"
          aria-label={`Add ${problemTitle} to list`}
        >
          <ListPlus className="size-3.5" />
          <span className="hidden sm:inline">Add to List</span>
        </button>
      </DialogTrigger>
      <DialogContent className="border-zinc-700 bg-zinc-900 text-white sm:max-w-sm gap-0 p-0">
        <DialogHeader className="px-4 pt-4 pb-3 border-b border-zinc-800">
          <DialogTitle className="text-sm font-semibold text-white">
            Add to List
          </DialogTitle>
          <p className="text-xs text-zinc-500 truncate mt-0.5">{problemTitle}</p>
          <div className="relative mt-2">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-zinc-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Search lists..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border border-zinc-700 bg-zinc-800 pl-8 pr-8 py-1.5 text-sm text-white placeholder-zinc-500 focus:border-green-500 focus:outline-none transition-colors"
              autoComplete="off"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
        </DialogHeader>

        <div className="max-h-60 overflow-y-auto px-1 py-1">
          {lists.length === 0 && !showNew ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <ListPlus className="size-8 text-zinc-600" />
              <p className="text-xs text-zinc-500">No lists yet. Create one to get started.</p>
            </div>
          ) : filteredLists.length === 0 && search ? (
            <div className="py-6 text-center">
              <p className="text-xs text-zinc-500">No lists matching &ldquo;{search}&rdquo;</p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {filteredLists.map((list) => {
                const checked = containedIn.includes(list.id);
                const loading = toggling.has(list.id);
                return (
                  <button
                    key={list.id}
                    type="button"
                    disabled={loading}
                    onClick={() => toggleList(list.id)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                      checked
                        ? "bg-green-500/10 text-green-300"
                        : "text-zinc-300 hover:bg-zinc-800/80"
                    } ${loading ? "opacity-50 cursor-wait" : "cursor-pointer"}`}
                  >
                    <span
                      className={`flex size-4 shrink-0 items-center justify-center rounded border transition-colors ${
                        checked
                          ? "border-green-500 bg-green-500 text-black"
                          : "border-zinc-600 bg-zinc-800"
                      }`}
                    >
                      {loading ? (
                        <Loader2 className="size-3 animate-spin" />
                      ) : checked ? (
                        <Check className="size-3" />
                      ) : null}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className="block truncate">{list.name}</span>
                      {list.description && (
                        <span className="block text-xs text-zinc-600 truncate mt-0.5">
                          {list.description}
                        </span>
                      )}
                    </div>
                    <span className="ml-2 text-xs text-zinc-500 shrink-0">{list.problemIds.length}</span>
                  </button>
                );
              })}
            </div>
          )}

          {showNew && (
            <div className="border-t border-zinc-800 px-3 py-3 mt-1">
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="List name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreateNew()}
                  className="flex-1 rounded-md border border-zinc-700 bg-zinc-800 px-2.5 py-1.5 text-sm text-white placeholder-zinc-500 focus:border-green-500 focus:outline-none transition-colors"
                  autoFocus
                />
                <Button
                  type="button"
                  size="sm"
                  disabled={!newName.trim()}
                  onClick={handleCreateNew}
                  className="bg-green-500 text-black hover:bg-green-400 h-8 px-3 text-xs shrink-0"
                >
                  Create
                </Button>
              </div>
              <input
                type="text"
                placeholder="Description (optional)"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateNew()}
                className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-2.5 py-1.5 text-sm text-white placeholder-zinc-500 focus:border-green-500 focus:outline-none transition-colors"
              />
            </div>
          )}
        </div>

        {!showNew && (
          <div className="border-t border-zinc-800 px-3 py-2">
            <button
              type="button"
              onClick={() => setShowNew(true)}
              className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 transition-colors"
            >
              <Plus className="size-4" />
              Create new list
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddToListDialog;
