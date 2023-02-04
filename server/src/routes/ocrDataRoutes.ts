import express, {Router} from 'express';
import { getOCRData} from '../controllers/ocrDataController';


const router = express.Router();


router.route('/').get(getOCRData);



// router.route('/update/:id').put(editLabTest); , uploadInLocal.single('file')
// router.route('/delete/:id').patch(deleteLabTest);


export default router;