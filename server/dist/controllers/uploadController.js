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
const ocrDataController_1 = require("../controllers/ocrDataController");
// CatchAsync
const s3 = new aws_sdk_1.default.S3();
exports.getUploads = ((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    console.log("file in upload", file);
    if (!file) {
        return res.status(400).send({ error: 'Please provide a file' });
    }
    // configure the parameters for the S3 upload
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: file.originalname,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
    };
    // upload the file to S3
    s3.upload(params, (error, data) => {
        if (error) {
            return res.status(502).send({ error });
        }
        console.log("data", data);
        res.send({ data });
    });
    let result = yield (0, googleOcr_1.default)(file.buffer);
    // console.log(result);
    let ocrData = yield (0, ocrProcessing_1.ocrProccesing)(result);
    // console.log(ocrData);
    (0, ocrDataController_1.saveOcrData)(ocrData);
    return ocrData;
}));
