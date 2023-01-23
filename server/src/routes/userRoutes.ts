import express, {Router} from 'express';
import {login, signup, protect, logout} from '../controllers/authController';
import {createUser, getUsers} from '../controllers/userController';

const router:Router = express.Router();


router.route('/').post(protect, createUser).get(protect, getUsers);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/signup').post(signup);


export default router;

