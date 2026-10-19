import express from 'express';
import {
  getVegetables,
  getVegetableById,
  createVegetable,
  updateVegetable,
  deleteVegetable,
  getPriceHistory,
} from '../controllers/vegetableController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/vegetables', getVegetables);
router.get('/vegetables/history', getPriceHistory);
router.get('/vegetables/:id/history', getPriceHistory);
router.get('/vegetables/:id', getVegetableById);
router.post('/vegetables', optionalAuth, createVegetable);
router.put('/vegetables/:id', optionalAuth, updateVegetable);
router.delete('/vegetables/:id', optionalAuth, deleteVegetable);

export default router;
