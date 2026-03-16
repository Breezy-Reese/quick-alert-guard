import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ITripDocument extends Document {
  _id: Types.ObjectId;
  driverId: Types.ObjectId;
  status: 'active' | 'completed' | 'cancelled';
  startLocation?: { lat: number; lng: number; address?: string };
  endLocation?: { lat: number; lng: number; address?: string };
  startTime: Date;
  endTime?: Date;
  distance?: number;   // metres
  duration?: number;   // seconds
  safetyScore?: number;
  createdAt: Date;
  updatedAt: Date;
}

const CoordSchema = new Schema(
  {
    lat:     { type: Number, required: true },
    lng:     { type: Number, required: true },
    address: { type: String, trim: true },
  },
  { _id: false },
);

const TripSchema = new Schema<ITripDocument>(
  {
    driverId:      { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status:        { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' },
    startLocation: { type: CoordSchema },
    endLocation:   { type: CoordSchema },
    startTime:     { type: Date, required: true, default: Date.now },
    endTime:       { type: Date },
    distance:      { type: Number, default: 0 },
    duration:      { type: Number, default: 0 },
    safetyScore:   { type: Number, min: 0, max: 100 },
  },
  { timestamps: true },
);

TripSchema.index({ driverId: 1, createdAt: -1 });
TripSchema.index({ driverId: 1, status: 1 });

export const Trip = mongoose.model<ITripDocument>('Trip', TripSchema);