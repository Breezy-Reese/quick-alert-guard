import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  getDriverStats,
  getTrips,
  getActiveTrip,
  startTrip,
  endTrip,
  getContacts,
  addContact,
  deleteContact,
  getVehicle,
  saveVehicle,
} from '../controllers/driver.controller';

const router = Router();

// All driver routes require authentication
router.use(authenticate);

// Stats
router.get('/stats', getDriverStats);

// Trips — order matters: /active must come before /:id
router.get('/trips', getTrips);
router.get('/trips/active', getActiveTrip);
router.post('/trips/start', startTrip);
router.put('/trips/:id/end', endTrip);

// Emergency contacts
router.get('/contacts', getContacts);
router.post('/contacts', addContact);
router.delete('/contacts/:id', deleteContact);

// Vehicle
router.get('/vehicle', getVehicle);
router.post('/vehicle', saveVehicle);

export default router;