import express, {Router} from 'express';
import {login, signup, protect} from '../controllers/authController';
import {createUser, getUsers} from '../controllers/userController';

const router:Router = express.Router();


router.route('/').post(createUser).get(protect, getUsers);
router.route('/login').post(login);

router.route('/signup').post(signup);


export default router;

