import { TCourse } from './interface.course';
import { Course } from './model.course';
import AppError from '../../errors/AppErrors';
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import { CourseSearchableFields } from './constant.course';

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

// update
const updateCourse = async (id: string, updatedData: Partial<TCourse>) => {
  const result = Course.findByIdAndUpdate(id, updatedData, { new: true });
  return result;
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

export const courseServices = {
  createCourse,
  getAllCourse,
  getSingleCourse,
  updateCourse,
  deleteCourse,
};
