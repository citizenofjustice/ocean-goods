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
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadPictureAndGetUrl = exports.uploadImage = void 0;
const storage_1 = require("firebase/storage");
const firebase_config_1 = require("./firebase.config");
const uploadImage = (image) => __awaiter(void 0, void 0, void 0, function* () {
    const fileId = crypto.randomUUID();
    const sourcePath = `${image.folder}/${fileId}`;
    const sourceRef = (0, storage_1.ref)(firebase_config_1.storage, sourcePath);
    const metadata = {
        contentType: image.type,
    };
    const result = yield (0, storage_1.uploadBytesResumable)(sourceRef, image.source, metadata);
    return result.ref;
});
exports.uploadImage = uploadImage;
const uploadPictureAndGetUrl = (file) => __awaiter(void 0, void 0, void 0, function* () {
    const image = {
        type: file.mimetype,
        folder: file.fieldname,
        source: file.buffer,
    };
    const storedImageRef = yield (0, exports.uploadImage)(image);
    const sourceUrl = yield (0, storage_1.getDownloadURL)(storedImageRef);
    return sourceUrl;
});
exports.uploadPictureAndGetUrl = uploadPictureAndGetUrl;
