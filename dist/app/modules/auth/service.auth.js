"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppErrors_1 = __importDefault(require("../../errors/AppErrors"));
const model_user_1 = require("../user/model.user");
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../config"));
const utils_auth_1 = require("./utils.auth");
const sendEmail_1 = require("../../utils/sendEmail");
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. checking if the user is exist
    const user = yield model_user_1.User.isUserExistsByCustomId(payload.id);
    if (!user) {
        throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, `This user is not found !'`);
    }
    // 2. checking if the user is already deleted
    const isDeleted = user === null || user === void 0 ? void 0 : user.isDeleted;
    if (isDeleted) {
        throw new AppErrors_1.default(http_status_1.default.FORBIDDEN, `This ${user.role} is deleted !`);
    }
    // 3. checking if the user is blocked
    const userStatus = user === null || user === void 0 ? void 0 : user.status;
    if (userStatus === 'blocked') {
        throw new AppErrors_1.default(http_status_1.default.FORBIDDEN, `This ${user.role} status is blocked ! !`);
    }
    // 4. checking if the password is correct
    if (!(yield model_user_1.User.isPasswordMatched(payload === null || payload === void 0 ? void 0 : payload.password, user === null || user === void 0 ? void 0 : user.password)))
        throw new AppErrors_1.default(http_status_1.default.FORBIDDEN, `Password of '${user.role}' do not matched`);
    // console.log(user);
    // 5. create token and sent to the client
    const jwtPayload = {
        userId: user.id,
        role: user.role,
    };
    // create token
    const accessToken = (0, utils_auth_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    // refresh token
    const refreshToken = (0, utils_auth_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_refresh_expires_in);
    return {
        accessToken,
        refreshToken,
        needsPasswordChange: user === null || user === void 0 ? void 0 : user.needsPasswordChange,
    };
});
// change password
const changePassword = (userData, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // 01. checking if the user is exist
    const user = yield model_user_1.User.isUserExistsByCustomId(userData.userId);
    // console.log(userData);
    if (!user) {
        throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, 'This user is not found !');
    }
    // 02. checking if the user is already deleted
    const isDeleted = user === null || user === void 0 ? void 0 : user.isDeleted;
    if (isDeleted) {
        throw new AppErrors_1.default(http_status_1.default.FORBIDDEN, `This ${user.role} is deleted !`);
    }
    // 03. checking if the user is blocked
    const userStatus = user === null || user === void 0 ? void 0 : user.status;
    if (userStatus === 'blocked') {
        throw new AppErrors_1.default(http_status_1.default.FORBIDDEN, `This ${user.role} status is blocked !`);
    }
    // 04. checking if the password is correct
    if (!(yield model_user_1.User.isPasswordMatched(payload.oldPassword, user === null || user === void 0 ? void 0 : user.password)))
        throw new AppErrors_1.default(http_status_1.default.FORBIDDEN, `${user.role}'s Password do not matched`);
    // 05.hash new password
    const newHashedPassword = yield bcrypt_1.default.hash(payload.newPassword, Number(config_1.default.bcrypt_salt_round));
    // update password
    yield model_user_1.User.findOneAndUpdate({
        id: userData.userId,
        role: userData.role,
    }, {
        password: newHashedPassword,
        needsPasswordChange: false,
        passwordChangedAt: new Date(),
    }, { new: true, runValidators: true });
});
// create refresh token
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the given token is valid
    const decoded = (0, utils_auth_1.verifyToken)(token, config_1.default.jwt_refresh_secret);
    const { userId, iat } = decoded;
    // console.log(decoded);
    // checking if the user is exist
    const user = yield model_user_1.User.isUserExistsByCustomId(userId);
    if (!user) {
        throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, 'This user is not found !');
    }
    // checking if the user is already deleted
    const isDeleted = user === null || user === void 0 ? void 0 : user.isDeleted;
    if (isDeleted) {
        throw new AppErrors_1.default(http_status_1.default.FORBIDDEN, 'This user is deleted !');
    }
    // checking if the user is blocked
    const userStatus = user === null || user === void 0 ? void 0 : user.status;
    if (userStatus === 'blocked') {
        throw new AppErrors_1.default(http_status_1.default.FORBIDDEN, 'This user is blocked ! !');
    }
    if (user.passwordChangedAt &&
        model_user_1.User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat)) {
        throw new AppErrors_1.default(http_status_1.default.UNAUTHORIZED, 'You are not authorized !');
    }
    const jwtPayload = {
        userId: user.id,
        role: user.role,
    };
    const accessToken = (0, utils_auth_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    return {
        accessToken,
    };
});
// forget password
const forgetPassword = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the user is exist
    const user = yield model_user_1.User.isUserExistsByCustomId(userId);
    // console.log(user.id);
    if (!user) {
        throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, 'This user is not found !');
    }
    // checking if the user is already deleted
    const isDeleted = user === null || user === void 0 ? void 0 : user.isDeleted;
    if (isDeleted) {
        throw new AppErrors_1.default(http_status_1.default.FORBIDDEN, 'This user is deleted !');
    }
    // checking if the user is blocked
    const userStatus = user === null || user === void 0 ? void 0 : user.status;
    if (userStatus === 'blocked') {
        throw new AppErrors_1.default(http_status_1.default.FORBIDDEN, 'This user is blocked ! !');
    }
    const jwtPayload = {
        userId: user.id,
        role: user.role,
    };
    // create token
    const resetToken = (0, utils_auth_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, '10m');
    const resetLink = `${config_1.default.reset_pass_link}?id=${userId}&token=${resetToken}`;
    (0, sendEmail_1.sendMail)(user.email, resetLink);
    // console.log(resetLink);
});
// reset password
const resetPassword = (payload, token) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the user is exist
    const user = yield model_user_1.User.isUserExistsByCustomId(payload === null || payload === void 0 ? void 0 : payload.id);
    if (!user) {
        throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, 'This user is not found !');
    }
    // checking if the user is already deleted
    const isDeleted = user === null || user === void 0 ? void 0 : user.isDeleted;
    if (isDeleted) {
        throw new AppErrors_1.default(http_status_1.default.FORBIDDEN, 'This user is deleted !');
    }
    // checking if the user is blocked
    const userStatus = user === null || user === void 0 ? void 0 : user.status;
    if (userStatus === 'blocked') {
        throw new AppErrors_1.default(http_status_1.default.FORBIDDEN, 'This user is blocked ! !');
    }
    const decoded = (0, utils_auth_1.verifyToken)(token, config_1.default.jwt_access_secret);
    //localhost:3000?id=A-0001&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJBLTAwMDEiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDI4NTA2MTcsImV4cCI6MTcwMjg1MTIxN30.-T90nRaz8-KouKki1DkCSMAbsHyb9yDi0djZU3D6QO4
    // console.log(payload.id, payload.newPassword, decoded.userId);
    if (payload.id !== decoded.userId) {
        throw new AppErrors_1.default(http_status_1.default.FORBIDDEN, 'You are forbidden!');
    }
    // 05.hash new password
    const newHashedPassword = yield bcrypt_1.default.hash(payload.newPassword, Number(config_1.default.bcrypt_salt_round));
    // decoded { userId: 'A-0001', role: 'admin', iat: 1703395065, exp: 1703395665 }
    // update password
    yield model_user_1.User.findOneAndUpdate({
        id: decoded.userId,
        role: decoded.role,
    }, {
        password: newHashedPassword,
        needsPasswordChange: false,
        passwordChangedAt: new Date(),
    });
});
exports.authServices = {
    loginUser,
    changePassword,
    refreshToken,
    forgetPassword,
    resetPassword,
};
