import express, {Request, Response, NextFunction} from 'express';
import { createCustomError } from '../errors/customError';
import CatchAsync from '../middlewares/CatchAsync';
import LabTest from '../models/LabTest';


interface MyArray extends Array<Record<string, any>> {}
interface LabTest{
    testName: string,
    testScientificName: string,
    bioMarkers: [string],
    status: string
}

export const createLabTest = CatchAsync(async(req:Request, res:Response, next:NextFunction) => {
    const {testName, testScientificName, bioMarkers}:LabTest = req.body;

    //Check if labtest name already exists
    if(await LabTest.findOne({testName: testName})) return next(createCustomError('Lab Test already exists. Edit the existing one.', 403));


    const newLabTest = await LabTest.create({
        testName, testScientificName, bioMarkers
    });

    res.status(201).json({status: 'Success', message: 'Lab test created.', data: newLabTest});
});

export const getLabTests = CatchAsync(async(req:Request, res:Response, next: NextFunction)=>{
    const labTests = await LabTest.find();

    res.status(200).json({status:'Success', results: labTests.length, data: labTests});
});

export const editLabTest = CatchAsync(async (req:Request, res: Response, next:NextFunction) => {
    const{ testName, testScientificName, bioMarkers, status }:LabTest = req.body;
    const {id} = req.params;

    const labTestData = await LabTest.findOne({_id: id})
    console.log("labtest", labTestData)

    labTestData!.testName = testName,
    labTestData!.testScientificName = testScientificName,
    labTestData!.bioMarkers = bioMarkers,
    labTestData!.status = status

    await labTestData!.save();
    res.status(201).json({status: "Success", data:labTestData});
    
});

export const deleteLabTest = CatchAsync(async (req:Request, res: Response, next:NextFunction) => {
    const {id} = req.params;

    const filter = { _id: id };
    const update = { $set: { isDeleted: true } };

    try{
        const labtestDetail = await LabTest.updateOne(filter, update);
        console.log("this is roledetail", labtestDetail);
        res.status(201).json({massage : "data delete succesfully"});
    } catch (e){
        res.status(500).json({error:"Failed to delete data"});
    }    
    
});