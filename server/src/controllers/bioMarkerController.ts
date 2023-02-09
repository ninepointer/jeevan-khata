import express, {Request, Response, NextFunction} from 'express';
import { createCustomError } from '../errors/customError';
import CatchAsync from '../middlewares/CatchAsync';
import BioMarker from '../models/BioMarker';


interface MyArray extends Array<Record<string, any>> {}
interface BioMarker{
    name: string,
    unit: string,
    alias?: [string],
    bioMarkerTypes:MyArray,
    status: string,
    scientificName: string
}

export const createBioMarker = CatchAsync(async(req:Request, res:Response, next:NextFunction) => {
    const {name, unit, alias, bioMarkerTypes, scientificName}:BioMarker = req.body;

    //Check if biomarker name already exists
    if(await BioMarker.findOne({name: name, isDeleted: false})) return next(createCustomError('Bio Marker already exists. Edit the existing one.', 403));

    //Check if any of the aliases exist
    if(alias){
        if(await BioMarker.findOne({alias: {$in: [...alias!, name]}})) return next(createCustomError('Bio Marker already exists. Edit the existing one.', 403));
    }

    const newBioMarker = await BioMarker.create({
        name, unit, alias, bioMarkerTypes, scientificName
    });

    res.status(201).json({status: 'Success', message: 'Biomarker created.', data: newBioMarker});
});

export const getBioMarkers = CatchAsync(async(req:Request, res:Response, next: NextFunction)=>{
    const bioMarkers = await BioMarker.find({isDeleted: false})

    res.status(200).json({status:'Success', results: bioMarkers.length, data: bioMarkers});
});

export const getBioMarkersName = CatchAsync(async(req:Request, res:Response, next: NextFunction)=>{
    const bioMarkers = await BioMarker.aggregate([
        {$match: {isDeleted: false}},
        {
           $project: {
              name: 1,
              _id: 0
           }
        }
     ])
    // const bioMarkers = await BioMarker.find({isDeleted: false});

    res.status(200).json({status:'Success', results: bioMarkers.length, data: bioMarkers});
});

export const editBioMarker = CatchAsync(async (req:Request, res: Response, next:NextFunction) => {
    const{ name, unit, bioMarkerTypes, alias, status, scientificName }:BioMarker = req.body;
    const {id} = req.params;

    const bioMarkerData = await BioMarker.findOne({_id: id})
    console.log("user", bioMarkerData)

    bioMarkerData!.name = name,
    bioMarkerData!.unit = unit,
    (bioMarkerData as any).bioMarkerTypes = bioMarkerTypes,
    (bioMarkerData as any).alias = alias,
    // bioMarkerData!.alias = alias, scientificName
    bioMarkerData!.status = status,
    bioMarkerData!.scientificName = scientificName;

    await bioMarkerData!.save();
    res.status(201).json({status: "Success", data:bioMarkerData});
    
});

export const deleteBioMarker = CatchAsync(async (req:Request, res: Response, next:NextFunction) => {
    const {id} = req.params;

    const filter = { _id: id };
    const update = { $set: { isDeleted: true } };

    try{
        const roleDetail = await BioMarker.updateOne(filter, update);
        res.status(201).json({massage : "Bio Marker delete succesfully"});
    } catch (e){
        res.status(500).json({error:"Failed to delete data"});
    }    
    
});

export const deleteBioMarkerType = CatchAsync(async (req:Request, res: Response, next:NextFunction) => {
    const {id} = req.params;

    // const filter = {bioMarkerTypes._id: type_id } 
    // const update = { $set: { isDeleted: true } };

    // try{
    //     const roleDetail = await BioMarker.updateOne(filter, update);

    //     res.status(201).json({massage : "Bio Marker delete succesfully"});
    // } catch (e){
    //     res.status(500).json({error:"Failed to delete data"});
    // }  
    
    console.log("type_id", id)
    BioMarker.updateOne({ "bioMarkerTypes": { $elemMatch: { _id: id } } },
    { $set: { "bioMarkerTypes.$.is_Deleted": true } }, (err: any, result: any) => {
        if (err) {
            // handle error
        } else {
            res.status(201).json({massage : "Bio Marker delete succesfully"});
            console.log(result);
        }
    });

    // console.log(biomarkertype) const biomarkertype = await 
    
});