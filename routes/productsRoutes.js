import express from 'express';
import dotenv from 'dotenv';
import { createProduct, getProducts, myProducts, getBestsellers } from '../controllers/productsController.js';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware.js';
dotenv.config();

const router = express.Router();

router.post('/', authenticateToken, authorizeRole([process.env.DEFAULT_ROLE_ID, process.env.ADMIN_ROLE_ID]), createProduct);

router.get('/', authenticateToken, authorizeRole([process.env.DEFAULT_ROLE_ID, process.env.ADMIN_ROLE_ID]), getProducts);

router.get('/my-products', authenticateToken, authorizeRole([process.env.DEFAULT_ROLE_ID, process.env.ADMIN_ROLE_ID]), myProducts);

router.get('/my-bestsellers', authenticateToken, authorizeRole([process.env.ADMIN_ROLE_ID, process.env.PREMIUM_ROLE_ID]), getBestsellers);

export default router;