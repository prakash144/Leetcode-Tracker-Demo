"use client";

import { useState } from "react";
import { Check, ListPlus, Plus } from "lucide-react";
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

  const containedIn = isProblemInList(problemId);

  const toggleList = async (listId: string) => {
    if (containedIn.includes(listId)) {
      await onRemoveProblem(listId, problemId);
    } else {
      await onAddProblem(listId, problemId);
    }
  };

  const handleCreateNew = async () => {
    if (!newName.trim()) return;
    await onCreateList(newName.trim());
    setNewName("");
    setShowNew(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          aria-label={`Add ${problemTitle} to list`}
        >
          <ListPlus className="size-3.5" />
          Add to List
        </button>
      </DialogTrigger>
      <DialogContent className="border-zinc-700 bg-zinc-900 text-white sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold text-white">
            Add to List
          </DialogTitle>
          <p className="text-xs text-zinc-500 truncate">{problemTitle}</p>
        </DialogHeader>
        <div className="space-y-1 max-h-60 overflow-y-auto">
          {lists.length === 0 && !showNew && (
            <p className="text-xs text-zinc-500 py-2">No lists yet. Create one to get started.</p>
          )}
          {lists.map((list) => {
            const checked = containedIn.includes(list.id);
            return (
              <button
                key={list.id}
                type="button"
                onClick={() => toggleList(list.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  checked
                    ? "bg-green-500/10 text-green-300"
                    : "text-zinc-300 hover:bg-zinc-800"
                }`}
              >
                <span
                  className={`flex size-4 shrink-0 items-center justify-center rounded border ${
                    checked
                      ? "border-green-500 bg-green-500 text-black"
                      : "border-zinc-600 bg-zinc-800"
                  }`}
                >
                  {checked && <Check className="size-3" />}
                </span>
                <span className="truncate">{list.name}</span>
                <span className="ml-auto text-xs text-zinc-500">{list.problemIds.length}</span>
              </button>
            );
          })}
          {showNew && (
            <div className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder="New list name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateNew()}
                className="flex-1 rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1.5 text-sm text-white placeholder-zinc-500 focus:border-green-500 focus:outline-none"
                autoFocus
              />
              <Button
                type="button"
                size="sm"
                disabled={!newName.trim()}
                onClick={handleCreateNew}
                className="bg-green-500 text-black hover:bg-green-400 h-8 px-3 text-xs"
              >
                Create
              </Button>
            </div>
          )}
          {!showNew && (
            <button
              type="button"
              onClick={() => setShowNew(true)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
            >
              <Plus className="size-4" />
              Create new list
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddToListDialog;