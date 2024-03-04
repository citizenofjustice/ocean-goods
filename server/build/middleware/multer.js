"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const crypto_1 = require("crypto");
// Function to check the file type
function checkFileType(file, cb) {
    // Define the allowed extensions
    const fileTypes = /jpeg|jpg|png|webp/;
    // Check the extension of the uploaded file
    const extName = fileTypes.test(path_1.default.extname(file.originalname).toLowerCase());
    // Check the mime type of the uploaded file
    const mimeType = fileTypes.test(file.mimetype);
    // Correct the encoding of the filename
    file.originalname = Buffer.from(file.originalname, "latin1").toString("utf8");
    // If the mime type and extension are correct, accept the file
    if (mimeType && extName) {
        // If the mime type or extension are incorrect, reject the file
        return cb(null, true);
    }
    else {
        cb(new Error("Unsupported image file type"));
    }
}
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        const path = `./public/images/${file.fieldname}/`;
        fs_1.default.mkdirSync(path, { recursive: true });
        return cb(null, path);
    },
    filename: function (req, file, cb) {
        cb(null, (0, crypto_1.randomUUID)() + path_1.default.extname(file.originalname));
    },
});
// Export the multer configuration
exports.upload = (0, multer_1.default)({
    // Use diskStorage to store the files
    storage: storage,
    // Limit the file size to 5MB
    limits: { fileSize: 5242880 },
    // Use the checkFileType function to filter the files
    fileFilter: function (req, file, cb) {
        return __awaiter(this, void 0, void 0, function* () {
            checkFileType(file, cb);
        });
    },
});
