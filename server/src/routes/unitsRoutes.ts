import express, {Router} from 'express';
import { protect } from '../controllers/authController';
import { createUnit, getUnits, editUnit, deleteUnit, deleteUnitConversionType } from '../controllers/unitController';

const router = express.Router();

router.route('/').get(getUnits).post(protect, createUnit);

router.route('/update/:id').put(editUnit);
router.route('/delete/:id').patch(deleteUnit);
router.route('/unitConversionDelete/:id').patch(deleteUnitConversionType);


export default router;