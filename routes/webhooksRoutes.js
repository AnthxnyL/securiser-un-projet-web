import express from 'express';
import dotenv from 'dotenv';
import { handleShopifySalesWebhook, verifyShopifyWebhook } from '../controllers/webhooksController.js';

dotenv.config();

const router = express.Router();

router.post('/shopify-sales', express.raw({type : "application/json"}), verifyShopifyWebhook, handleShopifySalesWebhook);

export default router;