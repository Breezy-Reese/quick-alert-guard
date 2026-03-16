import { Router } from 'express';
import { body, param, query } from 'express-validator';
import * as incidentController from '../controllers/incident.controller';
import { authenticate, authorize, requireDriver, requireHospital } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { emergencyLimiter } from '../middleware/rateLimiter.middleware';

const router = Router();

// Validation rules
const createIncidentValidation = [
  body('type')
    .notEmpty().withMessage('Incident type is required')
    .isIn(['collision', 'rollover', 'fire', 'medical', 'other']).withMessage('Invalid incident type'),
  body('severity')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical', 'fatal']).withMessage('Invalid severity level'),
  body('speed')
    .optional()
    .isFloat({ min: 0 }).withMessage('Speed must be a positive number'),
  body('impactForce')
    .optional()
    .isFloat({ min: 0 }).withMessage('Impact force must be a positive number'),
  body('airbagDeployed')
    .optional()
    .isBoolean().withMessage('airbagDeployed must be a boolean'),
  body('occupants')
    .optional()
    .isInt({ min: 1 }).withMessage('Occupants must be at least 1'),
  body('vehicleNumber')
    .optional()
    .isString().withMessage('Vehicle number must be a string'),
  body('location')
    .notEmpty().withMessage('Location is required'),
];

const incidentIdParamValidation = [
  param('incidentId').isMongoId().withMessage('Invalid incident ID format'),
];

const paginationValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
];

// ─── Routes ───────────────────────────────────────────────────────────────────

// GET all incidents (role-filtered)
router.get('/',
  authenticate,
  validate(paginationValidation),
  incidentController.getIncidents
);

// GET active incidents
router.get('/active',
  authenticate,
  authorize('hospital', 'admin'),
  incidentController.getActiveIncidents
);

// GET incident stats
router.get('/stats',
  authenticate,
  authorize('admin', 'hospital'),
  incidentController.getIncidentStats
);

// GET incidents for a specific user
router.get('/user/:userId',
  authenticate,
  validate(paginationValidation),
  incidentController.getUserIncidents
);

// GET single incident
router.get('/:incidentId',
  authenticate,
  validate(incidentIdParamValidation),
  incidentController.getIncident
);

// POST create incident
router.post('/',
  authenticate,
  requireDriver,
  emergencyLimiter,
  validate(createIncidentValidation),
  incidentController.createIncident
);

// PUT update incident status
router.put('/:incidentId',
  authenticate,
  authorize('hospital', 'admin'),
  validate(incidentIdParamValidation),
  incidentController.updateIncidentStatus
);

// POST accept incident
router.post('/:incidentId/accept',
  authenticate,
  requireHospital,
  validate(incidentIdParamValidation),
  incidentController.acceptIncident
);

// POST update responder location
router.post('/:incidentId/responder/:responderId/location',
  authenticate,
  authorize('responder'),
  incidentController.updateResponderLocation
);

// POST mark responder arrived
router.post('/:incidentId/responder/:responderId/arrived',
  authenticate,
  authorize('responder'),
  incidentController.markResponderArrived
);

// POST resolve incident
router.post('/:incidentId/resolve',
  authenticate,
  authorize('responder', 'hospital', 'admin'),
  incidentController.resolveIncident
);

// POST cancel incident
router.post('/:incidentId/cancel',
  authenticate,
  authorize('driver', 'hospital', 'admin'),
  incidentController.cancelIncident
);

// GET incident report
router.get('/:incidentId/report',
  authenticate,
  authorize('hospital', 'admin'),
  validate(incidentIdParamValidation),
  incidentController.generateIncidentReport
);

export default router;