import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { logger } from '../utils/logger';
import { Incident } from '../models/Incident.model';
import { User } from '../models/User.model';
import { notificationService } from '../services/notification.service';
import { v4 as uuidv4 } from 'uuid';

const getDriverId = (req: AuthRequest) => req.user?._id;

const unauthorized = (res: Response) =>
  res.status(401).json({ success: false, error: 'Unauthorized' });

// Convert {lat, lng} to GeoJSON Point
const toGeoJSON = (location: { lat: number; lng: number }) => ({
  type: 'Point' as const,
  coordinates: [location.lng, location.lat] as [number, number],
});

/* ============================================================
   TRIGGER EMERGENCY   POST /api/emergency/trigger
============================================================ */
export const triggerEmergency = async (req: AuthRequest, res: Response) => {
  try {
    const driverId = getDriverId(req);
    if (!driverId) return unauthorized(res);

    const { location } = req.body;

    if (!location) {
      return res.status(400).json({ success: false, error: 'Location is required' });
    }

    const driver = await User.findById(driverId);
    if (!driver) {
      return res.status(404).json({ success: false, error: 'Driver not found' });
    }

    const incident = await Incident.create({
      incidentId: `SOS-${uuidv4().slice(0, 8).toUpperCase()}`,
      driverId,
      driverName: driver.name,
      driverPhone: driver.phone || '',
      type: 'other',         // closest valid enum for SOS
      severity: 'critical',
      status: 'detected',
      location: toGeoJSON(location),
      detectedAt: new Date(),
      emergencyContacts: driver.emergencyContacts || [],
    });

    // Notify emergency contacts if available
    if (driver.emergencyContacts?.length) {
      try {
        await notificationService.notifyEmergencyContacts(
          driver.emergencyContacts,
          (incident as any).toObject()
        );
      } catch (notifyError) {
        logger.warn('Emergency contact notification failed:', notifyError);
      }
    }

    // Emit socket event if io is available
    const io = req.app?.get('io');
    if (io) {
      io.emit('emergency:triggered', {
        incidentId: incident._id.toString(),
        driverId: driverId.toString(),
        location,
        severity: 'critical',
      });
    }

    logger.info(`Emergency triggered by driver ${driverId}: ${incident._id}`);

    return res.status(201).json({
      success: true,
      message: 'Emergency alert sent successfully',
      data: {
        id: incident._id.toString(),
        incidentId: (incident as any).incidentId,
        type: 'sos',
        status: 'detected',
        location,
        driverName: driver.name,
        detectedAt: incident.detectedAt,
      },
    });
  } catch (error: any) {
    logger.error('Trigger emergency error:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to trigger emergency' });
  }
};

/* ============================================================
   CANCEL EMERGENCY   POST /api/emergency/:id/cancel
============================================================ */
export const cancelEmergency = async (req: AuthRequest, res: Response) => {
  try {
    const driverId = getDriverId(req);
    if (!driverId) return unauthorized(res);

    const incident = await Incident.findOne({ _id: req.params.id, driverId });
    if (!incident) {
      return res.status(404).json({ success: false, error: 'Emergency alert not found' });
    }

    if (['resolved', 'cancelled'].includes(incident.status)) {
      return res.status(400).json({ success: false, error: 'Emergency already closed' });
    }

    incident.status = 'cancelled';
    incident.resolvedAt = new Date();
    await incident.save();

    const io = req.app?.get('io');
    if (io) {
      io.emit('emergency:cancelled', { incidentId: incident._id.toString() });
    }

    logger.info(`Emergency ${incident._id} cancelled by driver ${driverId}`);

    return res.json({
      success: true,
      message: 'Emergency alert cancelled',
      data: { id: incident._id.toString(), status: 'cancelled' },
    });
  } catch (error: any) {
    logger.error('Cancel emergency error:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to cancel emergency' });
  }
};

/* ============================================================
   GET ALERTS   GET /api/emergency/alerts
============================================================ */
export const getAlerts = async (req: AuthRequest, res: Response) => {
  try {
    const driverId = getDriverId(req);
    if (!driverId) return unauthorized(res);

    const alerts = await Incident.find({ driverId })
      .sort({ detectedAt: -1 })
      .limit(20)
      .lean();

    return res.json({
      success: true,
      data: alerts.map((a: any) => ({ ...a, id: a._id.toString() })),
    });
  } catch (error: any) {
    logger.error('Get alerts error:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to get alerts' });
  }
};

/* ============================================================
   GET ALERT BY ID   GET /api/emergency/:id
============================================================ */
export const getAlertById = async (req: AuthRequest, res: Response) => {
  try {
    const driverId = getDriverId(req);
    if (!driverId) return unauthorized(res);

    const alert = await Incident.findOne({ _id: req.params.id, driverId }).lean();
    if (!alert) {
      return res.status(404).json({ success: false, error: 'Alert not found' });
    }

    return res.json({
      success: true,
      data: { ...(alert as any), id: (alert as any)._id.toString() },
    });
  } catch (error: any) {
    logger.error('Get alert by id error:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to get alert' });
  }
};