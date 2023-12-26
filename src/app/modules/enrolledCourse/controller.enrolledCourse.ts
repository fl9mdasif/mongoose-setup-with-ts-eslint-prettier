import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { enrolledCourseServices } from './service.enrolledCourse';

const createEnrolledCourse = catchAsync(async (req, res) => {
  //   console.log(req.user);
  const userId = req.user.userId;
  const result = await enrolledCourseServices.createEnrolledCourse(
    userId,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student is enrolled successfully',
    data: result,
  });
});

const updateEnrolledCourseMarks = catchAsync(async (req, res) => {
  const facultyId = req.user.userId;
  // console.log(facultyId);
  const result = await enrolledCourseServices.updateEnrolledCourseMarks(
    facultyId,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Marks is updated successfully',
    data: result,
  });
});
export const enrolledCourseController = {
  createEnrolledCourse,
  updateEnrolledCourseMarks,
};
