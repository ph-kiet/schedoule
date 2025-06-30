import { z } from "zod";

export const signInSchema = z.object({
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
  // rememberDetails: z.boolean().default(false).optional(),
});

export type TSignInSchema = z.infer<typeof signInSchema>;
