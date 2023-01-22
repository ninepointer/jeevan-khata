import express, {Request, Response, NextFunction} from 'express';
import { createCustomError } from '../errors/customError';
import CatchAsync from '../middlewares/CatchAsync';
import BioMarker from '../models/BioMarker';


interface MyArray extends Array<Record<string, any>> {}
interface BioMarker{
    name: string,
    unit: string,
    alias?: [string]
    bioMarkerTypes:MyArray
}

export const createBioMarker = CatchAsync(async(req:Request, res:Response, next:NextFunction) => {
    const {name, unit, alias, bioMarkerTypes}:BioMarker = req.body;

    //Check if biomarker name already exists
    if(await BioMarker.find({name: name})) return next(createCustomError('Bio Marker already exists. Edit the existing one.', 403));

    //Check if any of the aliases exist
    if(alias){
        if(await BioMarker.findOne({alias: {$in: [...alias!, name]}})) return next(createCustomError('Bio Marker already exists. Edit the existing one.', 403));
    }

    const newBioMarker = await BioMarker.create({
        name, unit, alias, bioMarkerTypes
    });

    res.status(201).json({status: 'Success', message: 'Biomarker created.', data: newBioMarker});
});

export const getBioMarkers = CatchAsync(async(req:Request, res:Response, next: NextFunction)=>{
    const bioMarkers = await BioMarker.find();

    res.status(200).json({status:'Success', results: bioMarkers.length, data: bioMarkers});
});