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

export const enrolledCourseController = {
  createEnrolledCourse,
};
