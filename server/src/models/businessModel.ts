import { Schema, model } from "mongoose";
import { IBusiness } from "../types/interfaces";

const businessSchema = new Schema<IBusiness>(
  {
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    address: { type: String, require: true },
    // location: {
    //   lat: {
    //     type: Number,
    //     required: true,
    //   },
    //   lng: {
    //     type: Number,
    //     required: true,
    //   },
    // },
  },
  { timestamps: true }
);

export default model("Business", businessSchema);
