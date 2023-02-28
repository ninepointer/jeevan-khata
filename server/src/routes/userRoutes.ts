import express, {Router} from 'express';
import {login, signup, protect, logout, getUserDetailAfterRefresh, isTokenValid, phoneLogin, forgotPassword, resetPassword, externalLogin, googleLogin} from '../controllers/authController';
import {createUser, getUsers, editUser, deleteUser, getUser, editMe, deleteMe, uploadToS3, resizePhoto, uploadMulter} from '../controllers/userController';

const router:Router = express.Router();

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);
router.route('/').post(protect, createUser).get(protect, getUsers);
router.route('/me').get(protect, getUser).patch(protect, editMe).delete(protect, deleteMe);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/signup').post(signup);
router.route('/:id').put(editUser).delete(deleteUser);
router.route('/isTokenValid').get(isTokenValid);
router.route('/phoneLogin').post(phoneLogin);
router.route('/loginExternal').post(externalLogin);
router.route('/googleLogin').post(googleLogin);

router.route('/uploadPhoto').patch(protect, uploadMulter, resizePhoto, uploadToS3, editMe);

router.route('/logindetail').get(protect, getUserDetailAfterRefresh);


export default router;

