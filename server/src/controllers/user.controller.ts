import { Request, Response } from "express";
import db from "../db";
import bcrypt from "bcrypt";
import { DatabaseError } from "pg-protocol";

const userCamelCase: string = `id as "userId", login, role_id as "roleId"`;

class UserController {
  async createUser(req: Request, res: Response) {
    try {
      const { email, password, roleId } = req.body;
      const passwordHash = await bcrypt.hash(password, 13);
      const newPerson = await db.query(
        `INSERT INTO users (login, password_hash, role_id) values ($1, $2, $3) RETURNING *`,
        [email, passwordHash, roleId]
      );

      res.status(201).json(newPerson.rows[0]);
    } catch (error) {
      if (error instanceof DatabaseError && error.code === "23505") {
        res.status(409).json({
          error: "Учетная запись с указанной почтой уже существует",
        });
      } else if (error instanceof Error) {
        res.status(409).json({ error: error.message });
      }
    }
  }
  async authUser(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const selectQuery = await db.query(
        `SELECT * FROM users WHERE login = $1`,
        [email]
      );
      const user = selectQuery.rows[0];
      if (!user) throw new Error("Введена неверная эл. почта");
      const passwordHash = user.password_hash;
      const isValid = await bcrypt.compare(password, passwordHash);
      if (!isValid) throw new Error("Введен неверный пароль");
      res.status(200).json(user);
    } catch (error) {
      if (error instanceof DatabaseError) {
        console.log(error);
        res.status(409).json({
          error: "authUser went wrong",
        });
      } else if (error instanceof Error) {
        res.status(401).json({ error: error.message });
      }
    }
  }
  async getUsers(req: Request, res: Response) {
    const users = await db.query(`SELECT ${userCamelCase} FROM users`);
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
