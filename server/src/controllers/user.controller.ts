import { Request, Response } from "express";
import db from "../db";

class UserController {
  async createUser(req: Request, res: Response) {
    const { login, password, role_id } = req.body;
    const newPerson = await db.query(
      `INSERT INTO users (login, password_hash, role_id) values ($1, $2, $3) RETURNING *`,
      [login, password, role_id]
    );
    console.log(newPerson.rows[0]);
    res.json(newPerson.rows[0]);
  }
  async getUsers(req: Request, res: Response) {
    const users = await db.query(`SELECT * FROM users`);
    res.json(users.rows);
  }
  async getOneUser(req: Request, res: Response) {
    const id = req.params.id;
    const user = await db.query(`SELECT * FROM users WHERE id = $1`, [id]);
    res.json(user.rows[0]);
  }
  async updateUser(req: Request, res: Response) {
    const { id, login, password } = req.body;
    const user = await db.query(
      `UPDATE users SET login = $1, password_hash = $2 WHERE id = $3 RETURNING *`,
      [login, password, id]
    );
    res.json(user.rows[0]);
  }
  async deleteUser(req: Request, res: Response) {
    const id = req.params.id;
    const user = await db.query(`DELETE FROM users WHERE id = $1`, [id]);
    res.json(user.rows[0]);
  }
}

export default new UserController();
