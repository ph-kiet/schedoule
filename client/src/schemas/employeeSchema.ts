import { z } from "zod";

export const addEmployeeSchema = z.object({
  firstName: z.string().min(1, {
    message: "First name is required",
  }),
  lastName: z.string().min(1, {
    message: "Last name is required",
  }),
  fullName: z.string().optional(),
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

export type TAddEmployeeSchema = z.infer<typeof addEmployeeSchema>;
