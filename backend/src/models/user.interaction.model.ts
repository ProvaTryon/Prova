import mongoose, { Document, Schema } from 'mongoose';

export interface IUserInteraction extends Document {
  user: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  interactionType: string;
}

const UserInteractionSchema = new Schema<IUserInteraction>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    interactionType: {
      type: String,
      required: true,
      enum: ['view', 'click', 'search']
    },
  },
  { timestamps: true }
);

// Index for faster queries
UserInteractionSchema.index({ user: 1, product: 1, interactionType: 1 });
UserInteractionSchema.index({ createdAt: -1 });

export default mongoose.model<IUserInteraction>(
  'UserInteraction',
  UserInteractionSchema
);
