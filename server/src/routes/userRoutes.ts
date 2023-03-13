import express, {Router} from 'express';
import {login, signup, protect, logout, getUserDetailAfterRefresh, isTokenValid, phoneLogin, 
    forgotPassword, resetPassword, externalLogin, googleLogin} from '../controllers/authController';
import {createUser, getUsers, editUser, deleteUser, getUser, editMe, deleteMe,
     uploadToS3, resizePhoto, uploadMulter, createFamilyMember, getFamilyMember, getFamilyMembers, getFamilyMemberDocuments,
     getReminders, addReminder
    } from '../controllers/userController';

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

router.route('/familyTree').post(protect, createFamilyMember).get(protect, getFamilyMembers);

router.route('/familyTree/documents/:id').get(protect, getFamilyMemberDocuments);

router.route('/familyTree/:id').get(protect, getFamilyMember);

router.route('/reminders').get(protect, getReminders).post(protect, addReminder);

router.route('/:id').put(editUser).delete(deleteUser);

export default router;
//63cb64119ca217db92a03e01
