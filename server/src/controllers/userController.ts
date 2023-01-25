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
    dateOfBirth: Date,
    gender: string,
    email: string,
    password: string,
    mobile: string,
    city: string,
    state:string
}

export const createUser =CatchAsync(async (req:Request, res: Response, next:NextFunction) => {
    const{firstName, lastName, gender, dateOfBirth, email, password, mobile, city, state }: User = req.body;
    console.log("User :",(req as any).user)
    //Check for required fields 
    if(!(email ||password || mobile  || firstName || lastName || dateOfBirth || gender))return next(createCustomError('Enter all mandatory fields.', 401));

    //Check if user exists
    if(await User.findOne({email})) return next(createCustomError('User with this email already exists. Please login with existing email.', 401));
    const user = await User.create({firstName, lastName, gender, dateOfBirth, email, password, mobile, city, state });

    if(!user) return next(createCustomError('Couldn\'t create user', 400));

    res.status(201).json({status: "Success", data:user});
    
});

export const getUsers = CatchAsync(async (req: Request, res: Response, next: NextFunction)=>{
    const users = await User.find({isDeleted: false})
    .populate({path : "role", select: "roleName"});

    if(!users) return next(createCustomError('No users found.', 404));
    
    res.status(200).json({status:"Success", data: users, results: users.length});

});


export const editUser = CatchAsync(async (req:Request, res: Response, next:NextFunction) => {
    const{firstName, lastName, gender, dateOfBirth, email, password, mobile, city, state }: User = req.body;
    const {id} = req.params;
    console.log("User :",(req as any).user)
    //Check for required fields 
    // if(!(email ||password || mobile  || firstName || lastName || dateOfBirth || gender))return next(createCustomError('Enter all mandatory fields.', 401));

    //Check if user exists
    const userData = await User.findOne({_id: id})
    console.log("user", userData)

    if(password){
        userData!.firstName = firstName
        userData!.lastName = lastName,
        userData!.gender = gender,
        userData!.dateOfBirth = dateOfBirth,
        userData!.email = email,
        userData!.password = password,
        userData!.mobile = mobile,
        userData!.city = city,
        userData!.state = state

    } 
    else {
        userData!.firstName = firstName
        userData!.lastName = lastName,
        userData!.gender = gender,
        userData!.dateOfBirth = dateOfBirth,
        userData!.email = email,
        userData!.mobile = mobile,
        userData!.city = city,
        userData!.state = state
    }

    await userData!.save();
    res.status(201).json({status: "Success", data:userData});
    
});

export const deleteUser = CatchAsync(async (req:Request, res: Response, next:NextFunction) => {
    const {id} = req.params;

    const filter = { _id: id };
    const update = { $set: { isDeleted: true } };

    try{
        const userDetail = await User.updateOne(filter, update);
        console.log("this is userdetail", userDetail);
        res.status(201).json({massage : "data delete succesfully"});
    } catch (e){
        res.status(500).json({error:"Failed to delete data"});
    }    
    
});