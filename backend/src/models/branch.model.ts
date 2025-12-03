import mongoose, { Document, Schema } from 'mongoose';

export interface IBranch extends Document {
  name: string;
  address: string;
  phone: string;
  manager?: string;
}

const BranchSchema = new Schema<IBranch>
({
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    manager: { type: String },
}, { timestamps: true });
export const Branch = mongoose.model<IBranch>(
    'Branch',
    BranchSchema
);