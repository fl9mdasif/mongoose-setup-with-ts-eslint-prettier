import { Request, Response } from 'express';
import { StudentServices } from './service.student';

const getAllStudents = async (req: Request, res: Response) => {
  try {
    const result = await StudentServices.getAllStudents();

    res.status(200).json({
      success: true,
      message: 'Student get successfully',
      data: result,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Something went wrong',
      error: err,
    });
  }
};

// single student

const getSingleStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const result = await StudentServices.getSingleStudent(studentId);

    res.status(200).json({
      success: true,
      message: 'single Students are retrieved successfully',
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: err,
    });
    // console.log(err);
  }
};

const deleteStudent = (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;

    const result = StudentServices.deleteSingleStudent(studentId);
    // return result
    res.status(200).json({
      success: true,
      message: 'Students Update retrieved successfully',
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: err,
    });
  }
};
export const studentControllers = {
  getAllStudents,
  getSingleStudent,
  deleteStudent,
};
