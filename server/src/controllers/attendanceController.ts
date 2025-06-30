import { Request, Response } from "express";
import { attendanceSchema } from "../schemas/attendanceSchema";
import Employee from "../models/employeeModel";
import Attendance from "../models/attendanceModel";
import { redisDelete, redisGet, redisSet } from "../config/redis-client";
import crypto from "crypto";
import { endOfDay, format, startOfDay } from "date-fns";
import Business from "../models/businessModel";
import { IEmployee } from "../types/interfaces";

const ATTENDANCE_EXPIRATION_SECONDS = 60 * 60 * 12; // 12 Hours

export const checkIn = async (req: Request, res: Response) => {
  const { success, data } = attendanceSchema.safeParse(req.body);
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
    const employee = await Employee.findOne(
      { _id: req.userId },
      { password: 0, salt: 0 }
    );

    if (!employee) {
      res.status(400).json({
        error: {
          type: "system",
          message: "Unable to perform your request! Please try again.",
        },
      });
      return;
    }

    const value = await redisGet(`qr-code:${employee.business}`);
    if (!value) {
      res.status(400).json({
        error: {
          type: "system",
          message: "This QR code is expired! Please scan a new QR code.",
        },
      });
      return;
    }

    const { salt } = JSON.parse(value);

    const validToken = crypto
      .createHmac("sha256", salt)
      .update(employee.business.toString())
      .digest("hex")
      .slice(0, 10);

    if (data.token !== validToken) {
      res.status(400).json({
        error: {
          type: "system",
          message: "This QR code is invalid!",
        },
      });
      return;
    }

    // Return true if user already checked in
    const attendanceId = await redisGet(`attendance:${employee._id}`);
    if (attendanceId) {
      res.status(200).json({
        ok: true,
        checkedIn: true,
      });
      return;
    }

    const checkedInDate = new Date();

    const attendance = new Attendance({
      employee: employee._id,
      business: employee.business,
      checkInDate: roundToQuarterHour(checkedInDate),
    });

    await attendance.save();

    await redisSet(
      `attendance:${employee._id}`,
      attendance._id.toString(),
      ATTENDANCE_EXPIRATION_SECONDS
    );

    res.status(200).json({
      ok: true,
      message: `Checked in successfully at ${format(checkedInDate, "HH:mm")}`,
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const checkOut = async (req: Request, res: Response) => {
  const { success, data } = attendanceSchema.safeParse(req.body);
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
    const employee = await Employee.findOne(
      { _id: req.userId },
      { password: 0, salt: 0 }
    );

    if (!employee) {
      res.status(400).json({
        error: {
          type: "system",
          message: "Unable to perform your request! Please try again.",
        },
      });
      return;
    }

    const value = await redisGet(`qr-code:${employee.business}`);
    if (!value) {
      res.status(400).json({
        error: {
          type: "system",
          message: "This QR code is expired! Please scan a new QR code.",
        },
      });
      return;
    }

    const { salt } = JSON.parse(value);

    const validToken = crypto
      .createHmac("sha256", salt)
      .update(employee.business.toString())
      .digest("hex")
      .slice(0, 10);

    if (data.token !== validToken) {
      res.status(400).json({
        error: {
          type: "system",
          message: "This QR code is invalid!",
        },
      });
      return;
    }

    const attendanceId = await redisGet(`attendance:${employee._id}`);

    const attendance = await Attendance.findById(attendanceId);

    if (!attendance) {
      res.status(400).json({
        error: {
          type: "system",
          message: "Unable to perform your request! Please try again.",
        },
      });
      return;
    }

    const checkedOutDate = new Date();
    attendance.checkOutDate = roundToQuarterHour(checkedOutDate);

    const totalHours = calculateHoursAndMinutes(
      attendance.checkInDate,
      attendance.checkOutDate
    );
    attendance.totalHours = totalHours;

    await attendance.save();

    await redisDelete(`attendance:${employee._id}`);

    res.status(200).json({
      ok: true,
      message: `Checked out successfully at ${format(checkedOutDate, "HH:mm")}`,
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const getAttendanceLogs = async (req: Request, res: Response) => {
  const userId = req.userId;
  try {
    const business = await Business.findOne({ owner: userId }).select("_id");

    if (!business) {
      res.status(400).json({
        error: {
          type: "system",
          message: "Unable to perform your request! Please try again.",
        },
      });
      return;
    }

    const attendances = await Attendance.find({
      business: business._id,
      checkInDate: {
        $gte: startOfDay(new Date()),
        $lte: endOfDay(new Date()),
      },
    })
      .populate("employee", "fullName")
      .sort({ checkInDate: -1 });

    interface ILog {
      fullName: string;
      event: string;
      time: Date;
    }

    const logs: ILog[] = [];

    attendances.forEach((attendance) => {
      const employeeName = (attendance.employee as IEmployee).fullName;

      // Add check-in event
      if (attendance.checkInDate) {
        logs.push({
          fullName: employeeName,
          event: "Checked In",
          time: attendance.checkInDate,
        });
      }

      // Add check-out event if it exists
      if (attendance.checkOutDate) {
        logs.push({
          fullName: employeeName,
          event: "Checked Out",
          time: attendance.checkOutDate,
        });
      }
    });
    logs.sort((a, b) => b.time.getTime() - a.time.getTime());
    res.status(200).json({ ok: true, logs: logs });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Ground the minutes to the nearest quarter. Ex 8:42 -> 8:45 | 8:37 -> 8:30
const roundToQuarterHour = (date: Date) => {
  const newDate = new Date(date);
  const minutes = newDate.getMinutes();

  // Calculate which quarter hour is closest
  const quarter = Math.round(minutes / 15) * 15;

  // Set the minutes to the nearest quarter
  newDate.setMinutes(quarter);
  newDate.setSeconds(0);
  newDate.setMilliseconds(0);

  return newDate;
};

const calculateHoursAndMinutes = (checkIn: Date, checkOut: Date) => {
  const diffInMs = checkOut.getTime() - checkIn.getTime();
  const totalMinutes = diffInMs / (1000 * 60); // Total minutes
  const hours = Math.floor(totalMinutes / 60); // Whole hours
  const remainingMinutes = Math.round((totalMinutes % 60) / 15) * 15; // Round to nearest 15
  const minutesDecimal = remainingMinutes === 60 ? 0 : remainingMinutes / 100; // Convert to decimal
  return hours + minutesDecimal;
};
