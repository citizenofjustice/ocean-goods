import multer, { FileFilterCallback } from "multer";
import path from "path";

function checkFileType(file: Express.Multer.File, cb: FileFilterCallback) {
  // Allowed ext
  const fileTypes = /jpeg|jpg|png/;
  // Check ext
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimeType = fileTypes.test(file.mimetype);
  // Correcting filename encoding
  file.originalname = Buffer.from(file.originalname, "latin1").toString("utf8");

  if (mimeType && extName) {
    return cb(null, true);
  } else {
    cb(new Error("Error: Images Only !!!"));
  }
}

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5242880 },
  fileFilter: async function (req, file, cb) {
    checkFileType(file, cb);
  },
});
