import crypto from 'crypto';
import { supabase } from '../config/supabaseClient.js';
import dotenv from 'dotenv';
dotenv.config()


const verifyShopifyWebhook = (req, res, next) => {
    try {
        const hmacHeader = req.headers["x-shopify-hmac-sha256"];
        const secret = process.env.SHOPIFY_WEBHOOK_SECRET;

        if (!hmacHeader || !secret) {
            return res
                .status(400)
                .json({ error: "Missing HMAC header or secret." });
        }

        const generatedHmac = crypto
            .createHmac("sha256", secret)
            .update(req.body)
            .digest(); // Buffer

        
        const receivedHmac = Buffer.from(hmacHeader, "base64");

        const isValid =
            generatedHmac.length === receivedHmac.length &&
            crypto.timingSafeEqual(generatedHmac, receivedHmac);

        if (!isValid) {
            return res
                .status(401)
                .json({ success: false, message: "Faux webhook 🚫" });
        }

        next();

    } catch (err) {
        console.error("Erreur test HMAC :", err);
        res.status(500).json({ error: "Erreur serveur." });
    }
};

const handleShopifySalesWebhook = async (req, res) => {
    try {
        const payload = JSON.parse(req.body.toString('utf8'));
        const { line_items } = payload;

        for (const item of line_items) {
            const { product_id, quantity } = item;
            
            const { data: product, error: fetchError } = await supabase
            .from('products')
            .select('sales_count')
            .eq('shopify_id', product_id)
            .single();



            if (fetchError || !product) {
                console.error(`Error fetching product with shopify_id ${product_id}:`, fetchError);
                continue;
            }

            const newSalesCount = product.sales_count + quantity;

            const { error: updateError } = await supabase
                .from('products')
                .update({ sales_count: newSalesCount })
                .eq('shopify_id', product_id);

            if (updateError) {
                console.error(`Error updating sales_count for product_id ${product_id}:`, updateError);
            }
        }

        res.status(200).json({ message: 'Webhook processed successfully' });
    } catch (error) {
        console.error('Error processing webhook:', error);
        res.status(500).json({ message: 'Error processing webhook', error: error.message });
    }
};

export { verifyShopifyWebhook, handleShopifySalesWebhook };