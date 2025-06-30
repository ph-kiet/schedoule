import { Schema, model } from "mongoose";
import { IUser } from "../types/interfaces";

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    avatarUrl: String,
  },
  { timestamps: true }
);

export default model("User", userSchema);
