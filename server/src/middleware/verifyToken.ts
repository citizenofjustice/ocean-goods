import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

// Exporting an async function verifyToken
export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the Authorization header from the request
    let authHeader = req.header("Authorization") || req.header("authorization");
    // If the Authorization header does not start with "Bearer ", deny access
    if (!authHeader?.startsWith("Bearer "))
      return res.status(403).send("Доступ запрещен");
    // Extract the token from the Authorization header
    const token = authHeader.split(" ")[1];
    // Verify the token
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      (error: any, decoded: any) => {
        // If there is an error (invalid token), return a 403 status
        if (error) return res.sendStatus(403);
        // If the token is valid, set the user and priveleges in the request
        req.user = decoded.userInfo.user;
        req.priveleges = decoded.userInfo.priveleges;
        // Call the next middleware
        next();
      }
    );
  } catch (error) {
    // If there is an error, return a 500 status and the error message
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    }
  }
};
