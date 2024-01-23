import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(403).send("Access denied");
    }
    const token = authHeader.split(" ")[1];
    // const verified =
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
      if (error) return res.sendStatus(403); // invalid token
      // if (decoded) req.user = decoded.id;
      console.log("decoded - ", decoded);
      if (decoded) {
        req.user = decoded;
        next();
      }
    });
    // req.payload = verified;
    // next();
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    }
  }
};
