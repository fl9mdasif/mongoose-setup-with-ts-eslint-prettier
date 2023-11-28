import { Request, Response } from 'express';
import { StudentService } from './service.user';

const createStudent = async (req: Request, res: Response) => {
  try {
    const { password, student: StudentData } = req.body;
    // zod validation parse
    // const studentZodData = studentValidationSchema.parse(StudentData);

    const result = await StudentService.createStudent(password, StudentData);

    res.status(200).json({
      success: true,
      message: 'Student created successfully',
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

export const userController = {
  createStudent,
};
