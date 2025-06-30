import { Schema, model } from "mongoose";
import { IAttendance } from "../types/interfaces";

const attendanceSchema = new Schema<IAttendance>(
  {
    employee: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
    business: { type: Schema.Types.ObjectId, ref: "Business", required: true },
    checkInDate: {
      type: Date,
      required: true,
    },
    checkOutDate: {
      type: Date,
      required: false,
    },
    totalHours: {
      type: Number,
      required: false,
    },
  },
  { timestamps: true }
);

export default model("Attendance", attendanceSchema);
