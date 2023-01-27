import express, {Router} from 'express';
import { protect } from '../controllers/authController';
import { getUploads} from '../controllers/uploadController';
import multer from 'multer';

const router = express.Router();

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'uploads/');
//     },
//     filename: function (req, file, cb) {
//       cb(null, file.originalname);
//     }
//   });
  const upload = multer({ dest: "uploads/" });

  console.log("upload", upload)

router.route('/').post(upload.single('file'), getUploads)


// router.route('/update/:id').put(editLabTest);
// router.route('/delete/:id').patch(deleteLabTest);


export default router;