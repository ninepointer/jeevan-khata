import express, {Router} from 'express';
import { createRole } from '../controllers/roleController';

const router = express.Router();

router.route('/').get().post(createRole);

export default router;