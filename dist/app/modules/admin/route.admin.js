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
const router = express_1.default.Router();
router.get('/', controller_admin_1.AdminControllers.getAllAdmins);
router.get('/:adminId', controller_admin_1.AdminControllers.getSingleAdmin);
router.patch('/:adminId', (0, validateRequest_1.default)(validation_admin_1.updateAdminValidationSchema), controller_admin_1.AdminControllers.updateAdmin);
router.delete('/:adminId', controller_admin_1.AdminControllers.deleteAdmin);
exports.AdminRoutes = router;
