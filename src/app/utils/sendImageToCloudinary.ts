/* eslint-disable no-console */
import { v2 as cloudinary } from 'cloudinary';
import config from '../config';
import multer from 'multer';
import fs from 'fs';

// cloud config
cloudinary.config({
  cloud_name: config.cloud_name,
  api_key: config.cloud_api_Key,
  api_secret: config.cloud_api_secret,
});

export const sendImageToCloudinary = (image_name: string, path: string) => {
  //
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      path,
      { public_id: image_name },
      function (error, result) {
        if (error) {
          reject(error);
        }
        resolve(result);
        // delete a file asynchronously
        fs.unlink(path, (err) => {
          if (err) {
            reject(err);
          } else {
            console.log('File is deleted successfully');
          }
        });
      },
    );
  });
};

// multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + '/uploads');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

// multer parser
export const upload = multer({ storage: storage });
