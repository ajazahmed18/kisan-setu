import express from 'express';
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  getOffers,
  createOffer,
  updateOffer,
} from '../controllers/orderController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/orders', getAllOrders);
router.get('/orders/:id', getOrderById);
router.post('/orders', optionalAuth, createOrder);
router.put('/orders/:id', updateOrder);

router.get('/offers', getOffers);
router.post('/offers', optionalAuth, createOffer);
router.put('/offers/:id', updateOffer);

export default router;
