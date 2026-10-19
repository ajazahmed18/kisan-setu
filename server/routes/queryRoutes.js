import express from 'express';
import {
  submitQuery,
  getAllQueries,
  getQueryById,
  updateQueryStatus,
  deleteQuery,
} from '../controllers/queryController.js';
import { protect, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// Public submission endpoints (Public users can submit queries without seeing other users' queries)
router.post('/queries', submitQuery);
router.post('/support/queries', submitQuery);
router.post('/contact', submitQuery);

// Admin-only management endpoints (Secured with token auth and admin role check)
router.get('/queries', protect, authorizeRole('admin'), getAllQueries);
router.get('/queries/:id', protect, authorizeRole('admin'), getQueryById);
router.put('/queries/:id/status', protect, authorizeRole('admin'), updateQueryStatus);
router.patch('/queries/:id/status', protect, authorizeRole('admin'), updateQueryStatus);
router.put('/queries/:id', protect, authorizeRole('admin'), updateQueryStatus);
router.delete('/queries/:id', protect, authorizeRole('admin'), deleteQuery);

export default router;
