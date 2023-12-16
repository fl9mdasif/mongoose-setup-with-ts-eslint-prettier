import { Router } from 'express';
import { studentRoute } from '../modules/students/route.student';
import { userRoute } from '../modules/user/route.user';
import { AcademicSemesterRoutes } from '../modules/academicSemester/route.academicSemester';
import { AcademicFacultyRoutes } from '../modules/academicFaculty/routes.academicFaculty';
import { AcademicDepartmentRoutes } from '../modules/academicDepartment/routes.academicDepartment';
import { FacultyRoutes } from '../modules/faculty/route.faculty';
import { AdminRoutes } from '../modules/admin/route.admin';
import { CourseRoutes } from '../modules/course/route.course';
import { semesterRegistrationRoutes } from '../modules/semesterRegistration/route.semesterRegistration';
import { offeredCourseRoutes } from '../modules/offeredCourse/route.offeredCourse';

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
    path: '/faculties',
    route: FacultyRoutes,
  },
  {
    path: '/admins',
    route: AdminRoutes,
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
  {
    path: '/courses',
    route: CourseRoutes,
  },
  {
    path: '/semesterRegistration',
    route: semesterRegistrationRoutes,
  },
  {
    path: '/offered-courses',
    route: offeredCourseRoutes,
  },
];

moduleRoute.forEach((routeObj) => router.use(routeObj.path, routeObj.route));

export default router;
