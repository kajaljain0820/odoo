import express from 'express';
import {
  createTrip,
  getTrips,
  getTripDetails,
  getPublicTripDetails,
  generateShareLink,
  cloneTrip,
  deleteTrip,
  addItinerarySection,
  updateItinerarySection,
  deleteItinerarySection,
  addActivity,
  deleteActivity
} from '../controllers/tripController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Trip management
router.get('/shared/:shareKey', getPublicTripDetails);
router.post('/shared/:shareKey/clone', authenticate, cloneTrip);
router.post('/', authenticate, createTrip);
router.get('/', authenticate, getTrips);
router.get('/:id', authenticate, getTripDetails);
router.delete('/:id', authenticate, deleteTrip);
router.post('/:id/share', authenticate, generateShareLink);

// Itinerary sections management
router.post('/sections', authenticate, addItinerarySection);
router.put('/sections/:id', authenticate, updateItinerarySection);
router.delete('/sections/:id', authenticate, deleteItinerarySection);

// Daily activities management
router.post('/activities', authenticate, addActivity);
router.delete('/activities/:id', authenticate, deleteActivity);

export default router;
