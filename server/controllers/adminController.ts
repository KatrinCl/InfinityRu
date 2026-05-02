import jwt from 'jsonwebtoken';
import type { Request, Response } from 'express';
import prisma from '../lib/prisma.js';

const adminLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

      // кладём токен в cookie
      res.cookie('adminToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        maxAge: 1 * 60 * 60 * 1000, // 1 час
      });

      return res.json({ success: true, message: "Admin logged in" });
    } else {
      return res.json({ success: false, message: "Неверные данные" });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Admin login error";
    res.json({ success: false, message });
  }
};

const adminLogout = async (_req: Request, res: Response) => {
  try {
    res.clearCookie('adminToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    });
    return res.json({ success: true, message: 'Admin logged out' });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Admin logout error";
    return res.json({ success: false, message });
  }
};

const checkAdmin = (req: Request, res: Response) => {
  const token = req.cookies.adminToken;
  if (!token) return res.json({ success: false });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;
    if (decoded.role === 'admin') return res.json({ success: true });
    else return res.json({ success: false });
  } catch {
    return res.json({ success: false });
  }
};

const getAdminMetrics = async (_req: Request, res: Response) => {
  try {
    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)

    const [ordersToday, newUsers, productsInMenu] = await Promise.all([
      prisma.order.count({
        where: { createdAt: { gte: startOfToday } },
      }),
      prisma.user.count({
        where: { createdAt: { gte: startOfToday } },
      }),
      prisma.product.count(),
    ])

    return res.json({
      success: true,
      metrics: { ordersToday, newUsers, productsInMenu },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Admin metrics error'
    return res.status(500).json({ success: false, message })
  }
}

export {adminLogin, adminLogout, checkAdmin, getAdminMetrics}
