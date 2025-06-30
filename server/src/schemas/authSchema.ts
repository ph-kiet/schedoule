import { z } from "zod";

export const signUpSchema = z
  .object({
    firstname: z.string().min(1, {
      message: "First name is required",
    }),
    lastname: z.string().min(1, {
      message: "Last name is required",
    }),
    email: z.string().email(),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters",
    }),
    confirmPassword: z.string().min(1, {
      message: "Confirm password is required",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: "Emai is required",
    })
    .email(),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters",
  }),
});

export const employeeSignInSchema = z.object({
  businessCode: z
    .string()
    .regex(new RegExp("^[0-9]+$"), {
      message: "Invalid business code",
    })
    .min(1, {
      message: "Bussiness code is required",
    }),
  employeeId: z
    .string()
    .regex(new RegExp("^[0-9]+$"), {
      message: "Invalid employee ID",
    })
    .min(1, {
      message: "Employee ID is required",
    }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters",
  }),
});

export const qrSignInSchema = z.object({
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
