import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import sharp from 'sharp'; 
import AWS from "aws-sdk";
import User from '../models/User';
import UploadedData from "../models/uploadedDataSchema";
import {createCustomError} from '../errors/customError';
import {signToken} from '../utils/authUtil';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import user from '../models/User';
import CatchAsync from '../middlewares/CatchAsync'
import { Callback } from 'mongoose';
import {getReciprocalRelation} from '../helpers/userHelper';



interface User{
    firstName: string,
    lastName: string,
    dateOfBirth: Date,
    gender: string,
    email: string,
    password: string,
    mobile: string,
    city: string,
    state: string,
    role: string,
    address: string
}

const filterObj = <T extends object>(obj: T, ...allowedFields: (keyof T| string)[]): Partial<T> => {
    const newObj: Partial<T> = {};
    Object.keys(obj).forEach((el) => {
      if (allowedFields.includes(el as keyof T) && 
      (obj[el as keyof T] !== null && 
        obj[el as keyof T] !== undefined && 
        obj[el as keyof T] !== '')) { 
            newObj[el as keyof T] = obj[el as keyof T];}
    });
    return newObj;
  };
  
const storage = multer.memoryStorage();
const fileFilter = (req: Request, file: Express.Multer.File, cb:any) => {
if (file.mimetype.startsWith("image/")) {
    cb(null, true);
} else {
    cb(new Error("Invalid file type"), false);
}
}
const upload = multer({ storage, fileFilter }).single("profilePhoto");
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export const uploadMulter = upload;

export const resizePhoto = (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      // no file uploaded, skip to next middleware
      console.log('no file');
      next();
      return;
    }
    sharp(req.file.buffer).resize({ width: 300, height: 300 }).toBuffer()
    .then((resizedImageBuffer) => {
      req.file!.buffer = resizedImageBuffer;
      next();
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "Error resizing photo" });
    });
}; 

export const uploadToS3 = (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      // no file uploaded, skip to next middleware
      next();
      return;
    }
  
    // create S3 upload parameters
    const key = `users/${(req as any).user.firstName + (req as any).user.lastName + (req as any).user.jeevanKhataId }/photos/profilePhotos/${(Date.now()) + req.file.originalname}`;
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      ACL: 'public-read',
    };
  
    // upload image to S3 bucket
    
    s3.upload((params as any)).promise()
      .then((s3Data) => {
        console.log('file uploaded');
        (req as any).profilePhotoUrl = s3Data.Location;
        next();
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send({ message: "Error uploading photo to S3" });
      });
  };
  
  

export const createUser =CatchAsync(async (req:Request, res: Response, next:NextFunction) => {
    const{firstName, lastName, gender, dateOfBirth, email, password, mobile, city, state, address }: User = req.body;
    console.log("User :",(req as any).user)
    //Check for required fields 
    if(!(email ||password || mobile  || firstName || lastName || dateOfBirth || gender))return next(createCustomError('Enter all mandatory fields.', 401));

    //Check if user exists
    if(await User.findOne({isDeleted: false, email})) return next(createCustomError('User with this email already exists. Please login with existing email.', 401));
    const user = await User.create({firstName, lastName, gender, dateOfBirth, email, password, mobile, city, state, address });

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
    const{firstName, lastName, gender, dateOfBirth, email, password, mobile, city, state, role, address }: User = req.body;
    const {id} = req.params;
    console.log("User :",(req as any).user)

    //Finding user
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
        userData!.state = state,
        userData!.role = role,
        userData!.address = address

    } 
    else {
        userData!.firstName = firstName
        userData!.lastName = lastName,
        userData!.gender = gender,
        userData!.dateOfBirth = dateOfBirth,
        userData!.email = email,
        userData!.mobile = mobile,
        userData!.city = city,
        userData!.state = state,
        userData!.address = address,
        userData!.role = role
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

export const getUser = CatchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = (req as any).user._id;

    const user = await User.findOne({_id: id, isDeleted: false}).select('-__v -password')
    .populate({path : "role", select: "roleName"});

    if(!user) return next(createCustomError('No such user found.', 404));
    
    res.status(200).json({status:"Success", data: user});

});

export const editMe = CatchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = (req as any).user._id;
    const{firstName, lastName, gender, dateOfBirth, email, password, mobile, city, state, address }: User = req.body;
    const user = await User.findOne({_id: id, isDeleted: false}).select('-__v -password -role');

    if(!user) return next(createCustomError('No such user found.', 404));

    const filteredBody = filterObj(req.body, 'firstName', 'lastName', 'email', 'mobile', 'profilePhoto', 'city', 'state', 'dateOfBirth', 'lastModifiedBy', 'address', 'gender');
    
    filteredBody.lastModifiedBy = id;
    if (req.file) filteredBody.profilePhoto = (req as any).profilePhotoUrl;
    if(!user.isOnBoarded)filteredBody.isOnBoarded = true;

    
    const updatedUser = await User.findByIdAndUpdate(id, filteredBody, {
        new: true,
        runValidators: true
      }).select('-__v -password -role');
    res.status(200).json({status: "Success", data:updatedUser});

});

export const deleteMe = CatchAsync(async (req:Request, res: Response, next:NextFunction) => {
    const id = (req as any).user._id;

    const filter = { _id: id };
    const update = { $set: { isDeleted: true } };

    try{
        const userDetail = await User.updateOne(filter, update);
        console.log("this is userdetail", userDetail);
        res.status(201).json({message : "data deleted succesfully"});
    } catch (e){
        res.status(500).json({error:"Failed to delete data"});
    }    
    
});

export const createFamilyMember =CatchAsync(async (req:Request, res: Response, next:NextFunction) => {
    const{mobile, relation, gender, email, firstName, lastName, dateOfBirth, createdBy} = req.body;
    console.log("User :",(req as any).user)
    let loggedInUser = (req as any).user;
    //Check for required fields 
    if(!(mobile))return next(createCustomError('Mobile Number is required.', 401));
    let familyMember ={};
    //Check if user exists
    const existingUser = await User.findOne({isDeleted: false, mobile});
    if(existingUser){
        let existingUserId =existingUser._id; 
        familyMember = {relation, profile: existingUserId};
        let {reciprocalRelation, reciprocalGender} = getReciprocalRelation(relation, loggedInUser?.gender);
        let reciprocalFamilymember = {reciprocalRelation, profile: loggedInUser._id}
        loggedInUser.familyTree = [...loggedInUser.familyTree, familyMember];
        existingUser.familyTree = [...existingUser.familyTree, reciprocalFamilymember];

        await loggedInUser.save({validateBeforeSave:false});
        await existingUser.save({validateBeforeSave:false});
        
        return res.status(200).json({status:'success', message:'Added family Member successfully', data:loggedInUser});
    }
    const newUser = await User.create({mobile, relation, gender, email, firstName, lastName, dateOfBirth});
    if(!newUser) return next(createCustomError('Couldn\'t create user', 400));

    familyMember = {relation, profile: newUser._id};
    let {reciprocalRelation, reciprocalGender} = getReciprocalRelation(relation, loggedInUser?.gender);
    let reciprocalFamilymember = {reciprocalRelation, profile: loggedInUser._id};

    loggedInUser.familyTree = [...loggedInUser.familyTree, familyMember];
    newUser.familyTree = [...newUser.familyTree, reciprocalFamilymember];
    if(!gender) newUser.gender = reciprocalGender;
    if(!createdBy) newUser.createdBy = loggedInUser._id;

    await newUser.save();
    await loggedInUser.save();

    res.status(200).json({status: "success", message: 'Added family Member successfully', data:loggedInUser});
    
});

//Get family members  
export const getFamilyMembers =CatchAsync(async (req:Request, res: Response, next:NextFunction) => {
    let loggedInUser = (req as any).user;
    let familyTree = loggedInUser.familyTree
    console.log("familyTree", familyTree)
    let allFamilyDataArr = [];
    for(let i = 0; i <  familyTree.length; i++){
        let pipeline = [{ $match: { _id: familyTree[i].profile} },

        //{ $project: {_id : 0, firstName: 1, lastName: 1, email: 1, mobile: 1, gender: 1, dateOfBirth: 1} }
        ]

        let familyMemberData = await User.aggregate(pipeline);
        console.log("familyMemberData", familyMemberData)
        allFamilyDataArr.push(familyMemberData);
        // console.log("allFamilyDataArr", allFamilyDataArr)
    }

    res.status(200).json({status: "success", message: 'Getting family Member successfully', data:allFamilyDataArr});
    
});

//Get family member
export const getFamilyMember =CatchAsync(async (req:Request, res: Response, next:NextFunction) => {
    let loggedInUser = (req as any).user;
    const {id} = req.params;
    let familyTree = loggedInUser.familyTree
    // console.log("familyTree", familyTree)
    let allFamilyDataArr = [];
    for(let i = 0; i <  familyTree.length; i++){
        let pipeline = [{ $match: { _id: id} },

        //{ $project: {_id : 0, firstName: 1, lastName: 1, email: 1, mobile: 1, gender: 1, dateOfBirth: 1} }
        ]

        let familyMemberData = await User.aggregate(pipeline);
        // console.log("familyMemberData", familyMemberData)
        allFamilyDataArr.push(familyMemberData);
        // console.log("allFamilyDataArr", allFamilyDataArr)
    }

    res.status(200).json({status: "success", message: 'Getting family Member successfully', data:allFamilyDataArr});
    
});

//Get family member documents

export const getFamilyMemberDocuments =CatchAsync(async (req:Request, res: Response, next:NextFunction) => {
    let {id} = req.params;
    const particulerUser = await User.findOne({isDeleted: false, _id: id});

    let loggedInUser = (req as any).user;
    // console.log("loggedInUser", loggedInUser)
    let allFamilyDataArr = [];
    for(let i = 0; i <  (particulerUser as any).documents.length; i++){
        let pipeline = [{ $match: { _id: (particulerUser as any).documents[i]} }
        ]

        let familyMemberData = await UploadedData.aggregate(pipeline);
        allFamilyDataArr.push(familyMemberData);
    }

    res.status(200).json({status: "success", message: 'Getting family Member Documents successfully', data:allFamilyDataArr});
    
});

//Only allow access to creator and authenticated user id.

//canNotWrite: ['Shanu\'s objectid', 'Vimla\'s objectid']; 

//Patch family members


//Delete family members

//Upload for family

//if family member's object id is not in cannotWrite, allow else error permissions not given.



