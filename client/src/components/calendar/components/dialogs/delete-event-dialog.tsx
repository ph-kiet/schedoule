"use client";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { IEvent } from "../../interfaces";
import React, { useState } from "react";
import useCalendarStore from "@/stores/calendar-store";
import { deleteRoster } from "@/apis/roster";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

interface IProps {
  event: IEvent;
  children: React.ReactNode;
}

export function DeleteEventDialog({ event, children }: IProps) {
  const { deleteEvent } = useCalendarStore();
  const [isLoading, setIsLoading] = useState(false);
  const handleDelete = async () => {
    setIsLoading(true);
    const data = await deleteRoster(event._id);
    if (!data.ok) {
      if (data.error.type === "system") {
        toast("System error", {
          description: data.error.message,
        });
      }
      return;
    }

    deleteEvent(event);
    toast.success("Roster deleted successfully");
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure want to delete this assignment?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? (
              <Spinner size="small" className="text-background" />
            ) : (
              "Delete"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
