import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { authServices } from './service.auth';

// import config from '../../config';

const loginUser = catchAsync(async (req, res) => {
  const result = await authServices.loginUser(req.body);

  // const { refreshToken, accessToken, needsPasswordChange } = result;
  //   res.cookie('refreshToken', refreshToken, {
  //     secure: config.NODE_ENV === 'production',
  //     httpOnly: true,
  //   });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is logged in successfully!',
    data: {
      result,
    },
  });
});

// change password
const changePassword = catchAsync(async (req, res) => {
  const { ...passwordData } = req.body;
  // console.log(req.user, req.body);

  const result = await authServices.changePassword(req.user, passwordData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password is updated successfully!',
    data: result,
  });
});

// const refreshToken = catchAsync(async (req, res) => {
//   const { refreshToken } = req.cookies;
//   const result = await AuthServices.refreshToken(refreshToken);

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Access token is retrieved successfully!',
//     data: result,
//   });
// });

export const AuthControllers = {
  loginUser,
  changePassword,
  //   refreshToken,
};
