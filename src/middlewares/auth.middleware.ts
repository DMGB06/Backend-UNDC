import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface TokenPayload {
  id: number;
  role: string;
  iat: number;
  exp: number;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const header = req.headers.authorization;
    if (!header) {
      res.status(401).json({ error: "No token provided" });
      return;
    }
    const token = header.split(" ")[1];
    if (!token) {
      res.status(401).json({ error: "No token provided" });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
    (req as any).user = decoded;

    const newToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      process.env.JWT_SECRET!,
      { expiresIn: "5m" }
    );

    res.setHeader("Authorization", `Bearer ${newToken}`);

    next();
  } catch (error) {
    res.status(401).json({ error: "Token inválido o expirado" });
    return;
  }
};
