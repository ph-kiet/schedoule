"use client";

import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { checkOut } from "@/apis/attendance";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

interface IProps {
  isOpen: boolean;
  onToggle: () => void;
  token: string;
  setText: (text: string) => void;
}

export default function CheckOutDialog({
  isOpen,
  onToggle,
  token,
  setText,
}: IProps) {
  const [isLoading, setIsLoading] = useState(false);
  const hanldeCheckOut = async () => {
    setIsLoading(true);

    const data = await checkOut(token);
    onToggle();

    if (!data.ok) {
      setText(data.error.message);
      toast.error(data.error.message, { position: "bottom-center" });
      return;
    }

    setText(data.message);
    toast.success(data.message, { position: "bottom-center" });
  };

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Check out now at {format(new Date(), "HH:mm")}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            If you finished for the day, you can check out now.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <Button onClick={hanldeCheckOut} disabled={isLoading}>
            {isLoading ? (
              <Spinner size="small" className="text-background" />
            ) : (
              "Check Out"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
