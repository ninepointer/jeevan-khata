import express, {Request, Response, NextFunction} from 'express';
import { createCustomError } from '../errors/customError';
import CatchAsync from '../middlewares/CatchAsync';
import Unit from '../models/Unit';


interface MyArray extends Array<Record<string, any>> {}
interface Unit{
    unitFullName: string,
    unitId: string,
    unitConversion:MyArray,
    status: string
}
// unitFullName, unitId,  unitConversionData
export const createUnit = CatchAsync(async(req:Request, res:Response, next:NextFunction) => {
    const {unitFullName, unitId, unitConversion}:Unit = req.body;

    //Check if biomarker name already exists
    if(await Unit.findOne({isDeleted: false, unitFullName: unitFullName })) return next(createCustomError('Unit already exists. Edit the existing one.', 403));



    const newUnit = await Unit.create({
        unitFullName, unitId, unitConversion
    });

    res.status(201).json({status: 'Success', message: 'Unit created.', data: newUnit});
});

export const getUnits = CatchAsync(async(req:Request, res:Response, next: NextFunction)=>{
    const units = await Unit.find({isDeleted: false});

    res.status(200).json({status:'Success', results: units.length, data: units});
});

export const editUnit = CatchAsync(async (req:Request, res: Response, next:NextFunction) => {
    const{ unitFullName, unitId, unitConversion, status }:Unit = req.body;
    const {id} = req.params;

    const unitData = await Unit.findOne({_id: id})
    console.log("user", unitData)

    unitData!.unitFullName = unitFullName,
    unitData!.unitId = unitId,
    (unitData as any).unitConversion = unitConversion,
    unitData!.status = status,

    await unitData!.save();
    res.status(201).json({status: "Success", data:unitData});
    
});

export const deleteUnit = CatchAsync(async (req:Request, res: Response, next:NextFunction) => {
    const {id} = req.params;

    const filter = { _id: id };
    const update = { $set: { isDeleted: true } };

    try{
        const unitDetail = await Unit.updateOne(filter, update);
        res.status(201).json({massage : "Unit delete succesfully"});
    } catch (e){
        res.status(500).json({error:"Failed to delete data"});
    }    
    
});

export const deleteUnitConversionType = CatchAsync(async (req:Request, res: Response, next:NextFunction) => {
    const {id} = req.params;
 
    
    Unit.updateOne({ "unitConversion": { $elemMatch: { _id: id } } },
    { $set: { "unitConversion.$.is_Deleted": true } }, (err: any, result: any) => {
        if (err) {
            // handle error
        } else {
            res.status(201).json({massage : "Unit Conversion delete succesfully"});
            console.log(result);
        }
    });

    // console.log(biomarkertype) const biomarkertype = await 
    
});