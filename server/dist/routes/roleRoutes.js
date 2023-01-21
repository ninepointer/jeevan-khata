"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const roleController_1 = require("../controllers/roleController");
const authController_1 = require("../controllers/authController");
const router = express_1.default.Router();
router.route('/').get(authController_1.protect, roleController_1.getRoles).post(authController_1.protect, roleController_1.createRole);
exports.default = router;
