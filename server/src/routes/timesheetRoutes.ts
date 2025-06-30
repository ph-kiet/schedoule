import express from "express";
import verifySession from "../middlewares/authMiddleware";
import authoriseRoles from "../middlewares/roleMiddleware";
import {
  getTimesheetForEmployee,
  getTimesheetForBusiness,
} from "../controllers/timesheetController";

const timesheetRoutes = express.Router();

// Get all timesheet
timesheetRoutes.get(
  "/",
  verifySession,
  authoriseRoles("employee"),
  getTimesheetForEmployee
);

timesheetRoutes.get(
  "/business",
  verifySession,
  authoriseRoles("user"),
  getTimesheetForBusiness
);

export default timesheetRoutes;
