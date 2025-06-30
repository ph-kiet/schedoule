import express from "express";
import verifySession from "../middlewares/authMiddleware";
import authoriseRoles from "../middlewares/roleMiddleware";
import { getQRCode } from "../controllers/qrController";

const qrRoutes = express.Router();

qrRoutes.get("/", verifySession, authoriseRoles("business"), getQRCode);

export default qrRoutes;
