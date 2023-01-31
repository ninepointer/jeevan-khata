import express, {Router} from 'express';
import { getUploads} from '../controllers/uploadController';
import multer from 'multer';
import aws from "aws-sdk";

const router = express.Router();

// configure the AWS SDK with your S3 credentials
aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  // accessKeyId: "AKIASR77BQMICZATCLPV",
  // secretAccessKey: "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",

});



const s3 = new aws.S3();

// configure Multer to use S3 as the storage backend
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: function(req, file, cb) {
    console.log("file", file)
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|pdf)$/)) {
      console.log("file not found")
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