import { Request, Response, NextFunction } from "express";

import { prisma } from "../db";

class PrivelegesController {
  // This function is not implemented yet
  async createPrivelege(req: Request, res: Response, next: NextFunction) {
    res.sendStatus(501);
  }

  // Method to get all priveleges
  async getPriveleges(req: Request, res: Response, next: NextFunction) {
    try {
      const priveleges = await prisma.priveleges.findMany({
        orderBy: {
          title: "asc",
        },
      });
      res.status(200).json(priveleges);
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
