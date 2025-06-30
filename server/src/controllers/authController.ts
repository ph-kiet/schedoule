import { Request, Response } from "express";
import {
  employeeSignInSchema,
  qrSignInSchema,
  signInSchema,
  signUpSchema,
} from "../schemas/authSchema";
import User from "../models/userModel";
import Employee from "../models/employeeModel";
import {
  comparePasswords,
  generateSalt,
  hashPassword,
} from "../utils/passwordHasher";
import crypto from "crypto";
import { redisDelete, redisSet } from "../config/redis-client";
import Business from "../models/businessModel";

const SESSION_EXPIRATION_SECONDS = 3600; // 1 hous
const QR_SESSION_EXPIRATION_SECONDS = 60 * 60 * 24 * 90; // 3 months

export const signUp = async (req: Request, res: Response) => {
  const { success, data } = signUpSchema.safeParse(req.body);
  if (!success) {
    res.status(400).json({
      error: {
        type: "system",
        message: "Unable to sign up! Please try again.",
      },
    });
    return;
  }
  if (data.password !== data.confirmPassword) {
    res.status(400).json({
      error: {
        type: "confirmPassword",
        message: "Confirm password doesn't match",
      },
    });
    return;
  }

  try {
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      res.status(400).json({
        error: {
          type: "email",
          message: "This email is taken!",
        },
      });
      return;
    }

    const salt = generateSalt();
    const hashedPassword = await hashPassword(data.password, salt);
    const newUser = new User({
      firstName: data.firstname,
      lastName: data.lastname,
      email: data.email,
      password: hashedPassword,
      salt: salt,
    });
    newUser.save();
    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(400).json({
      error: {
        type: "system",
        message: "Unable to sign up! Please try again.",
      },
    });
  }
};

export const signIn = async (req: Request, res: Response) => {
  const { success, data } = signInSchema.safeParse(req.body);
  if (!success) {
    res.status(400).json({
      error: {
        type: "system",
        message: "Unable to sign in! Please try again.",
      },
    });
    return;
  }

  try {
    const user = await User.findOne({
      email: data.email,
    });

    if (user === null) {
      res.status(400).json({
        error: {
          type: "root",
          message: "Incorrect sign in credentials!",
        },
      });
      return;
    }

    const isCorrectPassword = await comparePasswords({
      hashedPassword: user.password,
      password: data.password,
      salt: user.salt,
    });

    if (!isCorrectPassword) {
      res.status(400).json({
        error: {
          type: "root",
          message: "Incorrect sign in credentials!",
        },
      });
      return;
    }

    const sessionId = crypto.randomBytes(512).toString("hex").normalize();
    const sessionValue = JSON.stringify({
      id: user._id.toString(),
      role: "user",
    });

    await redisSet(
      `session:${sessionId}`,
      sessionValue,
      SESSION_EXPIRATION_SECONDS
    );

    res.status(200).json({
      ok: true,
      sessionId: sessionId,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        avatarUrl: user.avatarUrl,
        role: "user",
      },
    });
  } catch (error: any) {
    console.log(error.message);
    res.status(400).json({
      error: {
        type: "system",
        message: "Unable to sign in! Please try again.",
      },
    });
    return;
  }
};

export const me = async (req: Request, res: Response) => {
  try {
    let user;

    if (req.role === "user") {
      user = await User.findOne(
        { _id: req.userId },
        {
          _id: true,
          firstName: true,
          lastName: true,
          email: true,
          avatarUrl: true,
        }
      );
    }

    if (req.role === "employee") {
      user = await Employee.findOne(
        { _id: req.userId },
        {
          _id: true,
          firstName: true,
          lastName: true,
          email: true,
          avatarUrl: true,
        }
      );
    }

    if (req.role === "business") {
      const business = await Business.findOne(
        { _id: req.userId },
        {
          password: 0,
          salt: 0,
        }
      );

      if (!business) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      res.status(200).json({
        ok: true,
        business: {
          code: business.code,
          name: business.name,
        },
      });
      return;
    }

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({
      ok: true,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        avatarUrl: user.avatarUrl,
        role: req.role,
      },
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const logOut = async (req: Request, res: Response) => {
  try {
    await redisDelete(`session:${req.cookies.sessionId}`);
    res.clearCookie("sessionId");
    res.status(200).json({ ok: true });
    return;
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const employeeSignIn = async (req: Request, res: Response) => {
  try {
    const { success, data } = employeeSignInSchema.safeParse(req.body);

    if (!success) {
      res.status(400).json({
        error: {
          type: "system",
          message: "Unable to sign in! Please try again..",
        },
      });
      return;
    }

    const business = await Business.findOne(
      { code: data.businessCode },
      { _id: true }
    );

    if (!business) {
      res.status(400).json({
        error: {
          type: "root",
          message: "Incorrect sign in credentials!",
        },
      });
      return;
    }

    const employee = await Employee.findOne({
      employeeId: data.employeeId,
      business: business._id,
    });

    if (employee === null) {
      res.status(400).json({
        error: {
          type: "root",
          message: "Incorrect sign in credentials!",
        },
      });
      return;
    }

    const isCorrectPassword = await comparePasswords({
      hashedPassword: employee.password,
      password: data.password,
      salt: employee.salt,
    });

    if (!isCorrectPassword) {
      res.status(400).json({
        error: {
          type: "root",
          message: "Incorrect sign in credentials!",
        },
      });
      return;
    }

    const sessionId = crypto.randomBytes(512).toString("hex").normalize();
    const sessionValue = JSON.stringify({
      id: employee._id.toString(),
      role: "employee",
    });

    await redisSet(
      `session:${sessionId}`,
      sessionValue,
      SESSION_EXPIRATION_SECONDS
    );

    res.status(200).json({
      ok: true,
      sessionId: sessionId,
      employee: {
        _id: employee._id,
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        avatarUrl: employee.avatarUrl,
        role: "employee",
      },
    });

    return;
  } catch (error: any) {
    console.log(error.message);
    res.status(400).json({
      error: {
        type: "system",
        message: "Unable to sign in! Please try again.",
      },
    });
  }
};

export const qrSignIn = async (req: Request, res: Response) => {
  const { success, data } = qrSignInSchema.safeParse(req.body);
  if (!success) {
    res.status(400).json({
      error: {
        type: "system",
        message: "Unable to sign in! Please try again.",
      },
    });
    return;
  }

  try {
    const business = await Business.findOne({
      code: data.businessCode,
    });

    if (!business) {
      res.status(400).json({
        error: {
          type: "root",
          message: "Incorrect sign in credentials!",
        },
      });
      return;
    }

    const isCorrectPassword = await comparePasswords({
      hashedPassword: business.password,
      password: data.password,
      salt: business.salt,
    });

    if (!isCorrectPassword) {
      res.status(400).json({
        error: {
          type: "root",
          message: "Incorrect sign in credentials!",
        },
      });
      return;
    }

    const sessionId = crypto.randomBytes(512).toString("hex").normalize();
    const sessionValue = JSON.stringify({
      id: business._id.toString(),
      role: "business",
    });

    await redisSet(
      `session:${sessionId}`,
      sessionValue,
      QR_SESSION_EXPIRATION_SECONDS
    );

    res.status(200).json({
      ok: true,
      sessionId: sessionId,
      business: {
        code: business.code,
        name: business.name,
        business: business.address,
      },
    });
  } catch (error: any) {
    console.log(error.message);
    res.status(400).json({
      error: {
        type: "system",
        message: "Unable to sign in! Please try again...",
      },
    });
    return;
  }
};
