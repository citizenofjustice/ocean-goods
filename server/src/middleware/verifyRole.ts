import { Request, Response, NextFunction } from "express";
import db from "../db";

export const verifyRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req?.role) return res.sendStatus(401);
  const rolesQuery = await db.query(`SELECT * FROM roles WHERE id = $1`, [
    req.role,
  ]);
  const foundRole = rolesQuery.rows[0];
  if (!foundRole) return res.sendStatus(401);
  next();
};
