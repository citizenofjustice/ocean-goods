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
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
function checkFileType(file, cb) {
    // Allowed ext
    const fileTypes = /jpeg|jpg|png/;
    // Check ext
    const extName = fileTypes.test(path_1.default.extname(file.originalname).toLowerCase());
    // Check mime
    const mimeType = fileTypes.test(file.mimetype);
    // Correcting filename encoding
    file.originalname = Buffer.from(file.originalname, "latin1").toString("utf8");
    if (mimeType && extName) {
        return cb(null, true);
    }
    else {
        cb(new Error("Error: Images Only !!!"));
    }
}
exports.upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 5242880 },
    fileFilter: function (req, file, cb) {
        return __awaiter(this, void 0, void 0, function* () {
            checkFileType(file, cb);
        });
    },
});
