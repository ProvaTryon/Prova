import mongoose, { Document, Schema } from "mongoose";
import { IPerson } from "@/utils/types.util";

export interface IUser extends Document , IPerson {
  // name: string;
  // email: string;
  // password: string;
  // phone?: string;
  // address?: string;
  birth_date?: Date;
  role: "user" | "merchant" | "admin";
  refreshToken?: string;
  isActive: boolean;
  lastLogin?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true , select: false},

    phone: { type: String },

    address: { type: String },

    birth_date: { type: Date },

    role: {
      type: String,
      enum: ["user", "merchant", "admin"],
      default: "user",
      required: true
    },

    refreshToken: { type: String },

    isActive: { type: Boolean, default: true },

    lastLogin: { type: Date }
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
