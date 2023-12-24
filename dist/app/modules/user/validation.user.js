"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const constant_user_1 = require("./constant.user");
const userValidationSchema = zod_1.z.object({
    password: zod_1.z
        .string({
        invalid_type_error: 'Password must be string',
    })
        .max(20, { message: 'Password can not be more than 20 characters' })
        .optional(),
});
const changeStatusValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum([...constant_user_1.UserStatus]),
    }),
});
exports.UserValidation = {
    userValidationSchema,
    changeStatusValidationSchema,
};
