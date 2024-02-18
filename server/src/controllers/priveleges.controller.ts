import { Request, Response, NextFunction } from "express";

import { dbQuery } from "../db";

const privelegesCamelCase: string = `id as "privelegeId", title`;

class PrivelegesController {
  // This function is not implemented yet
  async createPrivelege(req: Request, res: Response, next: NextFunction) {
    res.sendStatus(501);
  }

  // Method to get all priveleges
  async getPriveleges(req: Request, res: Response, next: NextFunction) {
    try {
      const priveleges = await dbQuery({
        text: `SELECT ${privelegesCamelCase} FROM priveleges ORDER BY title`,
      });
      res.status(200).json(priveleges.rows);
    } catch (error) {
      // Pass the error to the errorHandler middleware
      next(error);
    }
  }

  // This function is not implemented yet
  async getOnePrivelege(req: Request, res: Response, next: NextFunction) {
    res.sendStatus(501);
  }

  // This function is not implemented yet
  async updatePrivelege(req: Request, res: Response, next: NextFunction) {
    res.sendStatus(501);
  }

  // This function is not implemented yet
  async deletePrivelege(req: Request, res: Response, next: NextFunction) {
    res.sendStatus(501);
  }
}

export default new PrivelegesController();
