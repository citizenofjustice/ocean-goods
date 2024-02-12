import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let authHeader = req.header("Authorization") || req.header("authorization");
    if (!authHeader?.startsWith("Bearer "))
      return res.status(403).send("Access denied");
    const token = authHeader.split(" ")[1];
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      (error: any, decoded: any) => {
        if (error) return res.sendStatus(403); // invalid token
        req.user = decoded.userInfo.user;
        req.role = decoded.userInfo.role;
        next();
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    }
  }
};
