import { Request, Response, NextFunction } from 'express';
import Role from '../models/Role';
import {createCustomError} from '../errors/customError';
import {promisifiedVerify, signToken} from '../utils/authUtil';
import CatchAsync from '../middlewares/CatchAsync';


interface RoleInterface{
    roleName: string,
    reportAccess: boolean,
    attributesAccess: boolean,
    userAccess: boolean,
    analyticsAccess: boolean,
    status: string

}
export const createRole = CatchAsync(async(req:Request, res:Response, next: NextFunction)=>{
    const{roleName, reportAccess, attributesAccess, userAccess, analyticsAccess, status }:RoleInterface = req.body;
    //check if role exisits
    if(await Role.findOne({roleName})) return next(createCustomError('Role already exists. Please edit the existing role.', 401));

    const newRole = await Role.create({
        roleName: roleName,
        reportAccess: reportAccess,
        attributesAccess: attributesAccess,
        userAccess: userAccess,
        analyticsAccess: analyticsAccess,
        createdBy: (req as any).user?._id,
        // createdBy: '63cb5c3cfa001ccb514d010b',
        createdOn: Date.now(),
        lastModifiedBy: (req as any).user._id,
        // lastModifiedBy: '63cb5c3cfa001ccb514d010b',
        lastModifiedOn: Date.now(),
        status: status
    });

    res.status(201).json({status: 'Success', message: 'Role created', data: newRole});
});

export const getRoles = CatchAsync(async(req:Request, res:Response, next: NextFunction)=>{
    const roles = await Role.find({isDeleted: false});

    if(!roles) return next(createCustomError('Can\'t get roles', 404 ));

    res.status(200).json({status: 'Success', data: roles, results: roles.length });


});

export const editRole = CatchAsync(async (req:Request, res: Response, next:NextFunction) => {
    const{roleName, reportAccess, userAccess, attributesAccess, analyticsAccess, status }:RoleInterface = req.body;
    const {id} = req.params;

    const unitData = await Role.findOne({_id: id})
    console.log("user", unitData)

    unitData!.roleName = roleName,
    unitData!.reportAccess = reportAccess,
    unitData!.userAccess = userAccess,
    unitData!.attributesAccess = attributesAccess,
    unitData!.analyticsAccess = analyticsAccess,
    unitData!.status = status

    await unitData!.save();
    res.status(201).json({status: "Success", data:unitData});
    
});

export const deleteRole = CatchAsync(async (req:Request, res: Response, next:NextFunction) => {
    const {id} = req.params;

    const filter = { _id: id };
    const update = { $set: { isDeleted: true } };

    try{
        const roleDetail = await Role.updateOne(filter, update);
        console.log("this is roledetail", roleDetail);
        res.status(201).json({massage : "data delete succesfully"});
    } catch (e){
        res.status(500).json({error:"Failed to delete data"});
    }    
    
});