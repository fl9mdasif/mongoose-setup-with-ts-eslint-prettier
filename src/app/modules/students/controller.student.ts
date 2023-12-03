import { StudentServices } from './service.student';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';

const getAllStudents = catchAsync(async (req, res) => {
  const result = await StudentServices.getAllStudents();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student fetched Successfully',
    data: result,
  });
});

// single student
const getSingleStudent = catchAsync(async (req, res) => {
  const { studentId } = req.params;
  const result = await StudentServices.getSingleStudent(studentId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Single Student fetched Successfully',
    data: result,
  });
});

// delete a student
const deleteStudent = catchAsync(async (req, res) => {
  const { studentId } = req.params;

  const result = StudentServices.deleteSingleStudent(studentId);
  // return result
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student deleted Successfully',
    data: result,
  });
});

export const studentControllers = {
  getAllStudents,
  getSingleStudent,
  deleteStudent,
};
