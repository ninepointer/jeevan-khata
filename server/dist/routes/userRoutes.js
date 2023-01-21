"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
router.route('/').post(userController_1.createUser).get(authController_1.protect, userController_1.getUsers);
router.route('/login').post(authController_1.login);
router.route('/signup').post(authController_1.signup);
exports.default = router;
