import { Request, Response } from "express";
import Business from "../models/businessModel";
import User from "../models/userModel";
import {
  businessSchema,
  changeBusinessPasswordSchema,
  updateBusinessSchema,
} from "../schemas/businessSchema";
import {
  comparePasswords,
  generateSalt,
  hashPassword,
} from "../utils/passwordHasher";
import generateId from "../utils/generateId";

export const getBusiness = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const business = await Business.findOne({ owner: userId }).select(
      "code name address"
    );

    if (!business) {
      res.status(400).json({
        error: {
          type: "system",
          message: "Unable to perform your request! Please try again.",
        },
      });
      return;
    }

    res.status(200).json({ ok: true, business: business });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createBusiness = async (req: Request, res: Response) => {
  try {
    const { success, data } = businessSchema.safeParse(req.body);

    if (!success) {
      res.status(400).json({
        error: {
          type: "system",
          message: "Unable to perform your request! Please try again.",
        },
      });
      return;
    }

    const business = await Business.findOne({ owner: req.userId });

    if (business) {
      res.status(400).json({
        error: {
          type: "system",
          message: "You already have a business!",
        },
      });
      return;
    }

    const salt = generateSalt();
    const hashedPassword = await hashPassword(data.password, salt);

    let code = generateId();
    let foundBusiness = await Business.findOne({ code: code });

    while (foundBusiness) {
      code = generateId();
      foundBusiness = await Business.findOne({ code: code });
    }

    const newBusiness = new Business({
      code: code,
      ...data,
      password: hashedPassword,
      salt: salt,
      owner: req.userId,
    });

    newBusiness.save();

    res.status(200).json({ ok: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateBusiness = async (req: Request, res: Response) => {
  try {
    const { success, data } = updateBusinessSchema.safeParse(req.body);

    if (!success) {
      res.status(400).json({
        error: {
          type: "system",
          message: "Unable to perform your request! Please try again.",
        },
      });
      return;
    }

    const business = await Business.findOneAndUpdate(
      { owner: req.userId },
      {
        name: data.name,
        address: data.address,
      },
      {
        new: true,
      }
    ).select("code name address");

    if (!business) {
      res.status(400).json({
        error: {
          type: "system",
          message: "Unable to perform your request! Please try again.",
        },
      });
      return;
    }

    res.status(200).json({ ok: true, business: business });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const changeBusinessPassword = async (req: Request, res: Response) => {
  try {
    const { success, data } = changeBusinessPasswordSchema.safeParse(req.body);

    if (!success) {
      res.status(400).json({
        error: {
          type: "system",
          message: "Unable to perform your request! Please try again.",
        },
      });
      return;
    }

    const user = await User.findOne({ _id: req.userId });

    if (!user) {
      res.status(400).json({
        error: {
          type: "system",
          message: "Unable to perform your request! Please try again.",
        },
      });
      return;
    }

    const business = await Business.findOne({ owner: user._id });

    if (!business) {
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
          message: "Account password is not correct.",
        },
      });
      return;
    }

    const salt = generateSalt();
    const hashedPassword = await hashPassword(data.newPassword, salt);

    business.password = hashedPassword;
    business.salt = salt;

    await business.save();

    res.status(200).json({
      ok: true,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
