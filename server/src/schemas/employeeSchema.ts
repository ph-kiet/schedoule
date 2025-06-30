import { z } from "zod";

export const employeeSchema = z.object({
  //   employeeId: z.string().min(1, {
  //     message: "Employee ID is required",
  //   }),
  firstName: z.string().min(1, {
    message: "First name is required",
  }),
  lastName: z.string().min(1, {
    message: "Last name is required",
  }),
  // fullname: z.string().min(1, {
  //   message: "Fullname is required",
  // }),
  email: z
    .string()
    .min(1, {
      message: "Email is required",
    })
    .email(),
  phoneNumber: z.string().min(1, {
    message: "Phone number is required",
  }),
  //   password: z.string().min(8, {
  //     message: "Password must be at least 8 characters",
  //   }),
  position: z.string().min(1, {
    message: "Position is required",
  }),
});
