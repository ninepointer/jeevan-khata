import express, {Request, Response, NextFunction} from 'express';
import { createCustomError } from '../errors/customError';
import CatchAsync from '../middlewares/CatchAsync';
import Unit from '../models/Unit';


interface MyArray extends Array<Record<string, any>> {}
interface Unit{
    unitFullName: string,
    unitId: string,
    unitConversion:MyArray
}
// unitFullName, unitId,  unitConversionData
export const createUnit = CatchAsync(async(req:Request, res:Response, next:NextFunction) => {
    const {unitFullName, unitId, unitConversion}:Unit = req.body;

    //Check if biomarker name already exists
    if(await Unit.findOne({unitFullName: unitFullName, })) return next(createCustomError('Unit already exists. Edit the existing one.', 403));



    const newUnit = await Unit.create({
        unitFullName, unitId, unitConversion
    });

    res.status(201).json({status: 'Success', message: 'Unit created.', data: newUnit});
});

export const getUnits = CatchAsync(async(req:Request, res:Response, next: NextFunction)=>{
    const units = await Unit.find();

    res.status(200).json({status:'Success', results: units.length, data: units});
});

export const editUser = CatchAsync(async (req:Request, res: Response, next:NextFunction) => {
    // const{firstName, lastName, gender, dateOfBirth, email, password, mobile, city, state }: Unit = req.body;
    const {id} = req.params;
    console.log("User :",(req as any).user)
    const userData = await Unit.findOne({_id: id})
    console.log("user", userData)

    // if(password){
    //     userData!.firstName = firstName
    //     userData!.lastName = lastName,
    //     userData!.gender = gender,
    //     userData!.dateOfBirth = dateOfBirth,
    //     userData!.email = email,
    //     userData!.password = password,
    //     userData!.mobile = mobile,
    //     userData!.city = city,
    //     userData!.state = state

    // } 
    // else {
    //     userData!.firstName = firstName
    //     userData!.lastName = lastName,
    //     userData!.gender = gender,
    //     userData!.dateOfBirth = dateOfBirth,
    //     userData!.email = email,
    //     userData!.mobile = mobile,
    //     userData!.city = city,
    //     userData!.state = state
    // }

    await userData!.save();
    res.status(201).json({status: "Success", data:userData});


    // const user = await User.create({firstName, lastName, gender, dateOfBirth, email, password, mobile, city, state });

    // if(!user) return next(createCustomError('Couldn\'t create user', 400));

    // res.status(201).json({status: "Success", data:user});
    
});

export const deleteUser = CatchAsync(async (req:Request, res: Response, next:NextFunction) => {
    const {id} = req.params;

    try{
        const {id} = req.params
        const unitDetail = await Unit.deleteOne({_id : id})
        console.log("this is unitdetail", unitDetail);
        res.status(201).json({massage : "data delete succesfully"});
    } catch (e){
        res.status(500).json({error:"Failed to delete data"});
    }    
    
});