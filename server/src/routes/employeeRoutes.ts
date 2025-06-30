import express from "express";
import {
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employeeController";
import verifySession from "../middlewares/authMiddleware";
import authoriseRoles from "../middlewares/roleMiddleware";
const employeeRoutes = express.Router();

// Get all employees by userId
employeeRoutes.get("/", verifySession, authoriseRoles("user"), getAllEmployees);

// Create a new employee
employeeRoutes.post("/", verifySession, authoriseRoles("user"), createEmployee);

// Update employee details
employeeRoutes.patch(
  "/:employeeId",
  verifySession,
  authoriseRoles("user"),
  updateEmployee
);

// Delete an employee
employeeRoutes.delete(
  "/:employeeId",
  verifySession,
  authoriseRoles("user"),
  deleteEmployee
);

export default employeeRoutes;
