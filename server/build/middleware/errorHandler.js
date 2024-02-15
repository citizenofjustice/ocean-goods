"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const http_errors_1 = require("http-errors");
const pg_protocol_1 = require("pg-protocol");
const errorHandler = (err, req, res, next) => {
    // Log the error to the console
    console.error(err);
    // Set default status code and error message
    let statusCode = 500;
    let errorMessage = "An unknown error occurred";
    // If the error is a PostgreSQL error, update the status code and error message
    if (err instanceof pg_protocol_1.DatabaseError) {
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
    if ((0, http_errors_1.isHttpError)(err)) {
        statusCode = err.statusCode;
        errorMessage = err.message;
    }
    // If the error is a generic error, use its message
    else if (err instanceof Error) {
        errorMessage = err.message;
    }
    // Send the error response
    res.status(statusCode).json({ error: { message: errorMessage } });
};
exports.errorHandler = errorHandler;
