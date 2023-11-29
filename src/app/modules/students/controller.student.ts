import { NextFunction, Request, Response } from 'express';
import { StudentServices } from './service.student';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

const getAllStudents = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await StudentServices.getAllStudents();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student fetched Successfully',
      data: result,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err) {
    next(err);
  }
};

// single student
const getSingleStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { studentId } = req.params;
    const result = await StudentServices.getSingleStudent(studentId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Single Student fetched Successfully',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const deleteStudent = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { studentId } = req.params;

    const result = StudentServices.deleteSingleStudent(studentId);
    // return result
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student deleted Successfully',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const studentControllers = {
  getAllStudents,
  getSingleStudent,
  deleteStudent,
};
