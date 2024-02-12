import { Request, Response, NextFunction } from "express";
import { isHttpError } from "http-errors";
import { DatabaseError } from "pg-protocol";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log the error to the console
  console.error(err);

  // Set default status code and error message
  let statusCode = 500;
  let errorMessage = "An unknown error occurred";

  // If the error is a PostgreSQL error, update the status code and error message
  if (err instanceof DatabaseError) {
    switch (err.code) {
      case "23505":
        // Handle unique violation error
        break;
      case "23503":
        // Handle foreign key violation error
        break;
      case "42P01":
        // Handle undefined table
        break;
      default:
        // Handle other errors
        console.error("Error executing query", err.stack);
    }
  }

  // If the error is an HTTP error, update the status code and error message
  if (isHttpError(err)) {
    statusCode = err.statusCode;
    errorMessage = err.message;
  }

  // Send the error response
  res.status(statusCode).json({ error: { message: errorMessage } });
};
