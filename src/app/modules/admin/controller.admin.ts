import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AdminServices } from './service.admin';

// get all admin
const getAllAdmins = catchAsync(async (req, res) => {
  const result = await AdminServices.getAllAdminsFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admins are retrieved successfully',
    data: result,
  });
});

// get single admin
const getSingleAdmin = catchAsync(async (req, res) => {
  const { adminId } = req.params;
  const result = await AdminServices.getSingleAdminFromDB(adminId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin is retrieved successfully',
    data: result,
  });
});

// update
const updateAdmin = catchAsync(async (req, res) => {
  const { adminId } = req.params;
  const { admin } = req.body;
  const result = await AdminServices.updateAdminIntoDB(adminId, admin);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin is updated successfully',
    data: result,
  });
});

// delete
const deleteAdmin = catchAsync(async (req, res) => {
  const { adminId } = req.params;
  await AdminServices.deleteAdminFromDB(adminId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin is deleted successfully',
    data: null,
  });
});

export const AdminControllers = {
  getAllAdmins,
  getSingleAdmin,
  deleteAdmin,
  updateAdmin,
};
