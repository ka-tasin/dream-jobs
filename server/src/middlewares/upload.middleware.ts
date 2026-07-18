import multer from "multer";
import { Request } from "express";

const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Invalid file format. Only PDF files are allowed!") as any, false);
  }
};

export const uploadResume = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB Limit
  fileFilter,
});