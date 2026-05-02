import express from 'express';
import { isAuth, loginUser, logout, registerUser } from '../controllers/userController.js';
import { authUser } from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post('/login', loginUser);
userRouter.post('/register', registerUser);
userRouter.get('/isAuth', authUser, isAuth);
userRouter.get('/logout', authUser, logout);

export default userRouter;