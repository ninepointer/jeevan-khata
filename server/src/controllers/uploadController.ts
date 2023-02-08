import express, {Request, Response, NextFunction} from 'express';
import { createCustomError } from '../errors/customError';
import CatchAsync from '../middlewares/CatchAsync';
import aws from "aws-sdk";
import detectText from '../services/googleOcr';
import path from 'path';
import {ocrProccesing} from "../utils/ocrProcessing";
import {convertPdfToImageBuffer} from '../utils/imageUtil';
import {saveOcrData} from "../controllers/ocrDataController"

// CatchAsync
const s3 = new aws.S3();

export const getUploads = (async(req:Request, res:Response, next:NextFunction) => {
  const file = req.file;
  console.log("file in upload", file, (req as any).user)
  if (!file) {
    return res.status(400).send({ error: 'Please provide a file' });
  }

  // get paricularUser

  // const particularUser = await getUserDetailAfterRefresh(req, res, next);

  // console.log("particularUser", particularUser)


  // configure the parameters for the S3 upload 
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: `users/${(req as any).user.firstName + (req as any).user.lastName + (req as any).user.jeevanKhataId }/reports/${(Date.now()) + file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read',
  };

  // upload the file to S3
  let dataFromS3 = {};
 s3.upload(params, (error: any, data: any) => {
    if (error) {
      return res.status(502).send({ error });
    }
    dataFromS3 = data;
    console.log("data", dataFromS3)
    res.send({  dataFromS3 });
  });
  let fileType;
  let buffer;
  if(file.mimetype == 'application/pdf' ){
    fileType = 'pdf/tiff';
    console.log('pdf');
    buffer = await convertPdfToImageBuffer(file.buffer);
  }else{
    fileType = 'image/jpeg';
    buffer = file.buffer;
  }
  console.log('buffer is', buffer);

  let result = await detectText(buffer, fileType);
  console.log(result);
  let ocrData = await ocrProccesing(result);
  console.log(ocrData, (dataFromS3 as any).Location);
  await saveOcrData(ocrData, (dataFromS3 as any).Location)
  return ocrData;
});



/*
data {
  ETag: '"50144ec9244526f497c161563f449d25"',
  ServerSideEncryption: 'AES256',
  VersionId: 'E9rLKolNOdTcOvp1RZtk0NiyP8a5ftMT',
  Location: 'https://jeevan-khata-test.s3.amazonaws.com/cbc1.jpeg',
  key: 'cbc1.jpeg',
  Key: 'cbc1.jpeg',
  Bucket: 'jeevan-khata-test'
}
*/