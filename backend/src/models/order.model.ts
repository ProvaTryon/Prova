import mongoose ,{Document , Schema } from "mongoose";

export interface IOrder extends Document {
    user: mongoose.Types.ObjectId;
    products: mongoose.Types.ObjectId[];
    total:number;
    status: string;
    address: string;
    paymentMethod: string;
}
const OrderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{ type: Schema.Types.ObjectId, ref: 'Product', required: true }],
    total: { type: Number, required: true },
    status: { type: String, required: true, default: 'pending' },
    address: { type: String, required: true },
    paymentMethod: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>(   
    'Order', 
    OrderSchema
);