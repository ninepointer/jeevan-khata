"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const uploadController_1 = require("../controllers/uploadController");
const multer_1 = __importDefault(require("multer"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const router = express_1.default.Router();
// configure the AWS SDK with your S3 credentials
aws_sdk_1.default.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    // accessKeyId: "AKIASR77BQMICZATCLPV",
    // secretAccessKey: "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",
});
const s3 = new aws_sdk_1.default.S3();
// configure Multer to use S3 as the storage backend
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    fileFilter: function (req, file, cb) {
        console.log("file", file);
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|pdf)$/)) {
            console.log("file not found");
            return;
            // return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    },
});
// const upload = multer({ dest: "uploads/" });
console.log("upload", upload);
router.route('/').post(upload.single('file'), uploadController_1.getUploads);
router.route('/test').get(uploadController_1.textDetection);
// router.route('/update/:id').put(editLabTest);
// router.route('/delete/:id').patch(deleteLabTest);
exports.default = router;
