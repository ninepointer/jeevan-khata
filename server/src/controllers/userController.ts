import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import {createCustomError} from '../errors/customError';
import {signToken} from '../utils/authUtil';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import user from '../models/User';
import CatchAsync from '../middlewares/CatchAsync'

interface User{
    firstName: string,
    lastName: string,
    gender: string,
    email: string,
    password: string,
    passwordConfirm: string,
    mobile: string,
    city: string,
    state:string
}


export const createUser =CatchAsync(async (req:Request, res: Response, next:NextFunction) => {
    const{firstName, lastName, gender, email, password, passwordConfirm, mobile, city, state }: User = req.body;

    //Check for required fields 
    if(!(email ||password || mobile || firstName || lastName || gender))return next(createCustomError('Eneter all mandatory fields.', 401));

    //Check if user exists
    if(await User.find({email})) return next(createCustomError('User with this email already exists. Please login with existing email.', 401));
    const user = await User.create({firstName, lastName, gender, email, password, passwordConfirm, mobile, city, state });

    if(!user) return next(createCustomError('Couldn\'t create user', 400));

    res.status(201).json({status: "Success", data:user});
    
});

export const getUsers = CatchAsync(async (req: Request, res: Response, next: NextFunction)=>{
    const users = await User.find();

    if(!users) return next(createCustomError('No users found.', 404));
    
    res.status(200).json({status:"Success", data: users, results: users.length});

});