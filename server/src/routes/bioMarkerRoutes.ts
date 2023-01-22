import express, {Router} from 'express';
import { protect } from '../controllers/authController';
import { createBioMarker, getBioMarkers } from '../controllers/bioMarkerController';

const router = express.Router();

router.route('/').get(getBioMarkers).post(protect, createBioMarker);

export default router;