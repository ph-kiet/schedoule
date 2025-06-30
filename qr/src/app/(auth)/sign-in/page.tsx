"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signIn } from "@/apis/auth";
import { signInSchema } from "@/schemas/authSchema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  businessCode: z
    .string()
    .regex(new RegExp("^[0-9]+$"), {
      message: "Invalid business code",
    })
    .min(1, {
      message: "Bussiness code is required",
    }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters",
  }),
});

export default function Page() {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessCode: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const data = await signIn(signInSchema.parse(values));
    if (!data.ok) {
      if (data.error.type === "system") {
        toast.error(data.error.message);
      } else {
        form.setError(data.error.type, { message: data.error.message });
      }
      return;
    }

    setIsRedirecting(true);
    router.replace("/");
  };
  return (
    <Card className="mx-auto w-96">
      <CardHeader>
        <CardTitle className="text-2xl">Sign in for QR code</CardTitle>
        <CardDescription>
          Enter your details below to view the QR code
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="businessCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business code</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center">
                        <FormLabel>Password</FormLabel>
                      </div>
                      <FormControl>
                        <Input {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {form.formState.errors.root && (
                <p className="text-destructive text-sm">
                  {form.formState.errors.root.message}
                </p>
              )}

              <div className="grid gap-2"></div>
              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting || isRedirecting ? (
                  <Spinner size="small" className="text-background" />
                ) : (
                  "Sign in"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
