import express from 'express';
import {
  getTransporters,
  getWarehouses,
  bookTransport,
  getTransportBookings,
  createTransportBooking,
  updateTransportBooking,
} from '../controllers/transportController.js';

const router = express.Router();

router.get('/transporters', getTransporters);
router.get('/warehouses', getWarehouses);
router.post('/transport/book', bookTransport);
router.get('/transport/bookings', getTransportBookings);
router.post('/transport/bookings', createTransportBooking);
router.put('/transport/bookings/:id', updateTransportBooking);

export default router;

