import express from 'express';
import { adminLogin, adminLogout, checkAdmin, getAdminMetrics } from '../controllers/adminController.js';
import authAdmin from '../middleware/adminAuth.js';

const adminRouter = express.Router();

adminRouter.post('/login', adminLogin);
adminRouter.get('/logout', authAdmin, adminLogout);
adminRouter.get('/check', checkAdmin);
adminRouter.get('/metrics', authAdmin, getAdminMetrics);

export default adminRouter;