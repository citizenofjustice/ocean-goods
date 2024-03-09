import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";

import { prisma } from "../db";

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
      // Insert a new user into the database
      const newPerson = await prisma.users.create({
        data: {
          login: email,
          passwordHash: passwordHash,
          roleId: Number(roleId),
        },
      });
      if (!newPerson)
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
      const users = await prisma.users.findMany();
      res.status(200).json(users); // Return the users
    } catch (error) {
      next(error); // Pass the error to the errorHandler middleware
    }
  }

  // Method to get one user
  async getOneUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      // Query the database to get the user with the given ID
      const user = await prisma.users.findUnique({
        where: {
          id: id,
        },
        select: {
          id: true,
          login: true,
          roleId: true,
          refreshToken: true,
        },
      });

      // Return error if user does not exist
      if (!user) {
        return res.status(404).json({
          error: {
            message: "Пользователь с таким иденитификатором не существует",
          },
        });
      }
      res.json(user); // Return the user
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
      const id = parseInt(req.params.id);
      // Query the database to check the user with the given ID exists
      const foundUser = await prisma.users.findUnique({
        where: {
          id: id,
        },
      });

      if (!foundUser)
        // If the user is not found, return a 404 error with a message
        return res.status(404).json({
          error: {
            message:
              "Удаление невозможно. Пользователь с выбранным идентификатором не найден в базе данных",
          },
        });

      // Query the database to delete the user with the given ID
      await prisma.users.delete({
        where: {
          id: id,
        },
      });
      // Return a 204 status code (request has succeeded but returns no message body)
      res.sendStatus(204);
    } catch (error) {
      next(error); // Pass the error to the errorHandler middleware
    }
  }
}

export default new UserController();
