import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

import { prisma } from "../db";

interface DecodedToken {
  userInfo: {
    user: string;
    priveleges: number[];
  };
}

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
      const foundUser = await prisma.users.findUnique({
        where: {
          login: email,
        },
        include: {
          roles: {
            include: {
              rolePriveleges: {
                select: {
                  privelegeId: true,
                },
              },
            },
          },
        },
      });

      // Check if user exists
      if (!foundUser)
        return res.status(400).json({
          error: { message: "Введена неверная эл. почта" },
        });

      const isValid = await bcrypt.compare(password, foundUser.passwordHash);
      if (!isValid)
        return res.status(400).json({
          error: { message: "Введен неверный пароль" },
        });

      const privelegeIds = foundUser.roles.rolePriveleges.map(
        (rp) => rp.privelegeId
      );

      // Create JWTs
      const accessToken = jwt.sign(
        {
          userInfo: {
            user: foundUser.id,
            priveleges: privelegeIds,
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
            priveleges: privelegeIds,
          },
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: "1d",
        }
      );

      // Update the user's refresh token in the database
      const userWithToken = await prisma.users.update({
        where: {
          id: foundUser.id,
        },
        data: {
          refreshToken: refreshToken,
        },
      });

      if (!userWithToken)
        return res.status(400).json({
          error: { message: "Проблема с сохранением токена авторизации" },
        });

      // Send the response with the access token, refresh token, and user info
      res.cookie("token", refreshToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.status(200).json({
        user: foundUser.login,
        accessToken,
        priveleges: privelegeIds,
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
      const refreshToken = req.cookies?.token;
      // If no refresh token, return 401 status
      if (!refreshToken) {
        return res.sendStatus(401); // Unauthorized
      }

      // Create a promise to verify the token
      const verifyTokenPromise = new Promise<DecodedToken>(
        (resolve, reject) => {
          // Verify the token using jwt.verify
          jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (error: any, decoded: any) => {
              // If there's an error, reject the promise
              if (error) {
                reject(error);
              } else {
                // If no error, resolve the promise with the decoded token
                resolve(decoded as DecodedToken);
              }
            }
          );
        }
      );

      // Create a promise to find the user in the database
      const findUserPromise = prisma.users.findFirst({
        where: {
          refreshToken: refreshToken,
        },
        include: {
          roles: {
            include: {
              rolePriveleges: {
                select: {
                  privelegeId: true,
                },
              },
            },
          },
        },
      });

      // Wait for both promises to complete
      const [decoded, foundUser] = await Promise.all([
        verifyTokenPromise,
        findUserPromise,
      ]);

      // If no user is found or the user id doesn't match the one in the token, return 403 status
      if (!foundUser || foundUser.id !== Number(decoded.userInfo.user)) {
        return res.sendStatus(403); // Forbidden
      }

      // Extract the privilege ids from the user's roles
      const privelegeIds = foundUser.roles.rolePriveleges.map(
        (rp) => rp.privelegeId
      );

      // Create a new access token with the user info and privilege ids
      const accessToken = jwt.sign(
        {
          userInfo: {
            user: decoded.userInfo.user,
            priveleges: privelegeIds,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "10m",
        }
      );

      // Send the response with the user login, access token, and privilege ids
      res.json({
        user: foundUser.login,
        accessToken,
        priveleges: privelegeIds,
      });
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
      const foundUser = await prisma.users.findFirst({
        where: {
          refreshToken: refreshToken,
        },
      });

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
      await prisma.users.updateMany({
        where: {
          refreshToken: refreshToken,
        },
        data: {
          refreshToken: "",
        },
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
