import { Router, Request, Response, NextFunction } from "express";
import { uploadResume } from "../../middlewares/upload.middleware.js";
import { uploadBufferToCloudinary } from "../../utils/cloudinary.js";
import { authenticate } from "../../middlewares/authenticate.middleware.js";

const uploadRouter = Router();

uploadRouter.post(
  "/resume",
  authenticate,
  uploadResume.single("resume"), 
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ message: "Please select a PDF file to upload." });
        return;
      }

      // Upload memory buffer to Cloudinary
      const result = await uploadBufferToCloudinary(req.file.buffer, "candidate_resumes");

      res.status(200).json({
        success: true,
        resumeUrl: result.secure_url, 
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "File upload failed" });
    }
  }
);

export default uploadRouter;