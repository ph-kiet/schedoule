import { Request, Response } from "express";
import Employee from "../models/employeeModel";
import Business from "../models/businessModel";
import generateId from "../utils/generateId";
import { employeeSchema } from "../schemas/employeeSchema";
import { generateSalt, hashPassword } from "../utils/passwordHasher";

// Get all employee by user id
export const getAllEmployees = async (req: Request, res: Response) => {
  try {
    const listOfEmployess = await Employee.find(
      { userId: req.userId },
      { password: 0 }
    );

    res.status(200).json(listOfEmployess);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Create new employee
export const createEmployee = async (req: Request, res: Response) => {
  try {
    const { success, data } = employeeSchema.safeParse(req.body);

    if (!success) {
      res.status(400).json({
        error: {
          type: "system",
          message: "Unable to perform your request! Please try again.",
        },
      });
      return;
    }

    const business = await Business.findOne(
      { owner: req.userId },
      { _id: true }
    );

    if (!business) {
      res.status(400).json({
        error: {
          type: "setup",
          message: "Business set up required!",
        },
      });
      return;
    }

    let id = generateId();
    let employee = await Employee.findOne({ employeeId: id });

    while (employee) {
      id = generateId();
      employee = await Employee.findOne({ employeeId: id });
    }

    const salt = generateSalt();
    const hashedPassword = await hashPassword("password", salt);

    const newEmployee = new Employee({
      employeeId: id,
      firstName: data.firstName,
      lastName: data.lastName,
      fullName: data.firstName + " " + data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      position: data.position,
      password: hashedPassword,
      salt: salt,
      userId: req.userId,
      business: business._id,
    });

    newEmployee.save();

    const { password, salt: _, ...safeEmployee } = newEmployee.toObject();
    res.status(200).json({ ok: true, employee: safeEmployee });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Update employee
export const updateEmployee = async (req: Request, res: Response) => {
  try {
    const employeeId = req.params.employeeId;
    const { success, data } = employeeSchema.safeParse(req.body);

    if (!success) {
      res.status(400).json({
        error: {
          type: "system",
          message: "Unable to perform your request! Please try again.",
        },
      });
      return;
    }

    const employee = await Employee.findOneAndUpdate(
      {
        _id: employeeId,
        userId: req.userId,
      },
      {
        firstName: data.firstName,
        lastName: data.lastName,
        fullName: data.firstName + " " + data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        position: data.position,
      },
      {
        new: true,
      }
    );

    if (!employee) {
      res.status(400).json({
        error: {
          type: "system",
          message: "Unable to perform your request! Please try again.",
        },
      });
      return;
    }

    const { password, salt: _, ...safeEmployee } = employee.toObject();

    res.status(200).json({
      ok: true,
      employee: safeEmployee,
    });
    return;
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
  return;
};

// Delete employee
export const deleteEmployee = async (req: Request, res: Response) => {
  try {
    const employeeId = req.params.employeeId;

    const employee = await Employee.findOneAndDelete({
      _id: employeeId,
      userId: req.userId,
    });

    if (!employee) {
      res.status(400).json({
        error: {
          type: "system",
          message: "Unable to perform your request! Please try again.",
        },
      });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
