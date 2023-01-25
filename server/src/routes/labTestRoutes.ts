import express, {Router} from 'express';
import { protect } from '../controllers/authController';
import { createLabTest, getLabTests } from '../controllers/labTest';

const router = express.Router();

router.route('/').get(getLabTests).post(protect, createLabTest);

export default router;