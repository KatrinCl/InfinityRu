import express from 'express'
import { authUser } from '../middleware/auth.js'
import { allOrders, createPaymentIntent, getUserOrders, placeOrder, placeOrderUkassa, stripeWebhook, updateStatus } from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js'

const orderRouter = express.Router()

orderRouter.post('/place', authUser, placeOrder)
orderRouter.post('/pay', authUser, createPaymentIntent)
orderRouter.post('/orders', authUser, getUserOrders)
orderRouter.get('/list', adminAuth, allOrders)
orderRouter.post('/status', adminAuth, updateStatus)

// Вебхук для Stripe (без auth, проверяется сигнатура)
orderRouter.post('/webhook/stripe', stripeWebhook)

export default orderRouter;