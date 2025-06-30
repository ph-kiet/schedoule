import express from "express";
import verifySession from "../middlewares/authMiddleware";
import authoriseRoles from "../middlewares/roleMiddleware";
import {
  createRoster,
  deleteRoster,
  getRoster,
  getUpcomingShifts,
  updateRoster,
} from "../controllers/rosterController";
const rosterRoutes = express.Router();

// Get all roster for user or employee
rosterRoutes.get(
  "/",
  verifySession,
  authoriseRoles("user", "employee"),
  getRoster
);

// Create a new roster
rosterRoutes.post("/", verifySession, authoriseRoles("user"), createRoster);

// Update roster details
rosterRoutes.patch(
  "/:rosterId",
  verifySession,
  authoriseRoles("user"),
  updateRoster
);

// Delete a roster
rosterRoutes.delete(
  "/:rosterId",
  verifySession,
  authoriseRoles("user"),
  deleteRoster
);

// Get 7 upcoming rosters
rosterRoutes.get(
  "/upcoming",
  verifySession,
  authoriseRoles("employee"),
  getUpcomingShifts
);

export default rosterRoutes;
