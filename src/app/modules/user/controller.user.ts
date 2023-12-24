import { RequestHandler } from 'express';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { UserServices } from './service.user';
import AppError from '../../errors/AppErrors';

const createStudent: RequestHandler = async (req, res, next) => {
  try {
    const { password, student: StudentData } = req.body;
    // console.log(req.body);

    const result = await UserServices.createStudent(
      req.file,
      password,
      StudentData,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student Created Successfully',
      data: result,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err) {
    next(err);
  }
};

// faculty
const createFaculty = catchAsync(async (req, res) => {
  const { password, faculty: facultyData } = req.body;

  const result = await UserServices.createFaculty(
    req.file,
    password,
    facultyData,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty is created successfully',
    data: result,
  });
});

const createAdmin = catchAsync(async (req, res) => {
  const { password, admin: adminData } = req.body;

  const result = await UserServices.createAdmin(req.file, password, adminData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin is created successfully',
    data: result,
  });
});

const getMe = catchAsync(async (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    throw new AppError(httpStatus.NOT_FOUND, 'Token not found !');
  }
  const { userId, role } = req.user;

  const result = await UserServices.getMe(userId, role);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `${role} is retrieved successfully`,
    data: result,
  });
});

const changeStatus = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await UserServices.changeStatus(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `${result?.role} Status is updated successfully`,
    data: result,
  });
});

export const userControllers = {
  createStudent,
  createFaculty,
  createAdmin,
  getMe,
  changeStatus,
};
