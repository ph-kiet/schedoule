"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IEvent } from "../../interfaces";
import React from "react";
import { Calendar, Clock, Text } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import EditEventDialog from "./edit-event.dialog";
import { Button } from "@/components/ui/button";
import { DeleteEventDialog } from "./delete-event-dialog";
import useAuthStore from "@/stores/auth-store";

interface IProps {
  children: React.ReactNode;
  event: IEvent;
}

export default function EventDetailsDialog({ event, children }: IProps) {
  const { user } = useAuthStore();
  const startDate = parseISO(event.startDate);
  const endDate = parseISO(event.endDate);
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage
                  src={event.employee.avatarUrl ?? undefined}
                  alt={event.employee.fullName}
                />
                <AvatarFallback className="text-xxs">
                  {event.employee.firstName[0]}
                  {event.employee.lastName[0]}
                </AvatarFallback>
              </Avatar>

              <p>{event.employee.fullName}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* <div className="flex items-start gap-2">
              <User className="mt-1 size-4 shrink-0" />
              <div>
                <p className="text-sm font-medium">Responsible</p>
                <p className="text-sm text-muted-foreground">{event.user.name}</p>
              </div>
            </div> */}

          <div className="flex items-start gap-2">
            <Calendar className="mt-1 size-4 shrink-0" />
            <div>
              <p className="text-sm font-medium">Start Date</p>
              <p className="text-sm text-muted-foreground">
                {format(startDate, "MMM d, yyyy h:mm a")}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Calendar className="mt-1 size-4 shrink-0" />
            <div>
              <p className="text-sm font-medium">End Date</p>
              <p className="text-sm text-muted-foreground">
                {format(endDate, "MMM d, yyyy h:mm a")}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Clock className="mt-1 size-4 shrink-0" />
            <div>
              <p className="text-sm font-medium">Break time</p>
              <p className="text-sm text-muted-foreground">
                {event.breakTime} minutes
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Text className="mt-1 size-4 shrink-0" />
            <div>
              <p className="text-sm font-medium">Description</p>
              <p className="text-sm text-muted-foreground">
                {event.description}
              </p>
            </div>
          </div>
        </div>
        {user?.role === "user" && (
          <DialogFooter>
            <DeleteEventDialog event={event}>
              <Button type="button" variant="ghost">
                Delete
              </Button>
            </DeleteEventDialog>

            {/* TODO: This doesn't get updated if the the parent component (EventDetailsDialog) doesn't close after updating */}
            <EditEventDialog event={event}>
              <Button type="button" variant="outline">
                Edit
              </Button>
            </EditEventDialog>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
