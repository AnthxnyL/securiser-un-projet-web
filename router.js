import express from 'express';
import healthRoutes from './routes/HealthRoutes.js';
import registerRoutes from './routes/registerRoutes.js';
import loginRoutes from './routes/loginRoutes.js';
import userRoutes from './routes/userRoutes.js';
import productsRoutes from './routes/productsRoutes.js';
import webhooksRoutes from './routes/webhooksRoutes.js';


const router = express.Router();

router.use('/webhooks', webhooksRoutes);
router.use(express.json());
router.use('/health', healthRoutes);
router.use('/register', registerRoutes);
router.use('/login', loginRoutes);
router.use('/users', userRoutes);
router.use('/products', productsRoutes);


export default router;