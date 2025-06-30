import express from "express";
import {
  employeeSignIn,
  logOut,
  me,
  qrSignIn,
  signIn,
  signUp,
} from "../controllers/authController";
import verifySession from "../middlewares/authMiddleware";
const authRoutes = express.Router();

authRoutes.post("/sign-up", signUp);
authRoutes.post("/sign-in", signIn);
authRoutes.get("/me", verifySession, me);
authRoutes.post("/logout", verifySession, logOut);
authRoutes.post("/employee/sign-in", employeeSignIn);
authRoutes.post("/qr/sign-in", qrSignIn);

export default authRoutes;
