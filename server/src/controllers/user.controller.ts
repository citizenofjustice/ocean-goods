import { Request, Response } from "express";
import db from "../db";
import bcrypt from "bcrypt";
import { DatabaseError } from "pg-protocol";
import jwt from "jsonwebtoken";

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

  async authUser(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password)
        res
          .status(400)
          .json({ message: "Одно из полей формы авторизации осталось пустым" });
      const selectQuery = await db.query(
        `SELECT * FROM users WHERE login = $1`,
        [email]
      );
      const foundUser = selectQuery.rows[0];
      if (!foundUser) throw new Error("Введена неверная эл. почта");
      const passwordHash = foundUser.password_hash;
      const isValid = await bcrypt.compare(password, passwordHash);
      if (!isValid) throw new Error("Введен неверный пароль");

      // create JWTs
      const accessToken = jwt.sign(
        {
          userInfo: {
            id: foundUser.user,
            role: foundUser.role_id,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "10m",
        }
      );
      const refreshToken = jwt.sign(
        { id: foundUser.id },
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: "1d",
        }
      );
      delete foundUser.password_hash;
      const updateQuery = await db.query(
        `UPDATE users SET refresh_token = $1 WHERE id = $2 RETURNING *`,
        [refreshToken, +foundUser.id]
      );
      const userWithToken = updateQuery.rows[0];
      res.cookie("token", refreshToken, {
        // httpOnly: true,
        // sameSite: "none",
        // secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.status(200).json({ accessToken, userWithToken });
    } catch (error) {
      if (error instanceof DatabaseError) {
        res.status(409).json({
          error: "authUser went wrong",
        });
      } else if (error instanceof Error) {
        res.status(401).json({ error: error.message });
      }
    }
  }

  async handleRefreshToken(req: Request, res: Response) {
    try {
      const cookies = req.cookies;
      if (!cookies?.token) return res.sendStatus(401);
      const refreshToken = cookies.token;

      const selectQuery = await db.query(
        `SELECT * FROM users WHERE refresh_token = $1`,
        [refreshToken]
      );
      const foundUser = selectQuery.rows[0];
      if (!foundUser) return res.sendStatus(403);

      // evaluate token
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (error: any, decoded: any) => {
          if (!decoded) return res.sendStatus(403);
          if (error || foundUser.id !== decoded.id) return res.sendStatus(403);
          const accessToken = jwt.sign(
            {
              userInfo: {
                id: decoded.user,
                role: foundUser.role_id,
              },
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
              expiresIn: "10m",
            }
          );
          res.json({ accessToken });
        }
      );
    } catch (error) {
      if (error instanceof DatabaseError) {
        res.status(409).json({
          error: "authUser went wrong",
        });
      } else if (error instanceof Error) {
        res.status(401).json({ error: error.message });
      }
    }
  }

  async logoutUser(req: Request, res: Response) {
    try {
      const cookies = req.cookies;
      if (!cookies?.token) return res.sendStatus(204); // No content
      const refreshToken = cookies.token;

      // is refreshToken in db
      const selectQuery = await db.query(
        `SELECT * FROM users WHERE refresh_token = $1`,
        [refreshToken]
      );
      const foundUser = selectQuery.rows[0];
      if (!foundUser) {
        res.clearCookie("token", {
          // httpOnly: true,
          // sameSite: "none",
          // secure: true,
        });
        return res.sendStatus(204);
      }

      // delete refresh_token in db
      const updateQuery = await db.query(
        `UPDATE users SET refresh_token = '' WHERE refresh_token = $1`,
        [refreshToken]
      );
      res.clearCookie("token", {
        // httpOnly: true,
        // sameSite: "none",
        // secure: true,
      });
      res.sendStatus(204);
    } catch (error) {
      if (error instanceof DatabaseError) {
        res.status(409).json({
          error: "authUser went wrong",
        });
      } else if (error instanceof Error) {
        res.status(401).json({ error: error.message });
      }
    }
  }
}

export default new UserController();
