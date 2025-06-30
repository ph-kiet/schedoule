// src/index.ts
import express, { Application } from "express";
import dotenv from "dotenv";
import dbConnect from "./config/dbConnect";
import employeeRoutes from "./routes/employeeRoutes";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import cookieParser from "cookie-parser";
import rosterRoutes from "./routes/rosterRoutes";
import timesheetRoutes from "./routes/timesheetRoutes";
import qrRoutes from "./routes/qrRoutes";
import attendanceRoutes from "./routes/attendanceRoutes";
import profileRoutes from "./routes/profileRoute";
import businessRoutes from "./routes/businessRoutes";
// Load environment variables
dotenv.config();

const app: Application = express();
const port: number = parseInt(process.env.PORT || "3000", 10);

var corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
};

// Whitelist of allowed frontend origins
const allowedOrigins = [process.env.CLIENT_URL, process.env.CLIENT_QR_URL];

// Middleware to parse JSON bodies
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., mobile apps or curl)
      if (!origin) return callback(null, true);

      // Check if the request origin is in the whitelist
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Reject if origin is not allowed
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true, // Required for cookies/credentials
  })
);
app.use(express.json());
app.use(cookieParser());

// MongoDB connection
dbConnect();

//Api routes
const apiRouter = express.Router();
apiRouter.use("/auth", authRoutes);
apiRouter.use("/employee", employeeRoutes);
apiRouter.use("/roster", rosterRoutes);
apiRouter.use("/timesheet", timesheetRoutes);
apiRouter.use("/qr-code", qrRoutes);
apiRouter.use("/attendance", attendanceRoutes);
apiRouter.use("/profile", profileRoutes);
apiRouter.use("/business", businessRoutes);
app.use("/api", apiRouter);

console.log(process.env.REDIS_HOST);

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
