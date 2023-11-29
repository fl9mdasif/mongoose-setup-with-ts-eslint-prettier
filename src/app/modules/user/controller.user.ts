import { NextFunction, Request, Response } from 'express';
import { StudentService } from './service.user';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

const createStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { password, student: StudentData } = req.body;
    // zod validation parse
    // const studentZodData = studentValidationSchema.parse(StudentData);

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
