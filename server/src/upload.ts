import { put } from "@vercel/blob";
import { Request } from "express";

export default async function upload(request: Request) {
  let fileUrl: string = "";
  if (!request.file) {
    return fileUrl;
  } else {
    const blob = await put(request.file.originalname, request.file.buffer, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    return blob.url;
  }
}
