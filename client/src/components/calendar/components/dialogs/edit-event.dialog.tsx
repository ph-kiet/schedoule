"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useDisclosure } from "@/hooks/use-disclosure";
import React, { useState } from "react";
import {
  Form,
  FormField,
  FormLabel,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DateTimePicker } from "@/components/form/date-time-picker";
import { Textarea } from "@/components/ui/textarea";
import useCalendarStore from "@/stores/calendar-store";
import { IEvent } from "../../interfaces";
import useEmployeeStore from "@/stores/employee-store";
import { Input } from "@/components/ui/input";
import { rosterSchema, TRosterSchema } from "@/schemas/rosterSchema";
import { Spinner } from "@/components/ui/spinner";
import { updateRoster } from "@/apis/roster";
import { toast } from "sonner";

interface IProps {
  event: IEvent;
  children: React.ReactNode;
}

export default function EditEventDialog({ event, children }: IProps) {
  const { isOpen, onClose, onToggle } = useDisclosure();
  const { updateEvent } = useCalendarStore();
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false); // This is for fixing Shadcn combobox error

  const { employees } = useEmployeeStore();

  const form = useForm<TRosterSchema>({
    resolver: zodResolver(rosterSchema),
    defaultValues: {
      employeeId: event.employee._id,
      startDate: new Date(event.startDate),
      endDate: new Date(event.endDate),
      breakTime: event.breakTime,
      description: event.description,
    },
  });

  const onSubmit = async (values: TRosterSchema) => {
    const foundEmployee = employees.find(
      (employee) => employee._id === values.employeeId
    );

    if (!foundEmployee) return;

    const data = await updateRoster(event._id, values);

    if (!data.ok) {
      if (data.error.type === "system") {
        toast("System error", {
          description: data.error.message,
        });
      } else {
        form.setError(data.error.type, { message: data.error.message });
      }
      return;
    }

    updateEvent({
      _id: data.roster._id,
      employee: foundEmployee,
      startDate: values.startDate.toISOString(),
      endDate: values.endDate.toISOString(),
      breakTime: values.breakTime,
      description: values.description,
    });

    onClose();
    form.reset();
    console.log(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onToggle}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Employee</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            id="edit-event-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 py-4"
          >
            <FormField
              control={form.control}
              name="employeeId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Assign to</FormLabel>
                  <Popover
                    open={popoverOpen}
                    onOpenChange={setPopoverOpen}
                    modal={true}
                  >
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? employees.find((user) => user._id === field.value)
                                ?.fullName
                            : "Select an employee"}

                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                      <Command>
                        <CommandInput placeholder="Search employee..." />
                        <CommandList>
                          <CommandEmpty>No employee found.</CommandEmpty>
                          <CommandGroup>
                            {employees.map((employee) => (
                              <CommandItem
                                value={employee.fullName}
                                key={employee._id}
                                onSelect={() => {
                                  form.clearErrors("employeeId");
                                  form.setValue("employeeId", employee._id);
                                  setPopoverOpen(false);
                                }}
                              >
                                <div className="flex items-center gap-2">
                                  <Avatar key={employee._id} className="size-6">
                                    <AvatarImage
                                      src={employee.avatarUrl ?? undefined}
                                      alt={employee.fullName}
                                    />
                                    <AvatarFallback className="text-xxs">
                                      {employee.firstName[0]}
                                      {employee.lastName[0]}
                                    </AvatarFallback>
                                  </Avatar>

                                  <p className="truncate">
                                    {employee.fullName}
                                  </p>
                                </div>
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    employee._id === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startDate"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Start Date and Time</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      date={field.value}
                      setDate={(date) => field.onChange(date)}
                      error={fieldState.error?.message}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endDate"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>End Date and Time</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      date={field.value}
                      setDate={(date) => field.onChange(date)}
                      error={fieldState.error?.message}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="breakTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Break time (minute)</FormLabel>

                  <FormControl>
                    <Input type="number" {...field} step={5} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>

                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value}
                      data-invalid={fieldState.invalid}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>

          <Button
            form="edit-event-form"
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <Spinner size="small" className="text-background" />
            ) : (
              "Save changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
