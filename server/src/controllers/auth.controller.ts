import { Request, Response } from "express";
import db from "../db";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { DatabaseError } from "pg-protocol";

class AuthController {
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
            user: foundUser.id,
            role: foundUser.role_id,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "10m",
        }
      );
      const refreshToken = jwt.sign(
        {
          userInfo: {
            user: foundUser.id,
            role: foundUser.role_id,
          },
        },
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
        httpOnly: true,
        sameSite: "none",
        secure: true,
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
          if (error || foundUser.id !== decoded.userInfo.user)
            return res.sendStatus(403);
          const accessToken = jwt.sign(
            {
              userInfo: {
                user: decoded.userInfo.user,
                role: decoded.userInfo.role,
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
          error: "handleRefreshToken went wrong",
        });
      } else if (error instanceof Error) {
        res.status(401).json({ error: error.message });
      }
    }
  }

  async logoutUser(req: Request, res: Response) {
    try {
      const cookies = req.cookies;

      if (!cookies?.token) throw new Error("Refresh token was not found");
      const refreshToken = cookies.token;

      // is refreshToken in db
      const selectQuery = await db.query(
        `SELECT * FROM users WHERE refresh_token = $1`,
        [refreshToken]
      );
      const foundUser = selectQuery.rows[0];
      if (!foundUser) {
        res.clearCookie("token", {
          httpOnly: true,
          sameSite: "none",
          secure: true,
        });
        return res.sendStatus(204);
      }

      // delete refresh_token in db
      const updateQuery = await db.query(
        `UPDATE users SET refresh_token = '' WHERE refresh_token = $1`,
        [refreshToken]
      );
      res.clearCookie("token", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      res.sendStatus(204);
    } catch (error) {
      if (error instanceof DatabaseError) {
        res.status(409).json({
          error: "logoutUser went wrong",
        });
      } else if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      }
    }
  }
}

export default new AuthController();
