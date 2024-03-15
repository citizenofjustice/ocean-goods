import { prisma } from "../db";
import { Request, Response, NextFunction } from "express";

// Exporting an async function verifyAccess
export const verifyAccess = (priveleges: number[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // If there is no privelege in the request, return a 401 status
      if (!req?.priveleges) return res.sendStatus(401);

      const allowedId: number | undefined = req.priveleges.find(
        (privelegeId: string) => priveleges.includes(parseInt(privelegeId))
      );

      if (!allowedId)
        return res.status(403).json({
          error: {
            message: "Доступ запрещен. Отсутствуют необходимые полномочия.",
          },
        });

      // Query the database for the privelege with the id from the request
      const foundPrivilege = await prisma.privelege.findFirst({
        where: {
          privelegeId: allowedId,
        },
      });

      if (!foundPrivilege) return res.sendStatus(401); // If there is no privelege found, return a 401 status
      next(); // Call the next middleware
    } catch (error) {
      next(error);
    }
  };
};
