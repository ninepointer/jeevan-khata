import { Request, Response, NextFunction } from 'express';
import Role from '../models/Role';
import {createCustomError} from '../errors/customError';
import {promisifiedVerify, signToken} from '../utils/authUtil';
import CatchAsync from '../middlewares/CatchAsync';
import role from '../models/Role';


interface RoleInterface{
    roleName: string,
    reportAccess: boolean,
    attributeAccess: boolean,
    userAccess: boolean,
    analyticsAccess: boolean
}

export const createRole = CatchAsync(async(req:Request, res:Response, next: NextFunction)=>{
    const{roleName, reportAccess, attributeAccess, userAccess, analyticsAccess }:RoleInterface = req.body;
    //check if role exisits
    if(await Role.find({roleName})) return next(createCustomError('Role already exists. Please edit the existing role.', 401));

    const newRole = await Role.create({
        roleName: roleName,
        reportAccess: reportAccess,
        attributesAccess: attributeAccess,
        userAccess: userAccess,
        analyticsAccess: analyticsAccess,
        createdBy: (req as any).user?._id,
        // createdBy: '63cb5c3cfa001ccb514d010b',
        createdOn: Date.now(),
        lastModifiedBy: (req as any).user._id,
        // lastModifiedBy: '63cb5c3cfa001ccb514d010b',
        lastModifiedOn: Date.now(),
    });

    res.status(201).json({status: 'Success', message: 'Role created', data: newRole});
});

export const getRoles = CatchAsync(async(req:Request, res:Response, next: NextFunction)=>{
    const roles = await Role.find();

    if(!roles) return next(createCustomError('Can\'t get roles', 404 ));

    res.status(200).json({status: 'Success', data: roles, results: roles.length });


});