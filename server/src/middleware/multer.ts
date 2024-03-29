import fs from "fs";
import path from "path";
import sharp from "sharp";
import { randomUUID } from "crypto";
import multer, { FileFilterCallback } from "multer";
import { Request, Response, NextFunction } from "express";

// Function to check the file type
function checkFileType(file: Express.Multer.File, cb: FileFilterCallback) {
  try {
    // Define the allowed extensions
    const fileTypes = /jpeg|jpg|png|webp/;
    // Check the extension of the uploaded file
    const extName = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    // Check the mime type of the uploaded file
    const mimeType = fileTypes.test(file.mimetype);
    // Correct the encoding of the filename
    file.originalname = Buffer.from(file.originalname, "latin1").toString(
      "utf8"
    );

    // If the mime type and extension are correct, accept the file
    if (mimeType && extName) {
      // If the mime type or extension are incorrect, reject the file
      return cb(null, true);
    } else {
      cb(new Error("Unsupported image file type"));
    }
  } catch (error) {
    console.error(error);
  }
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const path = `./public/images/${file.fieldname}`;
    fs.mkdirSync(path, { recursive: true });
    return cb(null, path);
  },
  filename: function (req, file, cb) {
    cb(null, randomUUID() + path.extname(file.originalname)); // Change the extension to .webp
  },
});

// Export the multer configuration
export const upload = multer({
  // Use diskStorage to store the files
  storage: storage,
  // Limit the file size to 5MB
  limits: { fileSize: 5242880 },
  // Use the checkFileType function to filter the files
  fileFilter: async function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// Middleware to convert image to webp
export const convertToWebp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { file } = req;
    if (file) {
      // Convert image to webp format and get metadata
      const image = sharp(file.path);
      const resizedWebpImage = await image.resize(500).webp().toBuffer();
      const converted = `${file.destination}/converted`;
      fs.mkdirSync(converted, { recursive: true });
      const filePath = `${converted}/${randomUUID()}.webp`;
      // Write the converted image to the file system
      await fs.promises.writeFile(filePath, resizedWebpImage);

      const newImage = sharp(resizedWebpImage);
      const newImageMeta = await newImage.metadata();
      if (newImageMeta.width && newImageMeta.height) {
        // Attach the image dimensions to the request object
        req.imageDimensions = {
          width: newImageMeta.width,
          height: newImageMeta.height,
        };
      } else
        return res
          .status(400)
          .json({ error: { message: "Не удалось обработать изображение" } });

      // delete a file asynchronously
      fs.unlink(file.path, (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log("File is deleted.");
        }
      });

      file.mimetype = "image/webp";
      file.path = filePath;
    }
    next();
  } catch (error) {
    next(error);
  }
};
