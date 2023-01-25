import express, {Router} from 'express';
import {login, signup, protect, logout, getUserDetailAfterRefresh} from '../controllers/authController';
import {createUser, getUsers, editUser, deleteUser} from '../controllers/userController';

const router:Router = express.Router();


router.route('/').post(protect, createUser).get( getUsers);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/signup').post(signup);
router.route('/update/:id').put(editUser);
router.route('/delete/:id').patch(deleteUser);


router.route('/logindetail').get(protect, getUserDetailAfterRefresh);


export default router;

