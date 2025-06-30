import { Row } from "@tanstack/react-table";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { IEmployee } from "@/types/interfaces";
import DeleteEmployeeDialog from "./dialogs/delete-employee-dialog";
import { ReactNode, useState } from "react";
import ViewEmployeeDialog from "./dialogs/view-employee-dialog";
import EditEmployeeDialog from "./dialogs/edit-employee-dialog";

interface IProps {
  row: Row<IEmployee>;
}

export function DataTableRowActions({ row }: IProps) {
  const employee = row.original;

  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [dialogContent, setDialogContent] = useState<ReactNode | null>(null);

  const handleViewDetails = () => {
    setDialogContent(<ViewEmployeeDialog employee={employee} />);
  };

  const handleEdit = () => {
    setDialogContent(<EditEmployeeDialog employee={employee} />);
  };

  return (
    <Dialog>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontal />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DialogTrigger asChild onClick={handleViewDetails}>
            <DropdownMenuItem>
              <Eye />
              View Details
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogTrigger asChild onClick={handleEdit}>
            <DropdownMenuItem>
              <Pencil />
              Edit
            </DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setShowDeleteDialog(true)}>
            <Trash2 className="text-red-600" />
            <span className="text-red-600">Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {dialogContent && <DialogContent>{dialogContent}</DialogContent>}
      <DeleteEmployeeDialog
        isOpen={showDeleteDialog}
        showActionToggle={setShowDeleteDialog}
        employee={employee}
      />
    </Dialog>
  );
}
