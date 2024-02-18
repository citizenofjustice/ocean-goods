import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";

import { dbQuery } from "../db";

// Define a string to convert column names to camel case
const userCamelCase: string = `id as "userId", login, role_id as "roleId", refresh_token as "refreshToken"`;

class UserController {
  // Method to create a new user
  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, roleId } = req.body;

      // Check if 'email', 'password', or 'roleId' is not provided
      if (!email || !password || !roleId)
        return res.status(400).json({
          error: {
            message: "Одно из полей формы регистрации осталось пустым",
          },
        });

      // Encrypt the password
      const passwordHash = await bcrypt.hash(password, 13);
      // Query the database to create a new user
      const newPerson = await dbQuery({
        text: `INSERT INTO users (login, password_hash, role_id) values ($1, $2, $3) RETURNING *`,
        values: [email, passwordHash, roleId],
      });
      if (!newPerson.rows[0])
        return res.status(400).json({
          error: {
            message:
              "Непредвиденная ошибка. Не удалось создать учетную запись.",
          },
        });
      res.sendStatus(201); // Return the created user with a 201 status code
    } catch (error) {
      next(error); // Pass the error to the errorHandler middleware
    }
  }

  // Method to get all users
  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      // Query the database to get all users
      const users = await dbQuery({
        text: `SELECT ${userCamelCase} FROM users`,
      });
      res.status(200).json(users.rows); // Return the users
    } catch (error) {
      next(error); // Pass the error to the errorHandler middleware
    }
  }

  // Method to get one user
  async getOneUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      // Query the database to get the user with the given ID
      const user = await dbQuery({
        text: `SELECT ${userCamelCase} FROM users WHERE id = $1`,
        values: [id],
      });
      // Return error if user does not exist
      if (!user.rows[0])
        return res.status(404).json({
          error: {
            message: "Пользователь с таким иденитификатором не существует",
          },
        });
      res.json(user.rows[0]); // Return the user
    } catch (error) {
      next(error); // Pass the error to the errorHandler middleware
    }
  }

  // This function is not implemented yet
  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      res.sendStatus(501);
    } catch (error) {
      next(error); // Pass the error to the errorHandler middleware
    }
  }

  // Method to delete a user
  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      // Query the database to check the user with the given ID exists
      const foundUser = await dbQuery({
        text: "SELECT id FROM users WHERE id = $1",
        values: [id],
      });

      if (!foundUser.rows[0])
        // If the user is not found, return a 404 error with a message
        return res.status(404).json({
          error: {
            message:
              "Удаление невозможно. Пользователь с выбранным идентификатором не найден в базе данных",
          },
        });

      // Query the database to delete the user with the given ID
      await dbQuery({
        text: `DELETE FROM users WHERE id = $1`,
        values: [id],
      });
      // Return a 204 status code (request has succeeded but returns no message body)
      res.sendStatus(204);
    } catch (error) {
      next(error); // Pass the error to the errorHandler middleware
    }
  }
}

export default new UserController();
