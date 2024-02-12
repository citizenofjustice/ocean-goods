import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

import db, { dbQuery } from "../db";

class AuthController {
  async authUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      if (!email || !password)
        res
          .status(400)
          .json({ message: "Одно из полей формы авторизации осталось пустым" });
      const selectQuery = await dbQuery({
        text: `SELECT * FROM users WHERE login = $1`,
        values: [email],
      });
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
      const updateQuery = await dbQuery({
        text: `UPDATE users SET refresh_token = $1 WHERE id = $2 RETURNING login, role_id as "roleId"`,
        values: [refreshToken, foundUser.id],
      });
      const userWithToken = updateQuery.rows[0];
      res.cookie("token", refreshToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.status(200).json({
        user: userWithToken.login,
        accessToken,
        role: userWithToken.roleId,
      });
    } catch (error) {
      next(error);
    }
  }

  async handleRefreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const cookies = req.cookies;

      if (!cookies?.token) return res.sendStatus(401);
      const refreshToken = cookies.token;

      const selectQuery = await dbQuery({
        text: `SELECT * FROM users WHERE refresh_token = $1`,
        values: [refreshToken],
      });
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
          res.json({
            user: foundUser.login,
            accessToken,
            role: foundUser.role_id,
          });
        }
      );
    } catch (error) {
      next(error);
    }
  }

  async logoutUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { token: refreshToken } = req.cookies;

      // If no refresh token, clear the cookie and return
      if (!refreshToken) {
        res.clearCookie("token", {
          httpOnly: true,
          sameSite: "none",
          secure: true,
        });
        return res.sendStatus(204);
      }

      // Check if refreshToken is in db
      const selectQuery = await dbQuery({
        text: `SELECT * FROM users WHERE refresh_token = $1`,
        values: [refreshToken],
      });
      const foundUser = selectQuery.rows[0];

      // If no user found, clear the cookie and return
      if (!foundUser) {
        res.clearCookie("token", {
          httpOnly: true,
          sameSite: "none",
          secure: true,
        });
        return res.sendStatus(204);
      }

      // Delete refresh_token in db
      await dbQuery({
        text: `UPDATE users SET refresh_token = '' WHERE refresh_token = $1`,
        values: [refreshToken],
      });

      // Clear the cookie and return
      res.clearCookie("token", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
