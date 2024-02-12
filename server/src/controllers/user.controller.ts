import { Request, Response } from "express";
import db, { dbQuery } from "../db";
import bcrypt from "bcrypt";
import { DatabaseError } from "pg-protocol";

const userCamelCase: string = `id as "userId", login, role_id as "roleId", refresh_token as "refreshToken"`;

class UserController {
  async createUser(req: Request, res: Response) {
    try {
      const { email, password, roleId } = req.body;
      if (!email || !password || !roleId)
        res
          .status(400)
          .json({ message: "Одно из полей формы регистрации осталось пустым" });

      // encrypt the password
      const passwordHash = await bcrypt.hash(password, 13);
      // create new user
      const newPerson = await dbQuery({
        text: `INSERT INTO users (login, password_hash, role_id) values ($1, $2, $3) RETURNING *`,
        values: [email, passwordHash, roleId],
      });

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

  async getUsers(req: Request, res: Response) {
    const users = await dbQuery({ text: `SELECT ${userCamelCase} FROM users` });
    res.json(users.rows);
  }

  async getOneUser(req: Request, res: Response) {
    const id = req.params.id;
    const user = await dbQuery({
      text: `SELECT * FROM users WHERE id = $1`,
      values: [id],
    });
    res.json(user.rows[0]);
  }

  async updateUser(req: Request, res: Response) {
    const { id, login, password } = req.body;
    const user = await dbQuery({
      text: `UPDATE users SET login = $1, password_hash = $2 WHERE id = $3 RETURNING *`,
      values: [login, password, id],
    });
    res.json(user.rows[0]);
  }

  async deleteUser(req: Request, res: Response) {
    const id = req.params.id;
    const user = await dbQuery({
      text: `DELETE FROM users WHERE id = $1`,
      values: [id],
    });
    res.json(user.rows[0]);
  }
}

export default new UserController();
