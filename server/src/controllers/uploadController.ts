import express, {Request, Response, NextFunction} from 'express';
import { createCustomError } from '../errors/customError';
import CatchAsync from '../middlewares/CatchAsync';
import aws from "aws-sdk";
import {detectText} from '../services/googleOcr';
import path from 'path';
import {ocrProccesing} from "../utils/ocrProcessing";
import { convertPdfToImageBuffer,imageBufferToPdfBuffer, convertMultiPdfToImageBuffer,convertPdfMultiToImageBuffer, deskewImage} from '../utils/imageUtil';
import {saveOcrData} from "../controllers/ocrDataController"
import fs from 'fs';
import { uploadToGCS } from '../services/googleStorage';
import PDF from 'pdf-parse';


// CatchAsync
const s3 = new aws.S3();

export const getUploads = (async(req:Request, res:Response, next:NextFunction) => {
  const file = req.file;
  // console.log("file in upload", file, (req as any).user)
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
//  s3.upload(params, (error: any, data: any) => {
//     if (error) {
//       return res.status(502).send({ error });
//     }
//     dataFromS3 = data;
//     // console.log("data", dataFromS3)
//     res.send({  dataFromS3 });
//   });
  let fileType;
  let buffer;
  if(file.mimetype == 'application/pdf' ){
    fileType = 'pdf/tiff';
    console.log('pdf');

    const pdf = await PDF(file.buffer);
    const numPages = pdf.numpages;
  
    if(numPages > 1){
      buffer = await convertMultiPdfToImageBuffer(file.buffer);
    } else{
      buffer = await convertPdfToImageBuffer(file.buffer);
    }
    // url = await uploadToGCS(file.buffer)
    
    console.log(buffer);
  }else{
    fileType = 'image/png';
    buffer = file.buffer;
  }
  // console.log('buffer is', buffer);

  let result = await detectText(buffer, fileType);
  let ocrData = await ocrProccesing(result);
  // // fs.writeFileSync('./data.json', JSON.stringify(result, null, 2) , 'utf-8');
  // console.log("this is ocr data", ocrData, (dataFromS3 as any).Location, result);
  await saveOcrData(ocrData, (req as any).user, (dataFromS3 as any).Location)
  // return ocrData;
});



export const uploadTest = async(req: Request, res: Response, next: NextFunction) => {
  let result = await detectText(`/Users/anshumansharma/projects/work/jeevan-khata-admi/server/src/utils/outputs/combined.png`, 'image/png');
  let ocrData = await ocrProccesing(result);
}
export const deskewTest = async(req: Request, res: Response, next: NextFunction) => {
 deskewImage('/Users/anshumansharma/projects/work/jeevan-khata-admi/server/uploads/WhatsApp Image 2023-02-05 at 18.05.14.jpeg', '/Users/anshumansharma/projects/work/jeevan-khata-admi/server/uploads/deskew.jpeg').then(
  ()=>console.log('successfully deskewd')
 ).catch((err)=> console.log(err));
}

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