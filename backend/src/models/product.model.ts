import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    stock: number;
    merchant: mongoose.Types.ObjectId;
    category: string;
    images?: string[];
    tags: string[];
    sizes: string[];
    colors: string[];
    gender: string;
    material: string;
    brand: string;
    viewCount: number;
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
        tags: [{ type: String, required: true }],
        sizes: [{ type: String, required: true }],
        colors: [{ type: String, required: true }],
        gender: { type: String, required: true, enum: ['male', 'female', 'unisex'] },
        material: { type: String, required: true },
        brand: { type: String, required: true },
        viewCount: { type: Number, default: 0 },
    }, { timestamps: true });
export default mongoose.model<IProduct>(
    'Product',
    ProductSchema
);

