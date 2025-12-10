import mongoose , { Document, Schema } from 'mongoose';

export interface IBodyMeasurements extends Document {
   userId: mongoose.Types.ObjectId;
   height: number;
   weight: number;
   shoulder_width?: number;       //Distance between left and right shoulders
   chest_width?: number;          //Width at chest level
   chest_circumference?: number;  //Estimated chest circumference
   waist_width?: number;          //Width at waist level
   waist?: number;                //Estimated waist circumference
   hip_width?: number;            //Distance between left and right hips
   hip_circumference?: number;    //Estimated hip circumference (if side image is given)
}
const BodyMeasurementsSchema = new Schema<IBodyMeasurements>(
    {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    height: { type: Number, required: true },
    weight: { type: Number, required: true },
    shoulder_width: { type: Number },
    chest_width: { type: Number },
    chest_circumference: { type: Number },
    waist_width: { type: Number },
    waist: { type: Number },
    hip_width: { type: Number },
    hip_circumference: { type: Number },
}, { timestamps: true });
export const BodyMeasurements = mongoose.model<IBodyMeasurements>(
    'BodyMeasurements',
    BodyMeasurementsSchema
);