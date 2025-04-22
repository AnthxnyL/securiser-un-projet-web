import express from 'express';
import dotenv from 'dotenv';
import { getUser, getUsers } from '../controllers/userController.js';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware.js';


dotenv.config();
const router = express.Router();

router.get('/my-user', authenticateToken, authorizeRole([process.env.ADMIN_ROLE_ID, process.env.DEFAULT_ROLE_ID]), getUser);
router.get('/', authenticateToken, authorizeRole([process.env.ADMIN_ROLE_ID]), getUsers);

export default router;