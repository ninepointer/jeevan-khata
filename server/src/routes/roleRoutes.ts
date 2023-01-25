import express, {Router} from 'express';
import { createRole, getRoles, editRole, deleteRole } from '../controllers/roleController';
import { protect } from '../controllers/authController';

const router = express.Router();

router.route('/').get( getRoles).post(protect, createRole);

router.route('/update/:id').put(editRole);
router.route('/delete/:id').patch(deleteRole);


export default router;