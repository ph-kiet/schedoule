import { z } from "zod";

export const rosterSchema = z.object({
  employeeId: z.string({
    required_error: "Please select an employee.",
  }),
  startDate: z.date({
    required_error: "Please select start date and time.",
  }),
  endDate: z.date({
    required_error: "Please select end date and time.",
  }),
  breakTime: z.coerce.number({
    message: "Invalid value",
  }),
  description: z.string().optional(),
});

export type TRosterSchema = z.infer<typeof rosterSchema>;
