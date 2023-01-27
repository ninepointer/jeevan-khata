"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
router.route('/').post(authController_1.protect, userController_1.createUser).get(userController_1.getUsers);
router.route('/login').post(authController_1.login);
router.route('/logout').get(authController_1.logout);
router.route('/signup').post(authController_1.signup);
router.route('/update/:id').put(userController_1.editUser);
router.route('/delete/:id').patch(userController_1.deleteUser);
router.route('/logindetail').get(authController_1.protect, authController_1.getUserDetailAfterRefresh);
exports.default = router;
