import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storage } from "./firebase.config";

type FirebaseImageType = {
  type: string;
  folder: string;
  source: Buffer;
};

export const uploadImage = async (image: FirebaseImageType) => {
  const fileId = crypto.randomUUID();
  const sourcePath = `${image.folder}/${fileId}`;
  const sourceRef = ref(storage, sourcePath);
  const metadata = {
    contentType: image.type,
  };
  const result = await uploadBytesResumable(sourceRef, image.source, metadata);
  return result.ref;
};

export const uploadPictureAndGetUrl = async (file: Express.Multer.File) => {
  const image: FirebaseImageType = {
    type: file.mimetype,
    folder: file.fieldname,
    source: file.buffer,
  };
  const storedImageRef = await uploadImage(image);
  const sourceUrl = await getDownloadURL(storedImageRef);
  return sourceUrl;
};
