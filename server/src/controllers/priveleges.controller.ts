import { Request, Response } from "express";
import db, { dbQuery } from "../db";

const privelegesCamelCase: string = `id as "privelegeId", title`;

class PrivelegesController {
  async createPrivelege(req: Request, res: Response) {}
  async getPriveleges(req: Request, res: Response) {
    const priveleges = await dbQuery({
      text: `SELECT ${privelegesCamelCase} FROM priveleges ORDER BY title`,
    });
    res.json(priveleges.rows);
  }
  async getOnePrivelege(req: Request, res: Response) {}
  async updatePrivelege(req: Request, res: Response) {}
  async deletePrivelege(req: Request, res: Response) {}
}

export default new PrivelegesController();
