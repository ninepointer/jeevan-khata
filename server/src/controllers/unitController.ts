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