import express, {Router} from 'express';
import { createRole, getRoles } from '../controllers/roleController';
import { protect } from '../controllers/authController';

const router = express.Router();

router.route('/').get( getRoles).post(protect, createRole);

export default router;