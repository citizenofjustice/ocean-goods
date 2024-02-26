import { Request, Response, NextFunction } from "express";

import { prisma } from "../db";

class RolesController {
  // This function creates a new role
  async createRole(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, privelegeIds } = req.body;
      // 'privelegeIds' should be a JSON string of an array of privilege IDs
      let priveleges: number[];

      // Try to parse privelegeIds. If it's not a valid JSON string, an error will be thrown
      try {
        priveleges = JSON.parse(privelegeIds);
      } catch (error) {
        // If 'privelegeIds' is not a valid JSON string, return a 400 error with a message
        return res.status(400).json({
          error: { message: "privelegeIds must be a valid JSON string" },
        });
      }

      // If no privileges are provided, return a 400 error with a message
      if (priveleges.length === 0)
        return res.status(400).json({
          error: { message: "Привелегии не были указаны при создании роли" },
        });

      // Create a new role with Prisma and return the created role
      const newRole = await prisma.roles.create({
        data: {
          title: title,
          privelegeIds: priveleges,
        },
      });

      res.status(201).json(newRole); // Return the created role with a 201 status code
    } catch (error) {
      next(error); // Pass the error to the errorHandler middleware
    }
  }

  // This function retrieves all roles along with their associated privileges
  async getRoles(req: Request, res: Response, next: NextFunction) {
    try {
      // Query the database to get all roles and their associated privileges
      const roles = await prisma.roles.findMany({
        select: {
          roleId: true,
          title: true,
          privelegeIds: true,
        },
        orderBy: {
          title: "asc",
        },
      });

      res.status(200).json(roles); // Return the roles
    } catch (error) {
      next(error); // Pass the error to the errorHandler middleware
    }
  }

  // This function retrieves all roles for select input values
  async getRolesSelectValues(req: Request, res: Response, next: NextFunction) {
    try {
      const selectValues = await prisma.roles.findMany({
        select: {
          roleId: true,
          title: true,
        },
        orderBy: {
          title: "asc",
        },
      });

      res.status(200).json(selectValues);
    } catch (error) {
      next(error); // Pass the error to the errorHandler middleware
    }
  }

  // This function is not implemented yet
  async getOneRole(req: Request, res: Response, next: NextFunction) {
    res.sendStatus(501);
  }

  // This function updates a role
  async updateRole(req: Request, res: Response, next: NextFunction) {
    try {
      const { roleId, title, privelegeIds } = req.body;

      let priveleges: number[];
      let roleIdValue: number;

      // Try to parse privelegeIds & roleId. If it's not a valid JSON string, an error will be thrown
      try {
        priveleges = JSON.parse(privelegeIds);
        roleIdValue = JSON.parse(roleId);
      } catch (error) {
        return res.status(400).json({
          error: { message: "Request payload has invalid data" },
        });
      }

      // Query the database to find the role with the given ID
      const foundRole = await prisma.roles.findUnique({
        where: {
          roleId: roleIdValue,
        },
      });

      if (!foundRole) {
        // If the role is not found, return a 404 error with a message
        return res.status(404).json({
          error: {
            message: "Изменение не возможно. Запись не найдена в базе данных",
          },
        });
      }

      // Update the role in the database
      await prisma.roles.update({
        where: {
          roleId: roleIdValue,
        },
        data: {
          title: title,
          privelegeIds: priveleges,
        },
      });
      // Return a 204 status code (request has succeeded but returns no message body)
      res.sendStatus(204);
    } catch (error) {
      next(error); // Pass the error to the errorHandler middleware
    }
  }

  // This function deletes a role
  async deleteRole(req: Request, res: Response, next: NextFunction) {
    try {
      const roleId = parseInt(req.params.id);

      // Query the database to find the role with the given ID
      const foundRole = await prisma.roles.findUnique({
        where: {
          roleId: roleId,
        },
      });
      if (!foundRole)
        // If the role is not found, return a 404 error with a message
        return res.status(404).json({
          error: {
            message: "Удаление не возможно. Запись не найдена в базе данных",
          },
        });

      await prisma.roles.delete({
        where: {
          roleId: roleId,
        },
      });
      // Return a 204 status code (request has succeeded but returns no message body)
      res.sendStatus(204);
    } catch (error) {
      next(error); // Pass the error to the errorHandler middleware
    }
  }
}

export default new RolesController();
