import express, {Request, Response, NextFunction} from 'express';
import { createCustomError } from '../errors/customError';
import CatchAsync from '../middlewares/CatchAsync';
import aws from "aws-sdk";
import detectText from '../services/googleOcr';
import path from 'path';

const s3 = new aws.S3();

export const getUploads = CatchAsync(async(req:Request, res:Response, next:NextFunction) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send({ error: 'Please provide a file' });
  }

  // configure the parameters for the S3 upload
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: file.originalname,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read',
  };

  // upload the file to S3
  s3.upload(params, (error: any, data: any) => {
    if (error) {
      return res.status(500).send({ error });
    }
    console.log("data", data)
    res.send({ data });
  });
});

// export const fileData = CatchAsync(async(req:Request, res:Response, next:NextFunction) => {
//     const upload = multer({ dest: "uploads/" });

//     console.log("upload", upload)
//     return upload.single('file');
//     next();
// });


export const textDetection = async() =>{
  let result = await detectText(path.resolve(__dirname, '../../uploads/dc3f1b80aecfff20f0c68be78a461119.jpg'));
  console.log(result);


  
} 