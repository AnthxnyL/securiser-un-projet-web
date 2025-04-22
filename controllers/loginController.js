import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config()
const supabaseUrl = 'https://wowttshhzwgqbfrviipb.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)


export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();


        const { data: role, error: roleError } = await supabase
            .from('roles')
            .select('*')
            .eq('id', data.role_id)
            .single();

        if (role.id == process.env.BAN_ROLE_ID) {
            return res.status(401).json({ message: 'Your account is banned' });
        }


        if (error) {
            return res.status(500).json({ message: 'Error fetching user', error });
        }

        
        if (!data) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        
        const isPasswordValid = await bcrypt.compare(password, data.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign({ id: data.id , email: data.email, role_id: data.role_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log(token)
        
        return res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}