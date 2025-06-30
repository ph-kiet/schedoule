import { ok } from "assert";
import { passwordSchema, profileSchema } from "../schemas/profileSchema";
import { Request, Response } from "express";
import User from "../models/userModel";
import Employee from "../models/employeeModel";
import {
  comparePasswords,
  generateSalt,
  hashPassword,
} from "../utils/passwordHasher";

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { success, data } = profileSchema.safeParse(req.body);

    if (!success) {
      res.status(400).json({
        error: {
          type: "system",
          message: "Unable to perform your request! Please try again.",
        },
      });
      return;
    }

    const updatedUser = await User.findOneAndUpdate(
      {
        _id: userId,
      },
      {
        firstName: data.firstName,
        lastName: data.lastName,
      },
      {
        new: true,
      }
    );

    if (!updatedUser) {
      res.status(400).json({
        error: {
          type: "system",
          message: "Unable to perform your request! Please try again.",
        },
      });
      return;
    }

    // const { password, salt: _, ...safeUser } = updatedUser.toObject();

    res.status(200).json({
      ok: true,
      //   user: safeUser,
    });
    return;
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { success, data } = passwordSchema.safeParse(req.body);

    if (!success) {
      res.status(400).json({
        error: {
          type: "system",
          message: "Unable to perform your request! Please try again.",
        },
      });
      return;
    }

    const userId = req.userId;
    const role = req.role;

    // For user
    if (role === "user") {
      const user = await User.findOne({
        _id: userId,
      });

      if (!user) {
        res.status(400).json({
          error: {
            type: "system",
            message: "Unable to perform your request! Please try again.",
          },
        });
        return;
      }

      const isCorrectPassword = await comparePasswords({
        hashedPassword: user.password,
        password: data.currentPassword,
        salt: user.salt,
      });

      if (!isCorrectPassword) {
        res.status(400).json({
          error: {
            type: "currentPassword",
            message: "Current password is not correct!",
          },
        });
        return;
      }

      const salt = generateSalt();
      const hashedPassword = await hashPassword(data.newPassword, salt);

      user.password = hashedPassword;
      user.salt = salt;

      await user.save();
    }

    // For employee
    if (role === "employee") {
      const user = await Employee.findOne({
        _id: userId,
      });

      if (!user) {
        res.status(400).json({
          error: {
            type: "system",
            message: "Unable to perform your request! Please try again.",
          },
        });
        return;
      }

      const isCorrectPassword = await comparePasswords({
        hashedPassword: user.password,
        password: data.currentPassword,
        salt: user.salt,
      });

      if (!isCorrectPassword) {
        res.status(400).json({
          error: {
            type: "currentPassword",
            message: "Current password is not correct!",
          },
        });
        return;
      }

      const salt = generateSalt();
      const hashedPassword = await hashPassword(data.newPassword, salt);

      user.password = hashedPassword;
      user.salt = salt;

      await user.save();
    }

    res.status(200).json({
      ok: true,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
