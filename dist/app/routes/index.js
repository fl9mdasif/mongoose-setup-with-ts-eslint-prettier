"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const route_student_1 = require("../modules/students/route.student");
const route_user_1 = require("../modules/user/route.user");
const route_academicSemester_1 = require("../modules/academicSemester/route.academicSemester");
const routes_academicFaculty_1 = require("../modules/academicFaculty/routes.academicFaculty");
const routes_academicDepartment_1 = require("../modules/academicDepartment/routes.academicDepartment");
const route_faculty_1 = require("../modules/faculty/route.faculty");
const route_admin_1 = require("../modules/admin/route.admin");
const route_course_1 = require("../modules/course/route.course");
const router = (0, express_1.Router)();
const moduleRoute = [
    {
        path: '/users',
        route: route_user_1.userRoute,
    },
    {
        path: '/students',
        route: route_student_1.studentRoute,
    },
    {
        path: '/faculties',
        route: route_faculty_1.FacultyRoutes,
    },
    {
        path: '/admins',
        route: route_admin_1.AdminRoutes,
    },
    {
        path: '/academic-semesters',
        route: route_academicSemester_1.AcademicSemesterRoutes,
    },
    {
        path: '/academic-faculties',
        route: routes_academicFaculty_1.AcademicFacultyRoutes,
    },
    {
        path: '/academic-departments',
        route: routes_academicDepartment_1.AcademicDepartmentRoutes,
    },
    {
        path: '/courses',
        route: route_course_1.CourseRoutes,
    },
];
moduleRoute.forEach((routeObj) => router.use(routeObj.path, routeObj.route));
exports.default = router;
