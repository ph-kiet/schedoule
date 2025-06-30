"use client";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { IEmployee } from "@/types/interfaces";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { updateEmployeeDetails } from "@/apis/employees";
import { toast } from "sonner";
import useEmployeeStore from "@/stores/employee-store";

interface IProps {
  employee: IEmployee;
}

const formSchema = z.object({
  id: z.string().min(1, {
    message: "ID is required",
  }),
  employeeId: z.string().min(1, {
    message: "Employee ID is required",
  }),
  firstName: z.string().min(1, {
    message: "First name is required",
  }),
  lastName: z.string().min(1, {
    message: "Last name is required",
  }),
  email: z.string().email(),
  phoneNumber: z
    .string()
    .regex(
      new RegExp(/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/),
      "Invalid phone number"
    ),
  position: z.string().min(1, {
    message: "Position is required",
  }),
});

export default function EditEmployeeDialog({ employee }: IProps) {
  const { updateEmployee } = useEmployeeStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: employee._id,
      employeeId: employee.employeeId,
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phoneNumber: employee.phoneNumber,
      position: employee.position,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const data = await updateEmployeeDetails(values.id, values);
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

    updateEmployee(data.employee);
    toast.success("Employee details updated successfully");
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Edit employee details</DialogTitle>
      </DialogHeader>
      <div className="py-4">
        <Form {...form}>
          <form
            id="edit-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4"
          >
            <FormField
              control={form.control}
              name="employeeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID</FormLabel>
                  <FormControl>
                    <Input
                      disabled
                      className="bg-gray-100 cursor-not-allowed"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last name</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone number</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
      <DialogFooter>
        <Button
          type="submit"
          form="edit-form"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <Spinner size="small" className="text-background" />
          ) : (
            "Update"
          )}
        </Button>
      </DialogFooter>
    </>
  );
}
