import { Request, Response } from "express";
import Business from "../models/businessModel";
import Roster from "../models/rosterModel";
import { rosterByDateSchema, rosterSchema } from "../schemas/roterSchema";

export const getRoster = async (req: Request, res: Response) => {
  const role = req.role;
  const userId = req.userId;

  const { success, data } = rosterByDateSchema.safeParse(req.query);
  if (!success) {
    res.status(400).json({
      error: {
        type: "system",
        message: "Unable to perform your request! Please try again.",
      },
    });
    return;
  }

  try {
    if (role === "employee") {
      const rosters = await Roster.find({
        employee: userId,
        startDate: { $gt: data.startDate },
        endDate: { $lt: data.endDate },
      }).populate("employee", {
        password: 0,
        salt: 0,
      });

      res.status(200).json({
        ok: true,
        rosters: rosters,
      });
      return;
    }

    const business = await Business.findOne({ owner: userId });
    if (!business) {
      res.status(400).json({
        error: {
          type: "setup",
          message: "Business set up required!",
        },
      });
      return;
    }

    const rosters = await Roster.find({
      business: business._id,
      startDate: { $gt: data.startDate },
      endDate: { $lt: data.endDate },
    }).populate("employee", {
      password: 0,
      salt: 0,
    });

    res.status(200).json({
      ok: true,
      rosters: rosters,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createRoster = async (req: Request, res: Response) => {
  const userId = req.userId;
  try {
    const { success, data } = rosterSchema.safeParse(req.body);

    if (!success) {
      res.status(400).json({
        error: {
          type: "system",
          message: "Unable to perform your request! Please try again.",
        },
      });
      return;
    }

    const business = await Business.findOne({ owner: userId }, { _id: true });
    if (!business) {
      res.status(400).json({
        error: {
          type: "system",
          message: "Unable to perform your request! Please try again.",
        },
      });
      return;
    }

    const newRoster = new Roster({
      employee: data.employeeId,
      business: business._id,
      startDate: data.startDate,
      endDate: data.endDate,
      breakTime: data.breakTime,
      description: data.description,
    });

    newRoster.save();

    const rosterWithEmployeePopulated = await newRoster.populate("employee", {
      password: 0,
      salt: 0,
    });

    res.status(200).json({
      ok: true,
      roster: rosterWithEmployeePopulated,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateRoster = async (req: Request, res: Response) => {
  const rosterId = req.params.rosterId;
  try {
    const { success, data } = rosterSchema.safeParse(req.body);

    if (!success) {
      res.status(400).json({
        error: {
          type: "system",
          message: "Unable to perform your request! Please try again.",
        },
      });
      return;
    }

    const updatedRoster = await Roster.findOneAndUpdate(
      { _id: rosterId },
      {
        employee: data.employeeId,
        startDate: data.startDate,
        endDate: data.endDate,
        breakTime: data.breakTime,
        description: data.description,
      }
    );

    if (!updatedRoster) {
      res.status(400).json({
        error: {
          type: "system",
          message: "Unable to perform your request! Please try again.",
        },
      });
      return;
    }

    const rosterWithEmployeePopulated = await updatedRoster.populate(
      "employee",
      {
        password: 0,
        salt: 0,
      }
    );

    res.status(200).json({
      ok: true,
      roster: rosterWithEmployeePopulated,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteRoster = async (req: Request, res: Response) => {
  const rosterId = req.params.rosterId;
  try {
    const deletedRoster = await Roster.findOneAndDelete({ _id: rosterId });

    if (!deletedRoster) {
      res.status(400).json({
        error: {
          type: "system",
          message: "Unable to perform your request! Please try again.",
        },
      });
      return;
    }

    res.status(200).json({
      ok: true,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getUpcomingShifts = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const rosters = await Roster.find({
      employee: userId,
      startDate: { $gt: new Date().setHours(0, 0, 0, 0) },
    }).limit(7);

    res.status(200).json({
      ok: true,
      rosters: rosters,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
