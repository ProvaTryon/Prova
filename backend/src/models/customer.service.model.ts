import mongoose, { Document, Schema } from 'mongoose';

export interface ICustomerService extends Document {
  name: string;
  email: string;
  phone: string;
  branch?: mongoose.Types.ObjectId;
}

const CustomerServiceSchema = new Schema<ICustomerService>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    branch: { type: Schema.Types.ObjectId, ref: 'Branch' },
  },
  { timestamps: true }
);

export default mongoose.model<ICustomerService>(
  'CustomerService',
  CustomerServiceSchema
);
