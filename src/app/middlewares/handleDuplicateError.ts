// import { TErrorSources, TGenericErrorResponse } from '../interface/error';

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// const handleDuplicateError = (err: any): TGenericErrorResponse => {
//   // Extract value within double quotes using regex
//   const match = err.message.match(/"([^"]*)"/);

//   // The extracted value will be in the first capturing group
//   const extractedMessage = match && match[1];

//   const errorSources: TErrorSources = [
//     {
//       path: '',
//       message: `${extractedMessage} is already exists`,
//     },
//   ];

//   const statusCode = 400;

//   return {
//     statusCode,
//     message: 'Duplicate key value',
//     errorSources,
//   };
// };

// export default handleDuplicateError;

import { TGenericErrorResponse } from '../interface/error';

// eslint-disable-next-line @typescript-eslint/no-explicit-any, no-unused-vars
const handleDuplicateError = (err: any): TGenericErrorResponse => {
  const statusCode = 400;

  return {
    statusCode,
    message: 'Duplicate key value',
    errorMessage: err.message,
  };
};

export default handleDuplicateError;
