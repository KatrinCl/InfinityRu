import "dotenv/config";
import express, { Request, Response } from 'express';
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import adminRouter from "./routes/adminRoute.js";
// import { toNodeHandler } from "better-auth/node";
// import { auth } from "./lib/auth.js";
// import projectRouter from "./routes/projectRoutes.js";
// import { stripeWebhook } from "./controllers/stripeWebhook.js";

const app = express();

const port = Number(process.env.PORT) || 4000;

const corsOptions = {
    origin: process.env.TRUSTED_ORIGINS?.split(',') || ["http://localhost:5173"],
    credentials: true
}

app.use(cors(corsOptions))
app.use(cookieParser())
// app.post('/api/stripe', express.raw({type: 'application/json'}), stripeWebhook)

// app.all('/api/auth/{*any}', toNodeHandler(auth));

app.use(express.json({limit: '50mb'}));

app.get('/', (req: Request, res: Response) => {
    res.send('Server is Live!');
});

app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)
app.use('/api/admin', adminRouter)
app.use('/uploads', express.static('uploads'))
// app.use('/api/project', projectRouter)

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});