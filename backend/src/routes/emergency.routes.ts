import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { emergencyLimiter } from '../middleware/rateLimiter.middleware';
import {
  triggerEmergency,
  cancelEmergency,
  getAlerts,
  getAlertById,
} from '../controllers/emergency.controller';

const router = Router();

router.use(authenticate);

router.post('/trigger', emergencyLimiter, triggerEmergency);
router.post('/:id/cancel', cancelEmergency);
router.get('/alerts', getAlerts);
router.get('/:id', getAlertById);

export default router;