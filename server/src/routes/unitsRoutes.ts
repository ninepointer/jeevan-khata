import express, {Router} from 'express';
import { protect } from '../controllers/authController';
import { createUnit, getUnits } from '../controllers/unitController';

const router = express.Router();

router.route('/').get(getUnits).post(protect, createUnit);

export default router;