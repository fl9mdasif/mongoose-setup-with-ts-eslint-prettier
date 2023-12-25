import httpStatus from 'http-status';
import AppError from '../../errors/AppErrors';
import { OfferedCourse } from '../offeredCourse/model.offeredCourse';
import EnrolledCourse from './model.enrolledCourse';
import { Student } from '../students/model.student';
import { TEnrolledCourse } from './interface.enrolledCourse';
import { Course } from '../course/model.course';
import { SemesterRegistration } from '../semesterRegistration/model.semesterRegistration';

const createEnrolledCourse = async (
  userId: string,
  payload: TEnrolledCourse,
) => {
  /**
   * Step1: Check if the offered courses is exists
   * Step2: Check if the student is already enrolled
   * Step3: Check if the max credits exceed
   * Step4: Create an enrolled course
   */
  const { offeredCourse } = payload;
  //   console.log(offeredCourse);

  // 01
  const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse);

  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered course not found !');
  }

  // 02
  const student = await Student.findOne({ id: userId }, { _id: 1 });

  if (!student) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student not found !');
  }

  // already enrolled?
  const isStudentAlreadyEnrolled = await EnrolledCourse.findOne({
    semesterRegistration: isOfferedCourseExists?.semesterRegistration,
    offeredCourse,
    student: student._id,
  });

  if (isStudentAlreadyEnrolled) {
    throw new AppError(httpStatus.CONFLICT, 'Student is already enrolled !');
  }

  // check max capacity
  if (isOfferedCourseExists.maxCapacity <= 0) {
    throw new AppError(httpStatus.BAD_GATEWAY, 'Room is full !');
  }

  // check total credits exceeds maxCredit
  const course = await Course.findById(isOfferedCourseExists.course);
  const currentCredit = course?.credits;

  const semesterRegistration = await SemesterRegistration.findById(
    isOfferedCourseExists.semesterRegistration,
  ).select('maxCredit');

  const maxCredit = semesterRegistration?.maxCredit;
};

export const enrolledCourseServices = {
  createEnrolledCourse,
};
