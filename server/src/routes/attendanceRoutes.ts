import express from "express";
import verifySession from "../middlewares/authMiddleware";
import authoriseRoles from "../middlewares/roleMiddleware";
import {
  checkIn,
  checkOut,
  getAttendanceLogs,
} from "../controllers/attendanceController";

const attendanceRoutes = express.Router();

attendanceRoutes.post(
  "/check-in",
  verifySession,
  authoriseRoles("employee"),
  checkIn
);

attendanceRoutes.post(
  "/check-out",
  verifySession,
  authoriseRoles("employee"),
  checkOut
);

attendanceRoutes.get(
  "/logs",
  verifySession,
  authoriseRoles("user"),
  getAttendanceLogs
);

export default attendanceRoutes;
