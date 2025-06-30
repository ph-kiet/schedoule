import express from "express";
import verifySession from "../middlewares/authMiddleware";
import authoriseRoles from "../middlewares/roleMiddleware";
import {
  changeBusinessPassword,
  createBusiness,
  getBusiness,
  updateBusiness,
} from "../controllers/businessController";

const businessRoutes = express.Router();

businessRoutes.get("/", verifySession, authoriseRoles("user"), getBusiness);
businessRoutes.post("/", verifySession, authoriseRoles("user"), createBusiness);
businessRoutes.patch(
  "/",
  verifySession,
  authoriseRoles("user"),
  updateBusiness
);
businessRoutes.patch(
  "/password",
  verifySession,
  authoriseRoles("user"),
  changeBusinessPassword
);

export default businessRoutes;
