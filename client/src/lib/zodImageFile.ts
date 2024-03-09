import z from "zod";

const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const zodImageFile = z
  .custom<File>((val) => val instanceof File, "Загрузите изображение")
  .refine((file) => {
    return file?.size <= MAX_FILE_SIZE;
  }, `Размер файла не должен превышать 5MB`)
  .refine(
    (file) => ACCEPTED_IMAGE_MIME_TYPES.includes(file?.type),
    "Поддерживаются только .jpg, .jpeg, .png and .webp форматы"
  );
