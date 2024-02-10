import { TCourse, TCourseFaculty } from './interface.course';
import { Course, CourseFaculty } from './model.course';
import AppError from '../../errors/AppErrors';
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import { CourseSearchableFields } from './constant.course';
import mongoose from 'mongoose';

// create
const createCourse = async (payload: TCourse) => {
  const result = await Course.create(payload);
  return result;
};

// get all
const getAllCourse = async (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilder(
    Course.find().populate('preRequisiteCourses.course'),
    query,
  )
    .search(CourseSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await courseQuery.modelQuery;
  return result;
};

// get single
const getSingleCourse = async (id: string) => {
  const result = Course.findById(id).populate('preRequisiteCourses.course');
  return result;
};

// update course error

const updateCourse = async (id: string, updatedData: Partial<TCourse>) => {
  const { preRequisiteCourses, ...courseRemainingData } = updatedData;

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // Basic update
    const updatedBasicCourseInfo = await Course.findByIdAndUpdate(
      id,
      courseRemainingData,
      { new: true, runValidators: true, session },
    );

    if (!updatedBasicCourseInfo) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course');
    }

    // Update preRequisiteCourse
    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      // Filter out the deleted fields
      const deletedPreRequisites = preRequisiteCourses
        .filter((el) => el.course && el.isDeleted)
        .map((el) => el.course);

      // Remove preRequisiteCourse
      const deletedPreRequisiteCourses = await Course.findByIdAndUpdate(
        id,
        {
          $pull: {
            preRequisiteCourses: { course: { $in: deletedPreRequisites } },
          },
        },
        { new: true, runValidators: true, session },
      );

      if (!deletedPreRequisiteCourses) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course');
      }

      // Filter out the new course fields
      const newPreRequisites = preRequisiteCourses?.filter(
        (el) => el.course && !el.isDeleted,
      );

      const newPreRequisiteCourses = await Course.findByIdAndUpdate(
        id,
        {
          $addToSet: { preRequisiteCourses: { $each: newPreRequisites } },
        },
        {
          // upsert: true,
          new: true,
          runValidators: true,
          session,
        },
      );

      if (!newPreRequisiteCourses) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course');
      }

      const result = await Course.findById(id).populate(
        'preRequisiteCourses.course',
      );
      return result;
    }

    await session.commitTransaction();
    await session.endSession();
  } catch (err) {
    session.abortTransaction();
    session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course');
  }
};

// delete
const deleteCourse = async (id: string) => {
  const deletedCourse = await Course.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!deletedCourse) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete course');
  }

  return deletedCourse;
};

// assign course faculty
const assignFacultiesWithCourseIntoDB = async (
  id: string,
  payload: Partial<TCourseFaculty>,
) => {
  const result = await CourseFaculty.findByIdAndUpdate(
    id,
    {
      course: id,
      $addToSet: { faculties: { $each: payload } },
    },
    {
      upsert: true,
      new: true,
    },
  );
  return result;
};

const getFacultiesWithCourseFromDB = async (courseId: string) => {
  const result = await CourseFaculty.findOne({ course: courseId }).populate(
    'faculties',
  );
  return result;
};

const removeFacultiesFromCourseFromDB = async (
  id: string,
  payload: Partial<TCourseFaculty>,
) => {
  const result = await CourseFaculty.findByIdAndUpdate(
    id,
    {
      $pull: { faculties: { $in: payload } },
    },
    {
      new: true,
    },
  );
  return result;
};

export const courseServices = {
  createCourse,
  getAllCourse,
  getSingleCourse,
  updateCourse,
  deleteCourse,
  assignFacultiesWithCourseIntoDB,
  getFacultiesWithCourseFromDB,
  removeFacultiesFromCourseFromDB,
};
