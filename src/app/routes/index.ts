import { Router } from 'express';
import { studentRoute } from '../modules/students/route.student';
import { userRoute } from '../modules/user/route.user';
import { AcademicSemesterRoutes } from '../modules/academicSemester/route.academicSemester';
import { AcademicFacultyRoutes } from '../modules/academicFaculty/routes.academicFaculty';
import { AcademicDepartmentRoutes } from '../modules/academicDeaptment/routes.academicDepartment';

const router = Router();

const moduleRoute = [
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/students',
    route: studentRoute,
  },
  {
    path: '/academic-semesters',
    route: AcademicSemesterRoutes,
  },
  {
    path: '/academic-faculties',
    route: AcademicFacultyRoutes,
  },
  {
    path: '/academic-departments',
    route: AcademicDepartmentRoutes,
  },
];

moduleRoute.forEach((routeObj) => router.use(routeObj.path, routeObj.route));

export default router;
