import { z } from "zod";

export const attendanceSchema = z.object({
  token: z.string().min(1),
  // checkInDate: z.coerce.date().optional(),
  // checkOutDate: z.coerce.date().optional(),
});

export const timesheetSchema = z.object({
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
});
