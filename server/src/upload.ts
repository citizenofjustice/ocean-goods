import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

import { storage } from "./firebase.config";

// Defining a type for Firebase images
type FirebaseImageType = {
  type: string;
  folder: string;
  source: Buffer;
};

// Exporting an async function to upload an image
export const uploadImage = async (image: FirebaseImageType) => {
  // Generating a random UUID for the file
  const fileId = crypto.randomUUID();
  // Creating the path for the file in the storage
  const sourcePath = `${image.folder}/${fileId}`;
  // Creating a reference to the file in the storage
  const sourceRef = ref(storage, sourcePath);
  // Defining the metadata for the file
  const metadata = {
    contentType: image.type,
  };
  // Uploading the file to the storage
  const result = await uploadBytesResumable(sourceRef, image.source, metadata);
  // Returning the reference to the uploaded file
  return result.ref;
};

// Exporting an async function to upload a picture and get its URL
export const uploadPictureAndGetUrl = async (file: Express.Multer.File) => {
  // Creating an image object from the file
  const image: FirebaseImageType = {
    type: file.mimetype,
    folder: file.fieldname,
    source: file.buffer,
  };
  // Uploading the image to the storage
  const storedImageRef = await uploadImage(image);
  // Getting the download URL for the uploaded image
  const sourceUrl = await getDownloadURL(storedImageRef);
  return sourceUrl; // Returning the download URL
};
