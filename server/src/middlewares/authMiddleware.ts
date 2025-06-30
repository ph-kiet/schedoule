import { Request, Response, NextFunction } from "express";
import { redisGet } from "../config/redis-client";

interface AuthRequest extends Request {
  userId: string;
}

const verifySession = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check for sessionId in cookies
    const sessionId = req.cookies.sessionId;
    if (!sessionId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    // Verify session ID in Redis
    const value = await redisGet(`session:${sessionId}`);
    if (!value) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { id, role } = JSON.parse(value); // TODO: check role

    req.userId = id;
    req.role = role;

    next();
  } catch (error) {
    console.error("Session validation error:", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

declare module "express-serve-static-core" {
  interface Request {
    userId: string;
    role: string;
  }
}

export default verifySession;
