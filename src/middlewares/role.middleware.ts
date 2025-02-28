import { Request, Response, NextFunction } from "express";

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  if (!user || user.role !== "ADMIN") {
    res.status(403).json({ error: "No tienes permisos de ADMIN" });
    return;
  }
  next();
};
