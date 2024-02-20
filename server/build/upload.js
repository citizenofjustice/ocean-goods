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
// Exporting an async function to upload an image
const uploadImage = (image) => __awaiter(void 0, void 0, void 0, function* () {
    // Generating a random UUID for the file
    const fileId = crypto.randomUUID();
    // Creating the path for the file in the storage
    const sourcePath = `${image.folder}/${fileId}`;
    // Creating a reference to the file in the storage
    const sourceRef = (0, storage_1.ref)(firebase_config_1.storage, sourcePath);
    // Defining the metadata for the file
    const metadata = {
        contentType: image.type,
    };
    // Uploading the file to the storage
    const result = yield (0, storage_1.uploadBytesResumable)(sourceRef, image.source, metadata);
    // Returning the reference to the uploaded file
    return result.ref;
});
exports.uploadImage = uploadImage;
// Exporting an async function to upload a picture and get its URL
const uploadPictureAndGetUrl = (file) => __awaiter(void 0, void 0, void 0, function* () {
    // Creating an image object from the file
    const image = {
        type: file.mimetype,
        folder: file.fieldname,
        source: file.buffer,
    };
    // Uploading the image to the storage
    const storedImageRef = yield (0, exports.uploadImage)(image);
    // Getting the download URL for the uploaded image
    const sourceUrl = yield (0, storage_1.getDownloadURL)(storedImageRef);
    return sourceUrl; // Returning the download URL
});
exports.uploadPictureAndGetUrl = uploadPictureAndGetUrl;
