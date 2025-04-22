import express from 'express';
import { loginUser } from '../controllers/loginController.js';
import { authorizeRole, authenticateToken } from '../middleware/authMiddleware.js';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

// router.post('/', authenticateToken, authorizeRole([process.env.DEFAULT_ROLE_ID, process.env.ADMIN_ROLE_ID]), loginUser);

router.post('/', loginUser); 
export default router;
