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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../config"));
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
    const accessToken = jsonwebtoken_1.default.sign(jwtPayload, config_1.default.jwt_access_secret, {
        expiresIn: '10d',
    });
    return {
        accessToken,
        needsPasswordChange: user === null || user === void 0 ? void 0 : user.needsPasswordChange,
    };
});
// change password
const changePassword = (userData, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // 01. checking if the user is exist
    const user = yield model_user_1.User.isUserExistsByCustomId(userData.userId);
    // console.log(user);
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
exports.authServices = {
    loginUser,
    changePassword,
    // refreshToken,
};
