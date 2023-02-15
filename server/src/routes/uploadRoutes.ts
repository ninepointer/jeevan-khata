import express, {Router} from 'express';
import { getUploads, uploadTest, deskewTest} from '../controllers/uploadController';
import multer from 'multer';
import aws from "aws-sdk";
import {protect} from "../controllers/authController";

const router = express.Router();

// configure the AWS SDK with your S3 credentials
aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
  // accessKeyId: "AKIASR77BQMICZATCLPV",
  // secretAccessKey: "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",

});



const s3 = new aws.S3();

// configure Multer to use S3 as the storage backend
let fileName ;
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: function(req, file, cb) {
    console.log("file", file)
    fileName = file.originalname;
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|pdf)$/)) {
      console.log("file not found")
      return;
      // return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  },
});



const uploadInLocal = multer({ dest: "uploads/" });


console.log("upload", upload, uploadInLocal)

router.route('/').post(upload.single('file'), protect, getUploads);

router.route('/test').get(uploadTest);
router.route('/deskewTest/').get(deskewTest);


// router.route('/update/:id').put(editLabTest); , uploadInLocal.single('file')
// router.route('/delete/:id').patch(deleteLabTest);


export default router;