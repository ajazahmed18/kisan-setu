import express from 'express';
import {
  getSellRequests,
  createSellRequest,
  updateSellRequest,
  aggregateRequests,
  getPhysicalCheckups,
  createPhysicalCheckup,
  assignPhysicalCheckup,
  certifyPhysicalCheckup,
  getFpoOfficers,
} from '../controllers/fpoController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Direct sell request routes matching frontend API
router.get('/sell-requests', getSellRequests);
router.post('/sell-requests', optionalAuth, createSellRequest);
router.put('/sell-requests/:id', updateSellRequest);
router.patch('/sell-requests/:id', updateSellRequest);

// FPO prefixed routes
router.get('/fpo/sell-requests', getSellRequests);
router.post('/fpo/sell-requests', optionalAuth, createSellRequest);
router.put('/fpo/sell-requests/:id', updateSellRequest);
router.patch('/fpo/sell-requests/:id', updateSellRequest);
router.post('/fpo/aggregate', aggregateRequests);
router.get('/fpo/officers', getFpoOfficers);

// Physical checkups
router.get('/fpo/physical-checkups', getPhysicalCheckups);
router.post('/fpo/physical-checkups', createPhysicalCheckup);
router.put('/fpo/physical-checkups/:id/assign', assignPhysicalCheckup);
router.put('/fpo/physical-checkups/:id/certify', certifyPhysicalCheckup);

export default router;
