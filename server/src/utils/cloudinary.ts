import cloudinary from "../config/cloudinary.config.js";
import { UploadApiResponse } from "cloudinary";

export const uploadBufferToCloudinary = (
  fileBuffer: Buffer,
  folderName: string = "resumes"
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folderName,
        resource_type: "auto",
      },
      (error, result) => {
        if (error) return reject(error);
        if (result) return resolve(result);
        reject(new Error("Upload failed. Try again."));
      }
    );
    uploadStream.end(fileBuffer);
  });
};