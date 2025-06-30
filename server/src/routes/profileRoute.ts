import express from "express";
import verifySession from "../middlewares/authMiddleware";
import authoriseRoles from "../middlewares/roleMiddleware";
import {
  changePassword,
  updateProfile,
} from "../controllers/profileController";
const profileRoutes = express.Router();

// Update profile details
profileRoutes.post("/", verifySession, authoriseRoles("user"), updateProfile);

// Change password
profileRoutes.post(
  "/password",
  verifySession,
  authoriseRoles("user", "employee"),
  changePassword
);

export default profileRoutes;
