import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config()

const supabaseUrl = 'https://wowttshhzwgqbfrviipb.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

const SHOPIFY_BASE_URL = process.env.SHOPIFY_BASE_URL;
const SHOPIFY_PASSWORD = process.env.SHOPIFY_PASSWORD;

export const createProduct = async (req, res) => {

    try {
        const { name, price } = req.body;

        // Vérifier que le nom et le prix sont fournis
        if (!name || !price) {
            return res.status(400).json({ message: 'Product name and price are required' });
        }

        // Récupérer l'ID de l'utilisateur depuis le token (injecté par le middleware)
        const userId = req.user.id;
        

        // Créer le produit sur Shopify
        const shopifyResponse = await axios.post(
            `https://${SHOPIFY_BASE_URL}/admin/api/2025-01/products.json`,
            {
                product: {
                    title: name,
                    variants: [
                        {
                            price: price,
                        },
                    ],
                },
            },
            {
                auth: {
                    password: SHOPIFY_PASSWORD,
                }
            }
        );

        const shopifyProductId = shopifyResponse.data.product.id;
        console.log('Shopify Product ID:', shopifyProductId);

        // Enregistrer le produit dans Supabase
        const { data, error } = await supabase
            .from('products')
            .insert([
                {
                    shopify_id: shopifyProductId,
                    created_by : userId
                },
            ])
            .select();

        if (error) {
            return res.status(500).json({ message: 'Error saving product to database', error });
        }

        return res.status(201).json({ message: 'Product created successfully', data });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};


export const getProducts = async (req, res) => {
    try {
        const response = await axios.get(
            `https://${SHOPIFY_BASE_URL}/admin/api/2025-01/products.json`,
            {
                auth: {
                    password: SHOPIFY_PASSWORD,
                }
            }
        );

        return res.status(200).json(response.data.products);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });

    }
}


export const myProducts = async (req, res) => {
    try {
        const { id } = req.user;
        console.log(req.user);

        if (!id) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('created_by', id);

        if (error) {
            return res.status(500).json({ message: 'Error fetching products', error });
        }

        return res.status(200).json(data);
    } catch(error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
}

export const getBestsellers = async (req, res) => {
    try {
        const { id } = req.user; // Récupérer l'ID de l'utilisateur depuis le token

        if (!id) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('created_by', id)
            .order('sales_count', { ascending: false }); // Trier par sales_count décroissant

        if (error) {
            return res.status(500).json({ message: 'Error fetching bestsellers', error });
        }

        return res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching bestsellers:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}