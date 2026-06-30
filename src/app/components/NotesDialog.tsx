"use client";

import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import type { Problem } from "@/lib/progressTypes";

interface NotesDialogProps {
    problem: Problem;
    notes: string;
    disabled?: boolean;
    onSave: (problem: Problem, notes: string) => void;
    onRequireAuth?: () => void;
}

const NotesDialog = ({
                         problem,
                         notes,
                         disabled = false,
                         onSave,
                         onRequireAuth,
                     }: NotesDialogProps) => {
    const [draft, setDraft] = useState(notes);

    useEffect(() => {
        setDraft(notes);
    }, [notes]);

    const handleOpenChange = (open: boolean) => {
        if (open && disabled) {
            onRequireAuth?.();
        }
    };

    const handleSave = () => {
        if (disabled) {
            onRequireAuth?.();
            return;
        }

        onSave(problem, draft);
    };

    return (
        <Dialog.Root onOpenChange={handleOpenChange}>
            <Dialog.Trigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs text-foreground hover:text-foreground border border-border bg-secondary hover:bg-accent"
                >
                    Notes
                </Button>
            </Dialog.Trigger>
            {!disabled && (
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-background/80 z-40" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 max-w-md w-full bg-card border border-border text-foreground p-6 rounded-lg -translate-x-1/2 -translate-y-1/2 z-50">
                        <Dialog.Title className="text-lg font-semibold mb-3">
                            Notes
                        </Dialog.Title>
                        <textarea
                            value={draft}
                            onChange={(event) => setDraft(event.target.value)}
                            maxLength={4000}
                            aria-label="Notes"
                            className="w-full h-40 resize-none rounded-md border border-border bg-secondary p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                            placeholder={`Notes for ${problem.title}`}
                        />
                        <div className="flex justify-end gap-2 mt-4">
                            <Dialog.Close asChild>
                                <Button
                                    variant="outline"
                                    className="text-sm text-foreground hover:text-foreground border border-border bg-secondary hover:bg-accent"
                                >
                                    Close
                                </Button>
                            </Dialog.Close>
                            <Dialog.Close asChild>
                                <Button
                                    onClick={handleSave}
                                    variant="outline"
                                    className="text-sm text-foreground hover:text-foreground border border-border bg-secondary hover:bg-accent"
                                >
                                    Save
                                </Button>
                            </Dialog.Close>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            )}
        </Dialog.Root>
    );
};

export default NotesDialog;
