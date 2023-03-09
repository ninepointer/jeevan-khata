"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
router.post('/forgotPassword', authController_1.forgotPassword);
router.patch('/resetPassword/:token', authController_1.resetPassword);
router.route('/').post(authController_1.protect, userController_1.createUser).get(userController_1.getUsers);
router.route('/me').get(authController_1.protect, userController_1.getUser).patch(authController_1.protect, userController_1.editMe).delete(authController_1.protect, userController_1.deleteMe);
router.route('/login').post(authController_1.login);
router.route('/logout').get(authController_1.logout);
router.route('/signup').post(authController_1.signup);
router.route('/isTokenValid').get(authController_1.isTokenValid);
router.route('/phoneLogin').post(authController_1.phoneLogin);
router.route('/loginExternal').post(authController_1.externalLogin);
router.route('/googleLogin').post(authController_1.googleLogin);
router.route('/uploadPhoto').patch(authController_1.protect, userController_1.uploadMulter, userController_1.resizePhoto, userController_1.uploadToS3, userController_1.editMe);
router.route('/logindetail').get(authController_1.protect, authController_1.getUserDetailAfterRefresh);
router.route('/familyMember/:id').get(authController_1.protect, userController_1.getFamilyMembers);
router.route('/documents/:id').get(authController_1.protect, userController_1.getFamilyMemberDocuments);
router.route('/familyTree').post(authController_1.protect, userController_1.createFamilyMember).get(authController_1.protect, userController_1.getFamilyMembers);
router.route('/:id').put(userController_1.editUser).delete(userController_1.deleteUser);
exports.default = router;
