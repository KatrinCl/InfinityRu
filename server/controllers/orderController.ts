import type { Request, Response } from "express";
import prisma from "../lib/prisma.js";
import { stripe, isStripeConfigured } from "../lib/stripe.js";
import sendEmail from "../lib/nodemailer.js";

export const placeOrder = async (req: Request, res: Response) => {
  try {
    const { items, amount, address, paymentMethod } = req.body;

    const order = await prisma.order.create({
      data: {
        userId: req.user!.id,
        items,
        address,
        amount,
        paymentMethod,
      },
    });

    await prisma.user.update({
      where: { id: req.user!.id },
      data: { cartData: {} },
    });

    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { email: true, name: true },
    });

    if (user && user.email) {
      const orderItemsHtml = (items as any[]).map((item: any) => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name || 'Товар'}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.quantity || 1}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.price || 0} ₽</td>
        </tr>
      `).join('');

      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Подтверждение заказа</title>
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px;">
            <h1 style="color: #333;">Спасибо за заказ!</h1>
            <p>Здравствуйте, ${user.name || 'клиент'}!</p>
            <p>Ваш заказ #${order.id} успешно оформлен.</p>
            
            <h3 style="margin-top: 20px;">Детали заказа:</h3>
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
              <tr style="background: #f8f8f8;">
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Товар</th>
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Кол-во</th>
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Цена</th>
              </tr>
              ${orderItemsHtml}
            </table>
            
            <p style="margin-top: 20px; font-size: 18px; font-weight: bold;">
              Итого: ${amount} ₽
            </p>
            
            <p style="margin-top: 20px; color: #666;">
              Статус заказа: <strong>${order.status}</strong>
            </p>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px;">
              Если у вас возникли вопросы, свяжитесь с нами.
            </p>
          </div>
        </body>
        </html>
      `;

      await sendEmail({
        to: user.email,
        subject: `Подтверждение заказа #${order.id}`,
        body: html,
      });
    }

    res.json({ success: true, message: "Заказ оформлен", orderId: order.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Place order error";
    res.status(500).json({ success: false, message });
  }
};

export const placeOrderUkassa = async (_req: Request, res: Response) => {
  res.status(501).json({ success: false, message: "ЮKassa пока не настроена на сервере" });
};

// Создание PaymentIntent для Stripe
export const createPaymentIntent = async (req: Request, res: Response) => {
  try {
    if (!isStripeConfigured || !stripe) {
      return res.status(501).json({ success: false, message: 'Stripe не настроен' });
    }

    const { amount, orderId } = req.body;

    if (!amount || !orderId) {
      return res.status(400).json({ success: false, message: 'Укажите amount и orderId' });
    }

    // Создаём Checkout Session для перенаправления на страницу Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Заказ #${orderId}`,
            },
            unit_amount: Math.round(Number(amount) * 100), // Stripe использует центы
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      metadata: {
        orderId: String(orderId),
      },
      success_url: `${process.env.FRONTEND_URL || 'https://infinitytsru.vercel.app'}/orders?payment=success`,
      cancel_url: `${process.env.FRONTEND_URL || 'https://infinitytsru.vercel.app'}/cart`,
    });

    res.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Create payment intent error';
    res.status(500).json({ success: false, message });
  }
};

// Вебхук для обработки событий Stripe
export const stripeWebhook = async (req: Request, res: Response) => {
  if (!isStripeConfigured || !stripe) {
    return res.status(501).json({ success: false, message: "Stripe не настроен" });
  }

  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    if (sig && webhookSecret) {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } else {
      event = req.body;
    }
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Обработка событий
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata.orderId;

      await prisma.order.update({
        where: { id: Number(orderId) },
        data: { status: 'completed' },
      });

      // Отправка письма об успешной оплате
      const order = await prisma.order.findUnique({
        where: { id: Number(orderId) },
        include: { user: true },
      });

      if (order && order.user.email) {
        const orderItemsHtml = (order.items as any[]).map((item: any) => `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name || 'Товар'}</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.quantity || 1}</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.price || 0} ₽</td>
          </tr>
        `).join('');

        const html = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>Оплата прошла успешно</title>
          </head>
          <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px;">
              <h1 style="color: #28a745;">Оплата прошла успешно!</h1>
              <p>Здравствуйте, ${order.user.name || 'клиент'}!</p>
              <p>Ваш заказ #${order.id} оплачен.</p>
              
              <h3 style="margin-top: 20px;">Детали заказа:</h3>
              <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="background: #f8f8f8;">
                  <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Товар</th>
                  <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Кол-во</th>
                  <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Цена</th>
                </tr>
                ${orderItemsHtml}
              </table>
              
              <p style="margin-top: 20px; font-size: 18px; font-weight: bold;">
                Оплачено: ${order.amount} ₽
              </p>
              
              <p style="margin-top: 20px; color: #666;">
                Статус заказа: <strong style="color: #28a745;">${order.status}</strong>
              </p>
              
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 12px;">
                Спасибо за покупку! Мы свяжемся с вами при необходимости.
              </p>
            </div>
          </body>
          </html>
        `;

        await sendEmail({
          to: order.user.email,
          subject: `Оплата заказа #${order.id} прошла успешно`,
          body: html,
        });
      }

      console.log(`PaymentIntent ${paymentIntent.id} succeeded`);
      break;

    case 'payment_intent.payment_failed':
      const failedPaymentIntent = event.data.object;
      const failedOrderId = failedPaymentIntent.metadata.orderId;

      await prisma.order.update({
        where: { id: Number(failedOrderId) },
        data: { status: 'cancelled' },
      });

      console.log(`PaymentIntent ${failedPaymentIntent.id} failed`);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};

export const yooKassaWebhook = async (req: Request, res: Response) => {
  try {
    const event = req.body;

    if (event.event === "payment.succeeded") {
      const orderId = event.object.metadata.orderId;

      await prisma.order.update({
        where: { id: Number(orderId) },
        data: { status: "completed" },
      });
    }

    if (event.event === "payment.canceled") {
      const orderId = event.object.metadata.orderId;

      await prisma.order.update({
        where: { id: Number(orderId) },
        data: { status: "cancelled" },
      });
    }

    res.status(200).send("OK");
  } catch (error) {
    console.error(error);
    res.status(500).send("Webhook error");
  }
};

export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, orders });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Get user orders error";
    res.status(500).json({ success: false, message });
  }
};

export const allOrders = async (_req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" } });
    res.json({ success: true, orders });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Get all orders error";
    res.status(500).json({ success: false, message });
  }
};

export const updateStatus = async (req: Request, res: Response) => {
  try {
    const { orderId, status } = req.body;

    const order = await prisma.order.update({
      where: { id: Number(orderId) },
      data: { status },
    });

    res.json({ success: true, message: "Статус обновлён", order });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Update order status error";
    res.status(500).json({ success: false, message });
  }
};
