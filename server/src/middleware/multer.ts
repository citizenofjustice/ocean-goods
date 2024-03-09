import path from "path";
import multer, { FileFilterCallback } from "multer";
import fs from "fs";
import { randomUUID } from "crypto";

// Function to check the file type
function checkFileType(file: Express.Multer.File, cb: FileFilterCallback) {
  // Define the allowed extensions
  const fileTypes = /jpeg|jpg|png|webp/;
  // Check the extension of the uploaded file
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  // Check the mime type of the uploaded file
  const mimeType = fileTypes.test(file.mimetype);
  // Correct the encoding of the filename
  file.originalname = Buffer.from(file.originalname, "latin1").toString("utf8");

  // If the mime type and extension are correct, accept the file
  if (mimeType && extName) {
    // If the mime type or extension are incorrect, reject the file
    return cb(null, true);
  } else {
    cb(new Error("Unsupported image file type"));
  }
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const path = `./public/images/${file.fieldname}/`;
    fs.mkdirSync(path, { recursive: true });
    return cb(null, path);
  },
  filename: function (req, file, cb) {
    cb(null, randomUUID() + path.extname(file.originalname));
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
