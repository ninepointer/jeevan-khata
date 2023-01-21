import { CustomError, createCustomError } from '../errors/customError';
import { Request, Response, NextFunction } from 'express';

const errorHandler = (err: Error|CustomError , req:Request, res:Response, next:NextFunction) => {
  if (err instanceof CustomError) {
    res.status(err.statusCode).json({ status: 'error', error: err.message });
  } else {
    res.status(500).json({ status: 'error', error: err.message });
  }
};

export default errorHandler;
