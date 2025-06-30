import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DialogHeader } from "@/components/ui/dialog";
import { IEmployee } from "@/types/interfaces";
import { DialogTitle } from "@radix-ui/react-dialog";
import { IdCard, Mail, Phone, User } from "lucide-react";

interface IProps {
  employee: IEmployee;
}

export default function ViewEmployeeDialog({ employee }: IProps) {
  return (
    <>
      <DialogHeader>
        <DialogTitle>
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage
                src={employee.avatarUrl ?? undefined}
                alt={employee.fullName}
              />
              <AvatarFallback className="text-xxs">
                {employee.firstName[0]}
                {employee.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <p>{employee.fullName}</p>
          </div>
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        <div className="flex items-start gap-2">
          <IdCard className="mt-1 size-4.5 shrink-0" />
          <div>
            <p className="text-sm font-medium">Employee ID</p>
            <p className="text-sm text-muted-foreground">
              {employee.employeeId}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Mail className="mt-1 size-4 shrink-0" />
          <div>
            <p className="text-sm font-medium">Email</p>
            <p className="text-sm text-muted-foreground">{employee.email}</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Phone className="mt-1 size-4 shrink-0" />
          <div>
            <p className="text-sm font-medium">Phone number</p>
            <p className="text-sm text-muted-foreground">
              {employee.phoneNumber}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <User className="mt-1 size-4 shrink-0" />
          <div>
            <p className="text-sm font-medium">Position</p>
            <p className="text-sm text-muted-foreground">{employee.position}</p>
          </div>
        </div>
      </div>
    </>
  );
}
