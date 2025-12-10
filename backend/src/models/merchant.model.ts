import mongoose, { Schema, Document } from 'mongoose';
import { IPerson } from '@/utils/types.util';

export interface IMerchant extends Document , IPerson {
  // name: string;
  // email: string;
  // password: string;
  // phone: string;
  // address?: string;
  companyName: string;
  companyId: string;
  nationalId: string;
  products: mongoose.Types.ObjectId[];
}

const MerchantSchema = new Schema<IMerchant>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    address: { type: String },
    companyName: { type: String },
    companyId: { type: String, unique: true },
    nationalId: { type: String, unique: true },
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  },
  { timestamps: true }
);

export default mongoose.model<IMerchant>(
    'Merchant', 
    MerchantSchema
);