import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { courseServices } from './service.course';

const createCourse = catchAsync(async (req, res) => {
  const course = req.body;
  const result = await courseServices.createCourse(course);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course created successfully',
    data: result,
  });
});

// get all
const getAllCourses = catchAsync(async (req, res) => {
  const result = await courseServices.getAllCourse(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course are retrieved successfully',
    data: result,
  });
});

// single
const getSingleCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await courseServices.getSingleCourse(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course is retrieved successfully',
    data: result,
  });
});

// update
const updateCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { updatedData } = req.body;
  const result = await courseServices.updateCourse(id, updatedData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course updated successfully',
    data: result,
  });
});

// delete
const deleteCourse = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await courseServices.deleteCourse(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course deleted successfully',
    data: result,
  });
});

export const courseControllers = {
  createCourse,
  getAllCourses,
  getSingleCourse,
  updateCourse,
  deleteCourse,
};
