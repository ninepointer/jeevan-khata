"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUploads = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const googleOcr_1 = __importDefault(require("../services/googleOcr"));
const ocrProcessing_1 = require("../utils/ocrProcessing");
const imageUtil_1 = require("../utils/imageUtil");
const ocrDataController_1 = require("../controllers/ocrDataController");
// CatchAsync
const s3 = new aws_sdk_1.default.S3();
exports.getUploads = ((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    console.log("file in upload", file, req.user);
    if (!file) {
        return res.status(400).send({ error: 'Please provide a file' });
    }
    // get paricularUser
    // const particularUser = await getUserDetailAfterRefresh(req, res, next);
    // console.log("particularUser", particularUser)
    // configure the parameters for the S3 upload 
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `users/${req.user.firstName + req.user.lastName + req.user.jeevanKhataId}/reports/${(Date.now()) + file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
    };
    // upload the file to S3
    let dataFromS3 = {};
    s3.upload(params, (error, data) => {
        if (error) {
            return res.status(502).send({ error });
        }
        dataFromS3 = data;
        console.log("data", dataFromS3);
        res.send({ dataFromS3 });
    });
    let fileType;
    let buffer;
    if (file.mimetype == 'application/pdf') {
        fileType = 'pdf/tiff';
        console.log('pdf');
        buffer = yield (0, imageUtil_1.convertPdfToImageBuffer)(file.buffer);
    }
    else {
        fileType = 'image/jpeg';
        buffer = file.buffer;
    }
    console.log('buffer is', buffer);
    let result = yield (0, googleOcr_1.default)(buffer, fileType);
    console.log(result);
    let ocrData = yield (0, ocrProcessing_1.ocrProccesing)(result);
    console.log(ocrData, dataFromS3.Location);
    yield (0, ocrDataController_1.saveOcrData)(ocrData, dataFromS3.Location);
    return ocrData;
}));
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
