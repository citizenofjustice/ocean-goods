import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

import { dbQuery } from "../db";

class AuthController {
  // method to authenticate user
  async authUser(req: Request, res: Response, next: NextFunction) {
    try {
      // Extract email and password from request body
      const { email, password } = req.body;

      // Check if email and password are provided
      if (!email || !password)
        return res.status(400).json({
          error: {
            message: "Одно из полей формы авторизации осталось пустым",
          },
        });

      // Query to select user from database
      const selectQuery = await dbQuery({
        text: `SELECT * FROM users WHERE login = $1`,
        values: [email],
      });

      // Check if user exists
      const foundUser = selectQuery.rows[0];
      if (!foundUser)
        return res.status(400).json({
          error: { message: "Введена неверная эл. почта" },
        });

      // Check if password is valid
      const passwordHash = foundUser.password_hash;
      const isValid = await bcrypt.compare(password, passwordHash);
      if (!isValid)
        return res.status(400).json({
          error: { message: "Введен неверный пароль" },
        });

      // Create JWTs
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

      // Remove password hash from user object
      delete foundUser.password_hash;
      // Update the user's refresh token in the database
      const updateQuery = await dbQuery({
        text: `UPDATE users SET refresh_token = $1 WHERE id = $2 RETURNING login, role_id as "roleId"`,
        values: [refreshToken, foundUser.id],
      });

      // Send the response with the access token, refresh token, and user info
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
      // Pass the error to the errorHandler middleware
      next(error);
    }
  }

  // method to handle refresh token
  async handleRefreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      // Extract the refresh token from the cookies
      const cookies = req.cookies;
      // If no refresh token, return 401 status
      if (!cookies?.token)
        return res.status(401).json({
          error: { message: "Доступ запрещен. Отсутствует токен авторизации" },
        });
      const refreshToken = cookies.token;

      // Query the database for the user with the provided refresh token
      const selectQuery = await dbQuery({
        text: `SELECT * FROM users WHERE refresh_token = $1`,
        values: [refreshToken],
      });
      // Check if user exists
      const foundUser = selectQuery.rows[0];
      if (!foundUser)
        return res.status(403).json({
          error: {
            message: "Возникла проблема при обновлении токена авторизации",
          },
        });

      // Verify the refresh token
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (error: any, decoded: any) => {
          // If token is invalid or user ID does not match, return 403 status
          if (!decoded)
            return res.status(403).json({
              error: { message: "Доступ запрещен" },
            });
          if (error || foundUser.id !== decoded.userInfo.user)
            return res.status(403).json({
              error: { message: "Доступ запрещен" },
            });

          // Create a new access token
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

          // Send the response with the access token and user info
          res.json({
            user: foundUser.login,
            accessToken,
            role: foundUser.role_id,
          });
        }
      );
    } catch (error) {
      // Pass the error to the errorHandler middleware
      next(error);
    }
  }

  // method to log out a user
  async logoutUser(req: Request, res: Response, next: NextFunction) {
    try {
      // Extract the refresh token from the cookies
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

      // Query the database for the user with the provided refresh token
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

      // Delete refresh token in the database
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
      // Pass the error to the errorHandler middleware
      next(error);
    }
  }
}

export default new AuthController();
