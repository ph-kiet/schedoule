import { z } from "zod";

export const rosterSchema = z.object({
  employeeId: z.string().min(1).optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  breakTime: z.number().optional(),
  description: z.string().optional(),
});

export const rosterByDateSchema = z.object({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
});
