"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const customError_1 = require("../errors/customError");
const errorHandler = (err, req, res, next) => {
    if (err instanceof customError_1.CustomError) {
        res.status(err.statusCode).json({ status: 'error', error: err.message });
    }
    else {
        res.status(500).json({ status: 'error', error: err.message });
    }
};
exports.default = errorHandler;
