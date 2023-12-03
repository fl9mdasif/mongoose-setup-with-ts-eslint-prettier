import { RequestHandler } from 'express';
import { StudentService } from './service.user';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

const createStudent: RequestHandler = async (req, res, next) => {
  try {
    const { password, student: StudentData } = req.body;

    const result = await StudentService.createStudent(password, StudentData);

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

export const userController = {
  createStudent,
};
