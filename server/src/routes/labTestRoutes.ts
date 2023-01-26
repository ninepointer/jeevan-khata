import express, {Router} from 'express';
import { protect } from '../controllers/authController';
import { createLabTest, getLabTests, editLabTest, deleteLabTest } from '../controllers/labTest';

const router = express.Router();

router.route('/').get(getLabTests).post(protect, createLabTest);


router.route('/update/:id').put(editLabTest);
router.route('/delete/:id').patch(deleteLabTest);


export default router;