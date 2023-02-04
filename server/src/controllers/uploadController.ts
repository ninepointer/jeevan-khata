import express, {Request, Response, NextFunction} from 'express';
import { createCustomError } from '../errors/customError';
import CatchAsync from '../middlewares/CatchAsync';
import aws from "aws-sdk";
import detectText from '../services/googleOcr';
import path from 'path';
import {ocrProccesing} from "../utils/ocrProcessing";
import {saveOcrData} from "../controllers/ocrDataController"
// CatchAsync
const s3 = new aws.S3();

export const getUploads = (async(req:Request, res:Response, next:NextFunction) => {
  const file = req.file;
  console.log("file in upload", file)
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
      return res.status(502).send({ error });
    }
    console.log("data", data)
    res.send({ data });
  });

  let result = await detectText(file.buffer);
  // console.log(result);
  let ocrData = await ocrProccesing(result);
  
  // console.log(ocrData);
  saveOcrData(ocrData)
  return ocrData;
});



