import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js'

dotenv.config()
const supabaseUrl = 'https://wowttshhzwgqbfrviipb.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export const authenticateToken = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        const { data, error } = await supabase
            .from('users')
            .select('id')
            .eq('id', req.user.id)
            .single();

        if (error || !data) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user.role = data.role;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid token' });
    }
}

export const authorizeRole = (roles) => {
    return (req, res, next) => {
        const userRole = req.user.role_id; // Assuming role_id is in the user object

        if (!req.user || !userRole) {
            return res.status(403).json({ message: 'User role not found' });
        }

        if (!roles.includes(userRole)) {
            return res.status(403).json({ message: 'Forbidden: You do not have permission to access this resource' });
        }

        next();
    }
}

