import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import {createCustomError} from '../errors/customError';
import {promisifiedVerify, signToken} from '../utils/authUtil';
import CatchAsync from '../middlewares/CatchAsync';
import crypto from 'crypto';



interface UserCred{
    email?: string,
    password?: string,
    passwordConfirm?: string,
    mobile?: string,
    firstName?: string,
    lastName?: string, 
    profilePhoto?: string,
    authId?: string,
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
        createCustomError('Incorrect email or password', 401)
        );
    }
    const token = signToken(String(user._id));

    res.cookie('jwt', token, {
        expires: new Date(Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRES_IN!)* 24 * 60 * 60 * 1000),
        // secure: process.env.NODE_ENV === 'production',
        // httpOnly: true,
    });
    res.status(200).json({
        status: 'success',
        token,
        data: user,
    });
    
}
export const phoneLogin = async (req: Request, res:Response, next: NextFunction) =>{
    const {mobile, authId} = req.body;
    let user;
    if(!mobile){
        return next(createCustomError('Enter a valid phone number', 404));
    }
    user = await User.findOne({mobile});
    if(!user){
        user = await User.create({mobile, authId});
        const token = signToken(String(user._id));

    res.cookie('jwt', token, {
        expires: new Date(Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRES_IN!)* 24 * 60 * 60 * 1000),
        // secure: process.env.NODE_ENV === 'production',
        // httpOnly: true,
    });
    res.status(201).json({
        status: 'success',
        token,
        isNew: true,
        data: user,
    });
    }else{
        const token = signToken(String(user._id));
    
        res.cookie('jwt', token, {
            expires: new Date(Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRES_IN!)* 24 * 60 * 60 * 1000),
            // secure: process.env.NODE_ENV === 'production',
            // httpOnly: true,
        });
        res.status(200).json({
            status: 'success',
            token,
            isNew: false,
            data: user,
        });
    }

}

export const externalLogin = async (req: Request, res:Response, next: NextFunction) =>{
    const {authId} = req.body;
    let user;
    if(!authId){
        return next(createCustomError('Enter a valid phone number', 404));
    }
    user = await User.findOne({authId});
    if(!user){
        user = await User.create({authId});
        const token = signToken(String(user._id));

    res.cookie('jwt', token, {
        expires: new Date(Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRES_IN!)* 24 * 60 * 60 * 1000),
        // secure: process.env.NODE_ENV === 'production',
        // httpOnly: true,
    });
    res.status(201).json({
        status: 'success',
        token,
        isNew: true,
        data: user,
    });
    }else{
        const token = signToken(String(user._id));
    
        res.cookie('jwt', token, {
            expires: new Date(Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRES_IN!)* 24 * 60 * 60 * 1000),
            // secure: process.env.NODE_ENV === 'production',
            // httpOnly: true,
        });
        res.status(200).json({
            status: 'success',
            token,
            isNew: false,
            data: user,
        });
    }

}

export const googleLogin = async (req: Request, res:Response, next: NextFunction) =>{
    const {authId, email, firstName, lastName, profilePhoto} = req.body;
    let user;
    if(!email){
        return next(createCustomError('Email is required', 401));
    }
    user = await User.findOne({email});
    if(!user){
        user = await User.create({authId, email, firstName, lastName, profilePhoto});
        const token = signToken(String(user._id));

    res.cookie('jwt', token, {
        expires: new Date(Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRES_IN!)* 24 * 60 * 60 * 1000),
        // secure: process.env.NODE_ENV === 'production',
        // httpOnly: true,
    });
    res.status(201).json({
        status: 'success',
        token,
        isNew: true,
        data: user,
    });
    }else{
        if(!user.profilePhoto){
            user.profilePhoto = profilePhoto;
        }
        user.authId = authId;

        await user.save({validateBeforeSave: false});

        const token = signToken(String(user._id));
    
        res.cookie('jwt', token, {
            expires: new Date(Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRES_IN!)* 24 * 60 * 60 * 1000),
            // secure: process.env.NODE_ENV === 'production',
            // httpOnly: true,
        });
        res.status(200).json({
            status: 'success',
            token,
            isNew: false,
            data: user,
        });
    }

}

export const signup = async (req: Request, res:Response, next: NextFunction) =>{

    const {email, password, passwordConfirm, mobile, firstName, lastName }: UserCred = req.body;

    const newUser = await User.create({
        email,
        password,
        firstName,
        lastName
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

export const logout = async (req: Request, res:Response, next: NextFunction) =>{

    res.clearCookie("jwt", { path: "/" });
    res
    .status(200)
    .json({ success: true, message: "User logged out successfully" });

        
}


export const protect = async (req: Request, res:Response, next: NextFunction): Promise<void> => {

    let token: string;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }
    // console.log((req ))
    if (req.cookies) {
        if(req.cookies.jwt) token = req.cookies.jwt;
    }

    if (!token!) return next(createCustomError('You are not logged in. Please log in to continue.',401));
    
    const decoded = await promisifiedVerify(token, process.env.JWT_SECRET!);

    // console.log(decoded);

    const freshUser = await User.findById(decoded._id);

    if(!freshUser){
        return next(createCustomError('User no longer exixts.', 401));
    }

    if(freshUser.changedPasswordAfter(decoded.iat)){
        return next(createCustomError('Password was changed. Log in again.', 401));
    }
    (req as any).user = freshUser;
    (req as any).token = token;
    next();
}

export const getUserDetailAfterRefresh = async (req: Request, res:Response, next: NextFunction) => {
    // console.log("req is", req)
    let user = (req as any).user._doc;
    let token = (req as any).token;
    res.status(200).json({
        status: 'success',
        data: {...user, token},
    });
    // res.json(req);
}

export const isTokenValid = async(req: Request, res: Response, next: NextFunction) => {
    try{
        let token: string;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }
    if(!token!)return res.json(false);
    const decoded = await promisifiedVerify(token, process.env.JWT_SECRET!);
    if(!decoded) return res.json(false);

    const freshUser = await User.findById(decoded._id);

    if(!freshUser) return res.json(false);

    res.json(true);

    }catch(e:any){
        return next(e.message);
    }
}

export const forgotPassword  = CatchAsync(async(req: Request, res: Response, next: NextFunction) => {
    // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(createCustomError('There is no user with email address.', 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  try {
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}`;
    // await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      createCustomError('There was an error sending the email. Try again later!',
      500)
    );
  }
});

export const resetPassword  = CatchAsync(async(req: Request, res: Response, next: NextFunction) => {
    // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(createCustomError('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;

  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();


  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT

  const token = signToken(String(user._id));

    res.cookie('jwt', token, {
        expires: new Date(Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRES_IN!)* 24 * 60 * 60 * 1000),
        // secure: process.env.NODE_ENV === 'production',
        // httpOnly: true,
    });
    res.status(200).json({
        status: 'success',
        token,
        data: user,
    });

});

