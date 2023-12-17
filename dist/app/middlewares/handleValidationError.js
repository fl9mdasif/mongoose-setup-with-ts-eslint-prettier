"use strict";
// import mongoose from 'mongoose';
// import { TErrorSources, TGenericErrorResponse } from '../interface/error';
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleValidationError = (err) => {
    const statusCode = 400;
    // console.log(err);
    return {
        statusCode,
        message: 'Validation Error',
        // errorMessage: `${err.category.value} is not a valid ID`,
        errorDetails: err,
    };
};
exports.default = handleValidationError;
