import mongoose , {Document , Schema } from "mongoose";

export interface IProduct extends Document {
    name : string;
    description : string;
    price : number;
    stock : number;
    merchant : mongoose.Types.ObjectId;
    category : string;
    images? : string[];  
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    merchant: { type: Schema.Types.ObjectId, ref: 'Merchant', required: true },
    category: { type: String, required: true },
    images: [{ type: String }],
    },{ timestamps: true });
export default mongoose.model<IProduct>(   
    'Product', 
    ProductSchema
);

