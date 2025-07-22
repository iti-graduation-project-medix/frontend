import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] bg-white dark:bg-background text-gray-900 dark:text-foreground">
        <DialogHeader>
          <DialogTitle className="dark:text-foreground">{title}</DialogTitle>
          {description && (
            <DialogDescription className="dark:text-gray-400">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              className="border-gray-200 dark:border-border bg-white dark:bg-background text-primary dark:text-primary"
            >
              {cancelText}
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-700 dark:hover:bg-red-800 dark:text-white"
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
