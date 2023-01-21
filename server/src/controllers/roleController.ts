import { Request, Response, NextFunction } from 'express';
import Role from '../models/Role';
import {createCustomError} from '../errors/customError';
import {promisifiedVerify, signToken} from '../utils/authUtil';
import CatchAsync from '../middlewares/CatchAsync';


interface RoleInterface{
    roleName: string,
}

export const createRole = CatchAsync(async(req:Request, res:Response, next: NextFunction)=>{
    const{roleName}:RoleInterface = req.body;

    const newRole = await Role.create({
        roleName: roleName,
        // createdBy: (req as any).user?._id,
        createdBy: '63cb5c3cfa001ccb514d010b',
        createdOn: Date.now(),
        // lastModifiedBy: (req as any).user._id,
        lastModifiedBy: '63cb5c3cfa001ccb514d010b',
        lastModifiedOn: Date.now(),
    });

    res.status(201).json({status: 'Success', message: 'Role created', data: newRole});
});