import express, {Router} from 'express';
import { protect } from '../controllers/authController';
import { createBioMarker, getBioMarkers, editBioMarker, deleteBioMarker, deleteBioMarkerType, getBioMarkersName } from '../controllers/bioMarkerController';

const router = express.Router();

router.route('/').get(getBioMarkers).post(protect, createBioMarker);

router.route('/update/:id').put(editBioMarker);
router.route('/delete/:id').patch(deleteBioMarker);
router.route('/bioMarkerTypeDelete/:id').patch(deleteBioMarkerType);
router.route('/bioMarkerName').get(getBioMarkersName);


export default router;