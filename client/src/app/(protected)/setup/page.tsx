"use client";
import { createBusiness } from "@/apis/business";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const businessSchema = z.object({
  name: z.string().min(1, {
    message: "Business name is required",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters",
  }),
  address: z.string().min(1, {
    message: "Business address is required",
  }),
});

export type TBusinessSchema = z.infer<typeof businessSchema>;

export default function Page() {
  const router = useRouter();
  const form = useForm<TBusinessSchema>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      name: "",
      password: "",
      address: "",
    },
  });

  const onSubmit = async (values: TBusinessSchema) => {
    const data = await createBusiness(values);
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

    router.replace("/dashboard");
    toast.success("Everything is all set! Create your first employee now", {
      action: {
        label: "Employees",
        onClick: () => router.push("/employees"),
      },
      duration: 10000,
    });
  };

  return (
    <div>
      <div className="text-3xl font-bold">
        First step is to set up your business.
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="sm:w-[600px]">
          <div className="space-y-6 py-4 ">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business name</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business address</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    This will be your QR Code login credentials. Don&#39;t use
                    the same account password!
                  </FormDescription>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={form.formState.isSubmitting || !form.formState.isDirty}
            >
              {form.formState.isSubmitting ? (
                <Spinner size="small" className="text-background" />
              ) : (
                "Start using now"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
