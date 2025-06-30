import { Request, Response } from "express";
import { timesheetSchema } from "../schemas/attendanceSchema";
import Business from "../models/businessModel";
import Attendance from "../models/attendanceModel";
import Roster from "../models/rosterModel";
import { endOfDay, format, startOfDay } from "date-fns";
import { IAttendance, IEmployee, IRoster } from "../types/interfaces";

interface TimesheetEntry {
  date: string;
  fullName?: string;
  checkInDate?: Date;
  checkOutDate?: Date;
  totalHours?: number;
  rosterStart?: Date;
  rosterEnd?: Date;
}

// Get all timesheet by date range and role
export const getTimesheetForEmployee = async (req: Request, res: Response) => {
  const userId = req.userId;
  const { success, data } = timesheetSchema.safeParse(req.query);
  if (!success) {
    res.status(400).json({
      error: {
        type: "system",
        message: "Unable to perform your request! Please try again.",
      },
    });
    return;
  }

  try {
    const attendanceRecords = await Attendance.find({
      employee: userId,
      checkInDate: {
        $gte: startOfDay(data.startDate),
        $lte: data.endDate ? endOfDay(data.endDate) : endOfDay(data.startDate),
      },
    }).select("checkInDate checkOutDate totalHours");

    const rosterRecords = await Roster.find({
      employee: userId,
      startDate: {
        $gte: startOfDay(data.startDate),
        $lte: data.endDate ? endOfDay(data.endDate) : endOfDay(data.startDate),
      },
    }).select("startDate endDate");

    const timesheetMap = new Map<string, TimesheetEntry>();

    attendanceRecords.forEach((record: IAttendance) => {
      const dateKey = format(record.checkInDate, "yyyy-MM-dd");
      timesheetMap.set(dateKey, {
        date: format(record.checkInDate, "EE dd/MM/yyyy"),
        checkInDate: record.checkInDate,
        checkOutDate: record.checkOutDate,
        totalHours: record.totalHours,
      });
    });

    rosterRecords.forEach((record: IRoster) => {
      const dateKey = format(record.startDate, "yyyy-MM-dd");
      timesheetMap.set(dateKey, {
        date: format(record.startDate, "EE dd/MM/yyyy"),
        rosterStart: record.startDate,
        rosterEnd: record.endDate,
        ...timesheetMap.get(dateKey),
      });
    });

    const timesheets = Array.from(timesheetMap.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    res.status(200).json({
      ok: true,
      timesheets: timesheets,
    });
    return;
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getTimesheetForBusiness = async (req: Request, res: Response) => {
  const userId = req.userId;
  const { success, data } = timesheetSchema.safeParse(req.query);
  if (!success) {
    res.status(400).json({
      error: {
        type: "system",
        message: "Unable to perform your request! Please try again.",
      },
    });
    return;
  }

  try {
    const business = await Business.findOne({
      owner: userId,
    });

    if (!business) {
      res.status(400).json({
        error: {
          type: "setup",
          message: "Business set up required!",
        },
      });
      return;
    }

    const attendanceRecords = await Attendance.find({
      business: business._id,
      checkInDate: {
        $gte: startOfDay(data.startDate),
        $lte: data.endDate ? endOfDay(data.endDate) : endOfDay(data.startDate),
      },
    })
      .select("checkInDate checkOutDate totalHours")
      .populate("employee", "fullName employeeId");

    const rosterRecords = await Roster.find({
      business: business._id,
      startDate: {
        $gte: startOfDay(data.startDate),
        $lte: data.endDate ? endOfDay(data.endDate) : endOfDay(data.startDate),
      },
    })
      .select("startDate endDate")
      .populate("employee");

    const timesheetMap = new Map<string, TimesheetEntry>();

    attendanceRecords.forEach((record: IAttendance) => {
      const dateKey = `${format(record.checkInDate, "dd/MM/yyyy")}-${(record.employee as IEmployee).employeeId.toString()}`;
      timesheetMap.set(dateKey, {
        date: format(record.checkInDate, "EE dd/MM/yyyy"),
        fullName: (record.employee as IEmployee).fullName,
        checkInDate: record.checkInDate,
        checkOutDate: record.checkOutDate,
        totalHours: record.totalHours,
      });
    });

    rosterRecords.forEach((record: IRoster) => {
      const dateKey = `${format(record.startDate, "dd/MM/yyyy")}-${(record.employee as IEmployee).employeeId.toString()}`;
      timesheetMap.set(dateKey, {
        date: format(record.startDate, "EE dd/MM/yyyy"),
        fullName: (record.employee as IEmployee).fullName,
        rosterStart: record.startDate,
        rosterEnd: record.endDate,
        ...timesheetMap.get(dateKey),
      });
    });

    const timesheets = Array.from(timesheetMap.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    res.status(200).json({
      ok: true,
      timesheets: timesheets,
    });
    return;
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
