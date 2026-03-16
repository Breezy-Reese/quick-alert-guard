import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { logger } from '../utils/logger';
import { TripScore } from '../models/TripScore.model';
import { Trip } from '../models/Trip.model';
import { Vehicle } from '../models/Vehicle.model';
import { User } from '../models/User.model';
import { Incident } from '../models/Incident.model';

/* ============================================================
   HELPER
============================================================ */
const getDriverId = (req: AuthRequest) => req.user?._id;

const unauthorized = (res: Response) =>
  res.status(401).json({ success: false, error: 'Unauthorized' });

/* ============================================================
   STATS   GET /api/driver/stats
============================================================ */
export const getDriverStats = async (req: AuthRequest, res: Response) => {
  try {
    const id = getDriverId(req);
    if (!id) return unauthorized(res);

    const [totalTrips, totalIncidents, activeTrip, avgScoreResult, recentTrips, recentIncidents] =
      await Promise.all([
        TripScore.countDocuments({ driverId: id }),
        Incident.countDocuments({ driverId: id }),
        TripScore.findOne({ driverId: id, endTime: { $exists: false } }).sort({ createdAt: -1 }).lean(),
        TripScore.aggregate([
          { $match: { driverId: id } },
          { $group: { _id: null, average: { $avg: '$score' } } },
        ]),
        TripScore.find({ driverId: id }).sort({ createdAt: -1 }).limit(5).lean(),
        Incident.find({ driverId: id }).sort({ createdAt: -1 }).limit(5).lean(),
      ]);

    const activityFromTrips = recentTrips.map((t: any) => ({
      id: t._id.toString(),
      type: 'trip',
      description: `Trip completed — ${t.distance ? `${(t.distance / 1000).toFixed(1)} km` : 'distance unknown'}`,
      timestamp: new Date(t.createdAt).toLocaleString(),
    }));

    const activityFromIncidents = recentIncidents.map((i: any) => ({
      id: i._id.toString(),
      type: 'incident',
      description: `${i.type.charAt(0).toUpperCase() + i.type.slice(1)} incident — ${i.severity} severity`,
      timestamp: new Date(i.createdAt).toLocaleString(),
    }));

    const recentActivity = [...activityFromTrips, ...activityFromIncidents]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);

    return res.json({
      success: true,
      data: {
        totalTrips,
        totalIncidents,
        activeTrip: activeTrip ? { id: activeTrip._id.toString() } : null,
        safetyScore: avgScoreResult[0] ? Math.round(avgScoreResult[0].average) : null,
        recentActivity,
      },
    });
  } catch (error: any) {
    logger.error('Get driver stats error:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to get driver stats' });
  }
};

/* ============================================================
   TRIPS   GET /api/driver/trips
============================================================ */
export const getTrips = async (req: AuthRequest, res: Response) => {
  try {
    const id = getDriverId(req);
    if (!id) return unauthorized(res);

    const { page = 1, limit = 20, status } = req.query;
    const pageNum  = Number(page);
    const limitNum = Number(limit);

    const filter: any = { driverId: id };
    if (status) filter.status = status;

    const [trips, total] = await Promise.all([
      Trip.find(filter).sort({ createdAt: -1 }).skip((pageNum - 1) * limitNum).limit(limitNum).lean(),
      Trip.countDocuments(filter),
    ]);

    return res.json({
      success: true,
      data: trips,
      pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
    });
  } catch (error: any) {
    logger.error('Get trips error:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to get trips' });
  }
};

/* ============================================================
   ACTIVE TRIP   GET /api/driver/trips/active
============================================================ */
export const getActiveTrip = async (req: AuthRequest, res: Response) => {
  try {
    const id = getDriverId(req);
    if (!id) return unauthorized(res);

    const trip = await Trip.findOne({ driverId: id, status: 'active' }).sort({ createdAt: -1 }).lean();
    return res.json({ success: true, data: trip ?? null });
  } catch (error: any) {
    logger.error('Get active trip error:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to get active trip' });
  }
};

/* ============================================================
   START TRIP   POST /api/driver/trips/start
============================================================ */
export const startTrip = async (req: AuthRequest, res: Response) => {
  try {
    const id = getDriverId(req);
    if (!id) return unauthorized(res);

    const existing = await Trip.findOne({ driverId: id, status: 'active' });
    if (existing) {
      return res.status(400).json({ success: false, error: 'You already have an active trip' });
    }

    const trip = await Trip.create({
      driverId: id,
      status: 'active',
      startTime: new Date(),
      startLocation: req.body.startLocation,
    });

    return res.status(201).json({ success: true, data: trip });
  } catch (error: any) {
    logger.error('Start trip error:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to start trip' });
  }
};

/* ============================================================
   END TRIP   PUT /api/driver/trips/:id/end
============================================================ */
export const endTrip = async (req: AuthRequest, res: Response) => {
  try {
    const id = getDriverId(req);
    if (!id) return unauthorized(res);

    const trip = await Trip.findOne({ _id: req.params.id, driverId: id, status: 'active' });
    if (!trip) return res.status(404).json({ success: false, error: 'Active trip not found' });

    const { endLocation, distance, safetyScore } = req.body;
    trip.status      = 'completed';
    trip.endTime     = new Date();
    trip.endLocation = endLocation;
    trip.distance    = distance;
    trip.duration    = Math.floor((trip.endTime.getTime() - trip.startTime.getTime()) / 1000);
    trip.safetyScore = safetyScore;

    await trip.save();
    return res.json({ success: true, data: trip });
  } catch (error: any) {
    logger.error('End trip error:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to end trip' });
  }
};

/* ============================================================
   GET CONTACTS   GET /api/driver/contacts
============================================================ */
export const getContacts = async (req: AuthRequest, res: Response) => {
  try {
    const id = getDriverId(req);
    if (!id) return unauthorized(res);

    const user = await User.findById(id).select('emergencyContacts');
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });

    return res.json({ success: true, data: user.emergencyContacts ?? [] });
  } catch (error: any) {
    logger.error('Get contacts error:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to get contacts' });
  }
};

/* ============================================================
   ADD CONTACT   POST /api/driver/contacts
============================================================ */
export const addContact = async (req: AuthRequest, res: Response) => {
  try {
    const id = getDriverId(req);
    if (!id) return unauthorized(res);

    const { name, relationship, phone, email, isPrimary } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });

    if (!user.emergencyContacts) user.emergencyContacts = [];

    if (isPrimary) {
      user.emergencyContacts.forEach((c: any) => (c.isPrimary = false));
    }

    user.emergencyContacts.push({ name, relationship, phone, email, isPrimary: !!isPrimary } as any);
    await user.save();

    return res.status(201).json({ success: true, data: user.emergencyContacts });
  } catch (error: any) {
    logger.error('Add contact error:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to add contact' });
  }
};

/* ============================================================
   DELETE CONTACT   DELETE /api/driver/contacts/:id
============================================================ */
export const deleteContact = async (req: AuthRequest, res: Response) => {
  try {
    const id = getDriverId(req);
    if (!id) return unauthorized(res);

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });

    const contacts = user.emergencyContacts ?? [];
    const before = contacts.length;

    user.emergencyContacts = contacts.filter(
      (c: any) => c._id.toString() !== req.params.id,
    ) as any;

    if ((user.emergencyContacts?.length ?? 0) === before) {
      return res.status(404).json({ success: false, error: 'Contact not found' });
    }

    await user.save();
    return res.json({ success: true, data: user.emergencyContacts });
  } catch (error: any) {
    logger.error('Delete contact error:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to delete contact' });
  }
};

/* ============================================================
   GET VEHICLE   GET /api/driver/vehicle
============================================================ */
export const getVehicle = async (req: AuthRequest, res: Response) => {
  try {
    const id = getDriverId(req);
    if (!id) return unauthorized(res);

    const vehicle = await Vehicle.findOne({ driverId: id, isActive: true }).lean();
    return res.json({ success: true, data: vehicle ?? null });
  } catch (error: any) {
    logger.error('Get vehicle error:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to get vehicle' });
  }
};

/* ============================================================
   SAVE VEHICLE   POST /api/driver/vehicle
============================================================ */
export const saveVehicle = async (req: AuthRequest, res: Response) => {
  try {
    const id = getDriverId(req);
    if (!id) return unauthorized(res);

    const { plateNumber, make, vehicleModel, year, color, type, insuranceExpiry } = req.body;

    const vehicle = await Vehicle.findOneAndUpdate(
      { driverId: id, isActive: true },
      { plateNumber, make, vehicleModel, year, color, type, insuranceExpiry, driverId: id },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
    );

    return res.json({ success: true, data: vehicle });
  } catch (error: any) {
    logger.error('Save vehicle error:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to save vehicle' });
  }
};

/* ============================================================
   TRIP SCORES — used by user.routes.ts
============================================================ */
export const submitTripScore = async (req: AuthRequest, res: Response) => {
  try {
    const id = getDriverId(req);
    if (!id) return unauthorized(res);

    const { tripId, score, grade, distance, duration, startTime, endTime, events } = req.body;

    const tripScore = await TripScore.create({
      driverId: id,
      tripId,
      score,
      grade,
      distance,
      duration,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      events: (events ?? []).map((e: any) => ({ ...e, timestamp: new Date(e.timestamp) })),
    });

    return res.status(201).json({ success: true, data: tripScore });
  } catch (error: any) {
    logger.error('Submit trip score error:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to submit trip score' });
  }
};

export const getTripScores = async (req: AuthRequest, res: Response) => {
  try {
    const id = getDriverId(req);
    if (!id) return unauthorized(res);

    const { page = 1, limit = 20 } = req.query;
    const pageNum  = Number(page);
    const limitNum = Number(limit);

    const [trips, total] = await Promise.all([
      TripScore.find({ driverId: id }).sort({ createdAt: -1 }).skip((pageNum - 1) * limitNum).limit(limitNum),
      TripScore.countDocuments({ driverId: id }),
    ]);

    return res.json({
      success: true,
      data: trips,
      pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
    });
  } catch (error: any) {
    logger.error('Get trip scores error:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to get trip scores' });
  }
};

export const getAverageTripScore = async (req: AuthRequest, res: Response) => {
  try {
    const id = getDriverId(req);
    if (!id) return unauthorized(res);

    const result = await TripScore.aggregate([
      { $match: { driverId: id } },
      { $group: { _id: null, average: { $avg: '$score' }, total: { $sum: 1 } } },
    ]);

    return res.json({
      success: true,
      data: { average: result[0] ? Math.round(result[0].average) : null, total: result[0]?.total ?? 0 },
    });
  } catch (error: any) {
    logger.error('Get average trip score error:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to get average score' });
  }
};

export const getPreferences = async (req: AuthRequest, res: Response) => {
  try {
    const id = getDriverId(req);
    if (!id) return unauthorized(res);

    const user = await User.findById(id).select('preferences');
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });

    return res.json({ success: true, data: (user as any).preferences ?? {} });
  } catch (error: any) {
    logger.error('Get preferences error:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to get preferences' });
  }
};

export const savePreferences = async (req: AuthRequest, res: Response) => {
  try {
    const id = getDriverId(req);
    if (!id) return unauthorized(res);

    const user = await User.findByIdAndUpdate(
      id,
      { $set: { preferences: req.body } },
      { new: true, runValidators: true },
    ).select('preferences');

    if (!user) return res.status(404).json({ success: false, error: 'User not found' });

    return res.json({ success: true, message: 'Preferences saved', data: (user as any).preferences });
  } catch (error: any) {
    logger.error('Save preferences error:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to save preferences' });
  }
};