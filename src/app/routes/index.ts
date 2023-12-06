import { Router } from 'express';
import { studentRoute } from '../modules/students/route.student';
import { userRoute } from '../modules/user/route.user';
import { AcademicSemesterRoutes } from '../modules/academicSemester/route.academicSemester';
import { AcademicFacultyRoutes } from '../modules/academicFaculty/routes.academicFaculty';

const router = Router();

const moduleRoute = [
  {
    path: '/user',
    route: userRoute,
  },
  {
    path: '/student',
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
];

moduleRoute.forEach((routeObj) => router.use(routeObj.path, routeObj.route));

export default router;
