import { dbQuery } from "../db";
import { Request, Response, NextFunction } from "express";

// Exporting an async function verifyRole
export const verifyRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // If there is no role in the request, return a 401 status
  if (!req?.role) return res.sendStatus(401);
  // Query the database for the role with the id from the request
  const rolesQuery = await dbQuery({
    text: `SELECT * FROM roles WHERE id = $1`,
    values: [req.role],
  });
  // Get the first row from the query result
  const foundRole = rolesQuery.rows[0];

  if (!foundRole) return res.sendStatus(401); // If there is no role found, return a 401 status
  next(); // Call the next middleware
};
