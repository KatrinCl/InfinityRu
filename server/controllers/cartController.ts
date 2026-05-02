import type { Request, Response } from "express";
import prisma from "../lib/prisma.js";

type Cart = Record<string, number>;

export const addToCart = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });

    const cart = ((user?.cartData as Cart) || {});
    const key = String(itemId);
    cart[key] = (cart[key] || 0) + 1;

    await prisma.user.update({
      where: { id: req.user!.id },
      data: { cartData: cart },
    });

    res.json({ success: true, message: "Добавлено в корзину" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Add to cart error";
    res.status(500).json({ success: false, message });
  }
};

export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });

    const cart = ((user?.cartData as Cart) || {});
    const key = String(itemId);
    if ((cart[key] || 0) > 1) {
      cart[key] -= 1;
    } else {
      delete cart[key];
    }

    await prisma.user.update({
      where: { id: req.user!.id },
      data: { cartData: cart },
    });

    res.json({ success: true, message: "Товар удален из корзины" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Remove from cart error";
    res.status(500).json({ success: false, message });
  }
};

export const updateCart = async (req: Request, res: Response) => {
  try {
    const { itemId, quantity } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });

    const cart = ((user?.cartData as Cart) || {});
    cart[String(itemId)] = Number(quantity);

    await prisma.user.update({
      where: { id: req.user!.id },
      data: { cartData: cart },
    });

    res.json({ success: true, message: "Корзина обновлена" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Update cart error";
    res.status(500).json({ success: false, message });
  }
};

export const getUserCart = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    res.json({ success: true, cartData: (user?.cartData as Cart) || {} });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Get cart error";
    res.status(500).json({ success: false, message });
  }
};
