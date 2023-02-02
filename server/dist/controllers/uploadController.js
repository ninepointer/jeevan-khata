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
exports.textDetection = exports.getUploads = void 0;
const CatchAsync_1 = __importDefault(require("../middlewares/CatchAsync"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const googleOcr_1 = __importDefault(require("../services/googleOcr"));
const path_1 = __importDefault(require("path"));
const s3 = new aws_sdk_1.default.S3();
exports.getUploads = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
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
            return res.status(500).send({ error });
        }
        console.log("data", data);
        res.send({ data });
    });
}));
// export const fileData = CatchAsync(async(req:Request, res:Response, next:NextFunction) => {
//     const upload = multer({ dest: "uploads/" });
//     console.log("upload", upload)
//     return upload.single('file');
//     next();
// });
const textDetection = () => __awaiter(void 0, void 0, void 0, function* () {
    let result = yield (0, googleOcr_1.default)(path_1.default.resolve(__dirname, '../../uploads/dc3f1b80aecfff20f0c68be78a461119.jpg'));
    console.log(result);
});
exports.textDetection = textDetection;
