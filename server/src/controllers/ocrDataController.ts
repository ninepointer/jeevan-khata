import { Request, Response, NextFunction } from 'express';
import UploadedData from '../models/uploadedDataSchema';
import {createCustomError} from '../errors/customError';
import {promisifiedVerify, signToken} from '../utils/authUtil';
import CatchAsync from '../middlewares/CatchAsync';
import {getUploads} from "../controllers/uploadController"
import User from '../models/User';

interface MyArray extends Array<Record<string, any>> {}

interface UploadInterface{
    name: string,
    age: string,
    gender: string,
    testName: string,
    lab: string,
    bioMarker: MyArray

}
export const saveOcrData = async(ocrData: any, userReq: any, link: any)=>{
    console.log("in save data func", ocrData)
    const{name, age, gender, testName, lab, bioMarker } = ocrData;
    console.log("bioMarker", bioMarker);
    //check if role exisits
    // if(await UploadedData.findOne({roleName})) return next(createCustomError('Role already exists. Please edit the existing role.', 401));

    const doc = await UploadedData.create({
        name: name,
        age: age,
        gender: gender,
        testName: testName,
        lab: lab,
        bioMarker: bioMarker,
        link: link
    });

    const user = await User.findById(userReq._id);
    user!.documents = [...user!.documents, doc._id];
    await user!.save({validateBeforeSave: false});
    console.log("this is ocr", doc);
    // res.status(201).json({status: 'Success', message: 'Role created', data: ocr});
};

export const getOCRData = CatchAsync(async(req:Request, res:Response, next: NextFunction)=>{
    const uploadedData = await UploadedData.find({isDeleted: false}).sort({_id: -1});

    if(!uploadedData) return next(createCustomError('Can\'t get roles', 404 ));

    res.status(200).json({status: 'Success', data: uploadedData, results: uploadedData.length });


});



// export const deleteRole = CatchAsync(async (req:Request, res: Response, next:NextFunction) => {
//     const {id} = req.params;

//     const filter = { _id: id };
//     const update = { $set: { isDeleted: true } };

//     try{
//         const roleDetail = await Role.updateOne(filter, update);
//         console.log("this is roledetail", roleDetail);
//         res.status(201).json({massage : "data delete succesfully"});
//     } catch (e){
//         res.status(500).json({error:"Failed to delete data"});
//     }    
    
// });