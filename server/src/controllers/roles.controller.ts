import { Request, Response } from "express";
import db from "../db";

// const rolesCamelCase: string = `id as "roleId", title, privelege_ids as "privelegeIds"`;

class RolesController {
  async createRole(req: Request, res: Response) {
    const { title, privelegeIds } = req.body;
    const newRole = await db.query(
      `INSERT INTO roles (title, privelege_ids) VALUES ($1, $2) RETURNING *`,
      [title, JSON.parse(privelegeIds)]
    );
    res.json(newRole.rows[0]);
  }
  async getRoles(req: Request, res: Response) {
    // `SELECT ${rolesCamelCase} FROM roles ORDER BY title`
    const roles = await db.query(`
        SELECT r.id as "roleId", r.title, json_agg(json_build_object(
          'privelegeId', pr.id,
          'title', pr.title
        )) as priveleges
        FROM roles r
        RIGHT JOIN priveleges pr
        ON pr.id = ANY(r.privelege_ids)
        WHERE r.id IS NOT NULL
        GROUP BY r.id
      `);
    res.json(roles.rows);
  }
  async getOneRole(req: Request, res: Response) {}
  async updateRole(req: Request, res: Response) {
    const { roleId, title, privelegeIds } = req.body;
    const updatedRole = await db.query(
      `UPDATE roles SET title = $1, privelege_ids = $2 WHERE id = $3 RETURNING *`,
      [title, JSON.parse(privelegeIds), JSON.parse(roleId)]
    );
    res.json(updatedRole.rows[0]);
  }
  async deleteRole(req: Request, res: Response) {
    const { id } = req.params;
    const role = await db.query(`DELETE FROM roles WHERE id = $1`, [id]);
    res.json(role.rows[0]);
  }
}

export default new RolesController();
