import "dotenv/config";
import express, { Request, Response } from 'express';
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import adminRouter from "./routes/adminRoute.js";

const app = express();

const port = Number(process.env.PORT) || 4000;

const corsOptions = {
    origin: process.env.TRUSTED_ORIGINS?.split(',') || ["http://localhost:5173", "https://infinitytsru.vercel.app"],
    credentials: true
}

app.use(cors(corsOptions))
app.use(cookieParser())

app.post('/api/order/webhook/stripe', express.raw({type: 'application/json'}), (req: any, res: any) => {
    const { stripeWebhook } = require('./controllers/orderController.js');
    stripeWebhook(req, res);
});

app.use(express.json({limit: '50mb'}));

app.get('/', (req: Request, res: Response) => {
    res.send('Server is running at port ' + port);
});

app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)
app.use('/api/admin', adminRouter)
app.use('/uploads', express.static('uploads'))

app.listen(port, () => {
    console.log(`✅ Server is running at http://localhost:${port}`);
});