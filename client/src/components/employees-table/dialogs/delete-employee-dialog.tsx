import { removeEmployee } from "@/apis/employees";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import useEmployeeStore from "@/stores/employee-store";
import { IEmployee } from "@/types/interfaces";
import { useState } from "react";
import { toast } from "sonner";

interface IProps {
  employee: IEmployee;
  isOpen: boolean;
  showActionToggle: (open: boolean) => void;
}

export default function DeleteEmployeeDialog({
  employee,
  isOpen,
  showActionToggle,
}: IProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { deleteEmployee } = useEmployeeStore();

  const handleDelete = async () => {
    setIsLoading(true);
    const data = await removeEmployee(employee._id);
    if (!data.ok) {
      if (data.error.type === "system") {
        toast("System error", {
          description: data.error.message,
        });
      }
      return;
    }
    deleteEmployee(employee);
    showActionToggle(false);
    toast.success("Employee deleted successfully");
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={showActionToggle}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Confirm</AlertDialogTitle>
          <AlertDialogDescription>
            Do you want to remove <b>{employee.fullName}</b> from your business?
            This action cannot be undone!
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
