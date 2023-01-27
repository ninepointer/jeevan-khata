import express, {Request, Response, NextFunction} from 'express';
import { createCustomError } from '../errors/customError';
import CatchAsync from '../middlewares/CatchAsync';
// import Upload from '../models/';

// import express from 'express';
import multer from 'multer';

// const app = express();
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   }
// });
// const upload = multer({ storage: storage });

// app.post('/upload', upload.single('file'), (req, res) => {

// });

// // app.listen(3000, () => {
// //   console.log('Server started on port 3000.');
// // });

export const getUploads = CatchAsync(async(req:Request, res:Response, next:NextFunction) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
      }
      res.send('File uploaded successfully.');
});

// export const fileData = CatchAsync(async(req:Request, res:Response, next:NextFunction) => {
//     const upload = multer({ dest: "uploads/" });

//     console.log("upload", upload)
//     return upload.single('file');
//     next();
// });