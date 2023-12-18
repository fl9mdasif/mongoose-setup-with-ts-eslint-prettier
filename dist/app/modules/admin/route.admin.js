"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const controller_admin_1 = require("./controller.admin");
const validation_admin_1 = require("./validation.admin");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const constant_user_1 = require("../user/constant.user");
const router = express_1.default.Router();
router.get('/:adminId', controller_admin_1.AdminControllers.getSingleAdmin);
router.patch('/:adminId', (0, validateRequest_1.default)(validation_admin_1.updateAdminValidationSchema), controller_admin_1.AdminControllers.updateAdmin);
router.delete('/:adminId', controller_admin_1.AdminControllers.deleteAdmin);
router.get('/', (0, auth_1.default)(constant_user_1.USER_ROLE.admin), controller_admin_1.AdminControllers.getAllAdmins);
exports.AdminRoutes = router;
