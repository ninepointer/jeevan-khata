"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const uploadController_1 = require("../controllers/uploadController");
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'uploads/');
//     },
//     filename: function (req, file, cb) {
//       cb(null, file.originalname);
//     }
//   });
const upload = (0, multer_1.default)({ dest: "uploads/" });
console.log("upload", upload);
router.route('/').post(upload.single('file'), uploadController_1.getUploads);
// router.route('/update/:id').put(editLabTest);
// router.route('/delete/:id').patch(deleteLabTest);
exports.default = router;
