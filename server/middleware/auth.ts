import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import prisma from "../lib/prisma.js";

export const authUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ success: false, message: "Нет токена" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;
    const userId = Number(decoded.id);
    req.user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true },
    });
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Пользователь не найден" });
    }
    next();
  } catch {
    res.status(401).json({ success: false, message: "Неверный токен" });
  }
};
