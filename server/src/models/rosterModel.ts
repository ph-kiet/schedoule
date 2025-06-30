import { Schema, model } from "mongoose";
import { IRoster } from "../types/interfaces";

const rosterSchema = new Schema<IRoster>(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
    },
    business: { type: Schema.Types.ObjectId, ref: "Business" },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    breakTime: { type: Number, required: true },
    description: { type: String, required: false },
  },
  { timestamps: true }
);

export default model("Roster", rosterSchema);
