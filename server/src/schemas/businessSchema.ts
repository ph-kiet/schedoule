import { z } from "zod";

export const businessSchema = z.object({
  name: z.string().min(1),
  password: z.string().min(8),
  address: z.string().min(1),
});

export const updateBusinessSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  address: z.string().min(1),
});

export const changeBusinessPasswordSchema = z
  .object({
    currentPassword: z.string().min(8),
    newPassword: z.string().min(8),
    confirmNewPassword: z.string().min(8),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword);
