"use strict";
// import mongoose from 'mongoose';
// import { TErrorSources, TGenericErrorResponse } from '../interface/error';
Object.defineProperty(exports, "__esModule", { value: true });
const handleCastError = (err) => {
    const statusCode = 400;
    return {
        statusCode,
        message: 'Invalid ID',
        errorMessage: `${err.value} is not a valid ID!`,
        errorDetails: err,
    };
};
exports.default = handleCastError;
