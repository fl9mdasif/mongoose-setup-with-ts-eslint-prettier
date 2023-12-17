// import mongoose from 'mongoose';
// import { TErrorSources, TGenericErrorResponse } from '../interface/error';

// const handleCastError = (
//   err: mongoose.Error.CastError,
// ): TGenericErrorResponse => {
//   const errorSources: TErrorSources = [
//     {
//       path: err.path,
//       message: err.message,
//     },
//   ];

//   const statusCode = 400;

//   return {
//     statusCode,
//     message: 'Invalid ID',
//     errorSources,
//   };
// };

// export default handleCastError;

import mongoose from 'mongoose';
import { TGenericErrorResponse } from '../interface/error';

const handleCastError = (
  err: mongoose.Error.CastError,
): TGenericErrorResponse => {
  const statusCode = 400;

  return {
    statusCode,
    message: 'Invalid ID',
    errorMessage: `${err.value} is not a valid ID!`,
    errorDetails: err,
  };
};

export default handleCastError;
