import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import {createCustomError} from '../errors/customError';
import {promisifiedVerify, signToken} from '../utils/authUtil';



interface UserCred{
    email: string,
    password: string,
    passwordConfirm?: string,
    mobile?: string, 
};

export const login = async (req: Request, res:Response, next: NextFunction) =>{
    const {email, password}: UserCred = req.body;
    if (!email)
        return next(createCustomError('Username or email needed', 401));
    if (!password) return next(createCustomError('Password is needed', 401));
  
    const user = await User.findOne({
        email: email
    });

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(
        createCustomError('Incorrect email or username or password', 401)
        );
    }
    const token = signToken(String(user._id));

    res.cookie('jwt', token, {
        expires: new Date(Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRES_IN!)* 24 * 60 * 60 * 1000),
        // secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
    });
    res.status(200).json({
        status: 'success',
        token,
        data: user,
    });
    
}

export const signup = async (req: Request, res:Response, next: NextFunction) =>{

    const {email, password, passwordConfirm, mobile }: UserCred = req.body;

    if (password !== passwordConfirm)
        return next(createCustomError("Passwords don't match", 401));
    const newUser = await User.create({
        email,
        password,
        passwordConfirm,
        mobile,
    });

    const token = signToken(String(newUser._id));
    res.status(200).json({
        status: 'success',
        token,
        data: {
        user: newUser,
        },
    });
        
}

export const protect = async (req: Request, res:Response, next: NextFunction): Promise<void> => {

    let token: string;
//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith('Bearer')
//   ) {
//     token = req.headers.authorization.split(' ')[1];
//   }
//console.log((req ))
  if (req.cookies) {
        token = req.cookies.jwt;
  }
    
  console.log(token!)

  if (!token!) return next(createCustomError('You are not logged in. Please log in to continue.',401));
  
  const decoded = await promisifiedVerify(token, process.env.JWT_SECRET!);

  console.log(decoded);

  const freshUser = await User.findById(decoded._id);

  if(!freshUser){
    return next(createCustomError('User no longer exixts.', 401));
  }

  if(freshUser.changedPasswordAfter(decoded.iat)){
    return next(createCustomError('Password was changed. Log in again.', 401));
  }
  (req as any).user = freshUser;
  next();
}