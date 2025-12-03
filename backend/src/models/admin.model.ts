import mongoose, { Document, Schema } from 'mongoose';

export interface IAdmin extends Document {
    name: string;
    email: string;
    password:string;
    phone: string;
    role:string;
}
const AdminSchema = new Schema<IAdmin>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, required: true, default: "admin" },
}, { timestamps: true });
export const Admin = mongoose.model<IAdmin>(
    'Admin', 
    AdminSchema
);