import express, {Router} from 'express';
import {login, signup, protect, logout, getUserDetailAfterRefresh, isTokenValid, phoneLogin, 
    forgotPassword, resetPassword, externalLogin, googleLogin} from '../controllers/authController';
import {createUser, getUsers, editUser, deleteUser, getUser, editMe, deleteMe,
     uploadToS3, resizePhoto, uploadMulter, createFamilyMember, getFamilyMember, getFamilyMemberDocuments} from '../controllers/userController';

const router:Router = express.Router();

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);
router.route('/').post(protect, createUser).get( getUsers);
router.route('/me').get(protect, getUser).patch(protect, editMe).delete(protect, deleteMe);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/signup').post(signup);
router.route('/isTokenValid').get(isTokenValid);
router.route('/phoneLogin').post(phoneLogin);
router.route('/loginExternal').post(externalLogin);
router.route('/googleLogin').post(googleLogin);

router.route('/uploadPhoto').patch(protect, uploadMulter, resizePhoto, uploadToS3, editMe);

router.route('/logindetail').get(protect, getUserDetailAfterRefresh);

router.route('/familyMember').get(protect, getFamilyMember);
router.route('/familyMemberDocuments/:id').get(protect, getFamilyMemberDocuments);

router.route('/familyTree').post(protect, createFamilyMember);
router.route('/:id').put(editUser).delete(deleteUser);

export default router;

