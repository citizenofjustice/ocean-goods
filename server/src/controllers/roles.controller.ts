import { Request, Response } from "express";
import db from "../db";

const rolesCamelCase: string = `id as "roleId", title, privelege_ids as "privelegeIds"`;

class RolesController {
  async createRole(req: Request, res: Response) {}
  async getRoles(req: Request, res: Response) {
    const roles = await db.query(
      `SELECT ${rolesCamelCase} FROM roles ORDER BY title`
    );
    res.json(roles.rows);
  }
  async getOneRole(req: Request, res: Response) {}
  async updateRole(req: Request, res: Response) {}
  async deleteRole(req: Request, res: Response) {}
}

export default new RolesController();
