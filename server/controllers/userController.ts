import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import type { Request, Response } from "express";
import prisma from "../lib/prisma.js";

const createToken = (id: number) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: "7d" });
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.json({ success: false, message: "Пользователь не найден" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ success: false, message: "Неверный пароль" });

    const token = createToken(user.id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true, user: { email: user.email, name: user.name } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login error";
    res.json({ success: false, message });
  }
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.json({ success: false, message: "Пользователь уже существует" });

    if (!validator.isEmail(email)) return res.json({ success: false, message: "Введите верный Email" });
    if (password.length < 8) return res.json({ success: false, message: "Пароль минимум 8 символов" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, cartData: {} },
    });

    const token = createToken(user.id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true, user: { email: user.email, name: user.name } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Register error";
    res.json({ success: false, message });
  }
};

export const isAuth = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user.id) return res.status(401).json({ success: false, message: "Не авторизован" });

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true },
    });

    if (!user) return res.status(404).json({ success: false, message: "Пользователь не найден" });

    return res.json({ success: true, user });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Auth check error";
    res.json({ success: false, message });
  }
};

export const logout = async (_req: Request, res: Response) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.json({ success: true, message: "Вы вышли из аккаунта" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Logout error";
    res.json({ success: false, message });
  }
};
