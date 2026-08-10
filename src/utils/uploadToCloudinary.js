import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
import ApiError from "./ApiError.js";
import HTTP_STATUS from "../constants/httpStatus.js";

const uploadToCloudinary = (file, folder= process.env.CLOUDINARY_PRODUCT_FOLDER) => {
  return new Promise((resolve, reject) => {

    if (!file) {
      return reject(
        new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          "Product image is required."
        )
      );
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          return reject(
            new ApiError(
              HTTP_STATUS.INTERNAL_SERVER_ERROR,
              "Failed to upload image."
            )
          );
        }

        resolve({
          image_url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );

    streamifier
      .createReadStream(file.buffer)
      .pipe(uploadStream);

  });
};

export default uploadToCloudinary;