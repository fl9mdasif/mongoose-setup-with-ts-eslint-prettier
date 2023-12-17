// import mongoose from 'mongoose';
// import { TErrorSources, TGenericErrorResponse } from '../interface/error';

// const handleValidationError = (
//   err: mongoose.Error.ValidationError,
// ): TGenericErrorResponse => {
//   const errorSources: TErrorSources = Object.values(err.errors).map(
//     (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
//       return {
//         path: val?.path,
//         message: val?.message,
//       };
//     },
//   );

//   const statusCode = 400;

//   return {
//     statusCode,
//     message: 'Validation Error',
//     errorSources,
//   };
// };

// export default handleValidationError;
import { TGenericErrorResponse } from '../interface/error';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleValidationError = (err: any): TGenericErrorResponse => {
  const statusCode = 400;
  // console.log(err);
  return {
    statusCode,
    message: 'Validation Error',
    // errorMessage: `${err.category.value} is not a valid ID`,
    errorDetails: err,
  };
};

export default handleValidationError;
