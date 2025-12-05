import mongoose, { Document, Schema } from 'mongoose';

export interface IWishlist extends Document {
  user: mongoose.Types.ObjectId;
  products: mongoose.Types.ObjectId[];
}

const WishlistSchema = new Schema<IWishlist>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    products: [{
      type: Schema.Types.ObjectId,
      ref: 'Product'
    }],
  },
  { timestamps: true }
);

// Index for faster user lookups
WishlistSchema.index({ user: 1 });

export default mongoose.model<IWishlist>(
  'Wishlist',
  WishlistSchema
);
