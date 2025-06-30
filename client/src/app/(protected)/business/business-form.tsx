"use client";
import { getBusiness, updateBusiness } from "@/apis/business";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const businessSchema = z.object({
  code: z.string(),
  name: z.string().min(1, {
    message: "Business name is required",
  }),
  address: z.string().min(1, {
    message: "Business address is required",
  }),
});

export type TUpdateBusinessSchema = z.infer<typeof businessSchema>;

export default function BusinessForm() {
  const form = useForm<TUpdateBusinessSchema>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      code: "",
      name: "",
      address: "",
    },
  });

  useEffect(() => {
    (async () => {
      const data = await getBusiness();
      if (!data.ok) {
        toast("System error", {
          description: data.error.message,
        });
        return;
      }
      form.reset(data.business);
    })();
  }, [form]);

  const onSubmit = async (values: TUpdateBusinessSchema) => {
    console.log(values);
    const data = await updateBusiness(values);
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

    form.reset(data.business);
    toast.success("Updated successfully.");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-6 py-4 ">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business code</FormLabel>
                <FormControl>
                  <Input type="text" {...field} readOnly disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
          <Button
            type="submit"
            disabled={form.formState.isSubmitting || !form.formState.isDirty}
          >
            {form.formState.isSubmitting ? (
              <Spinner size="small" className="text-background" />
            ) : (
              "Update"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
