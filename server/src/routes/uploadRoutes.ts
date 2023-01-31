import express, {Router} from 'express';
import { getUploads} from '../controllers/uploadController';
import multer from 'multer';
import aws from "aws-sdk";

const router = express.Router();

// configure the AWS SDK with your S3 credentials
aws.config.update({
  accessKeyId: process.env.AWS_S3_ACCESS_ID,
  secretAccessKey: process.env.AWS_S3_ACCESS_KEY,
});



const s3 = new aws.S3();

// configure Multer to use S3 as the storage backend
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: function(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return;
      // return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  },
});

// const upload = multer({ dest: "uploads/" });

console.log("upload", upload)

router.route('/').post(upload.single('file'), getUploads)


// router.route('/update/:id').put(editLabTest);
// router.route('/delete/:id').patch(deleteLabTest);


export default router;