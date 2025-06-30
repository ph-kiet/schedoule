import { Schema, model } from "mongoose";
import { IEmployee } from "../types/interfaces";

const employeeSchema = new Schema<IEmployee>(
  {
    employeeId: { type: String, required: true },
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    fullName: { type: String, required: true },
    avatarUrl: String,
    phoneNumber: { type: String, required: true },
    position: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    business: { type: Schema.Types.ObjectId, ref: "Business" },
  },
  { timestamps: true }
);

export default model("Employee", employeeSchema);
