import { isHttpError } from "http-errors";
import { DatabaseError } from "pg-protocol";
import { Request, Response, NextFunction } from "express";

// Define a type guard function to check if an error is a DatabaseError
function isDatabaseError(err: any): err is DatabaseError {
  // Return true if err is an instance of DatabaseError or if err has a code property
  return err instanceof DatabaseError || err.code !== undefined;
}

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
  if (isDatabaseError(err)) {
    switch (err.code) {
      case "23505":
        // Handle unique violation error
        statusCode = 422;
        errorMessage =
          "Ошибка базы данных. Запись с таким идентификатором уже сущестует";
        break;
      case "23503":
        // Handle foreign key violation error
        errorMessage =
          "Ошибка базы данных. Нарушение внешнего ключа, ссылочная строка не существует в ссылочной таблице";
        break;
      case "42P01":
        // Handle undefined table
        errorMessage =
          "Ошибка базы данных. Таблица или представление не существуют в базе данных";
        break;
      case "42000":
        errorMessage =
          "Ошибка базы данных. Ошибка синтаксиса или нарушение правила доступа";
        break;
      case "42601":
        errorMessage = "Ошибка базы данных. Синтаксическая ошибка";
        break;
      case "42501":
        errorMessage = "Ошибка базы данных. Недостаточные привилегии";
        break;
      case "42846":
        errorMessage = "Ошибка базы данных. Невозможно преобразовать";
        break;
      case "42803":
        errorMessage = "Ошибка базы данных. Ошибка группировки";
        break;
      case "42P20":
        errorMessage = "Ошибка базы данных. Ошибка оконной функции";
        break;
      case "42P19":
        errorMessage = "Ошибка базы данных. Недопустимая рекурсия";
        break;
      case "42830":
        errorMessage = "Ошибка базы данных. Недопустимый внешний ключ";
        break;
      case "42602":
        errorMessage = "Ошибка базы данных. Недопустимое имя";
        break;
      case "42622":
        errorMessage = "Ошибка базы данных. Слишком длинное имя";
        break;
      case "42939":
        errorMessage = "Ошибка базы данных. Зарезервированное имя";
        break;
      case "42804":
        errorMessage = "Ошибка базы данных. Несоответствие типов данных";
        break;
      case "42703":
        errorMessage =
          "Ошибка базы данных. Не найдены необходимые поля в базе данных ";
        break;
      default:
        // Handle other errors
        console.error("Error executing query", err.stack);
        errorMessage = err.message;
    }
    return res.status(statusCode).json({ error: { message: errorMessage } });
  }

  // If the error is an HTTP error, update the status code and error message
  if (isHttpError(err)) {
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
