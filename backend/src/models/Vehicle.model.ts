import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IVehicleDocument extends Document {
  _id: Types.ObjectId;
  driverId: Types.ObjectId;
  plateNumber: string;
  make: string;
  vehicleModel: string;
  year?: number;
  color?: string;
  type?: 'sedan' | 'suv' | 'truck' | 'van' | 'motorcycle' | 'other';
  insuranceExpiry?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const VehicleSchema = new Schema<IVehicleDocument>(
  {
    driverId:      { type: Schema.Types.ObjectId, ref: 'User', required: true },
    plateNumber:   { type: String, required: true, trim: true, uppercase: true },
    make:          { type: String, required: true, trim: true },
    vehicleModel:  { type: String, required: true, trim: true },
    year:          { type: Number },
    color:         { type: String, trim: true },
    type:          { type: String, enum: ['sedan', 'suv', 'truck', 'van', 'motorcycle', 'other'], default: 'sedan' },
    insuranceExpiry: { type: Date },
    isActive:      { type: Boolean, default: true },
  },
  { timestamps: true },
);

VehicleSchema.index({ driverId: 1 });
VehicleSchema.index({ plateNumber: 1 }, { unique: true });

export const Vehicle = mongoose.model<IVehicleDocument>('Vehicle', VehicleSchema);