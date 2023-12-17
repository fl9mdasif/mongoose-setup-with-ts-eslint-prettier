// import { ZodError, ZodIssue } from 'zod';
// import { TErrorSources, TGenericErrorResponse } from '../interface/error';

// const handleZodError = (err: ZodError): TGenericErrorResponse => {
//   const errorSources: TErrorSources = err.issues.map((issue: ZodIssue) => {
//     return {
//       path: issue?.path[issue.path.length - 1],
//       message: issue.message,
//     };
//   });

//   const statusCode = 400;

//   return {
//     statusCode,
//     message: 'Zod Validation Error',
//     errorSources,
//   };
// };

// export default handleZodError;

import { ZodError } from 'zod';
import { TGenericErrorResponse } from '../interface/error';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleZodError = (err: ZodError<any>): TGenericErrorResponse => {
  const statusCode = 400;

  // get the required path form error response
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const errorMessages = err.issues.map((issue: { path: any[] }) => {
    const pathNames = issue.path.map(String).join(', '); // Join path names with ', '

    return `${pathNames.slice(6)} is required`;
  });

  const formattedError = errorMessages.join('. ');

  return {
    statusCode,
    message: 'Validation Error',
    errorMessage: `${formattedError} `,
  };
};

export default handleZodError;
