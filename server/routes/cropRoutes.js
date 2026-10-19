import express from 'express';
import {
  getAllLots,
  getLotById,
  createLot,
  updateLot,
  deleteLot,
  checkQualityWithAI,
  getRecommendations,
  getPriceTrends,
} from '../controllers/cropController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/lots', getAllLots);
router.get('/lots/:id', getLotById);
router.post('/lots', optionalAuth, createLot);
router.put('/lots/:id', updateLot);
router.delete('/lots/:id', deleteLot);

router.post('/ai/quality-check', checkQualityWithAI);
router.get('/recommendations', getRecommendations);
router.get('/prices/trends', getPriceTrends);

export default router;
