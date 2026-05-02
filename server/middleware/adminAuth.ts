import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";

const authAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.adminToken;
    if (!token) {
      return res.status(401).json({ success: false, message: "Нет доступа (нет токена)" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;
    if (decoded.role !== "admin") {
      return res.status(403).json({ success: false, message: "Доступ запрещён" });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Неверный или просроченный токен" });
  }
};

export default authAdmin;
