import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wowttshhzwgqbfrviipb.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export const getUser = async (req, res) => {
    try {
        const { id } = req.user;

        if (!id) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            return res.status(500).json({ message: 'Error fetching user', error });
        }

        if (!data) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
}


export const getUsers = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*');

        if (error) {
            return res.status(500).json({ message: 'Error fetching users', error });
        }

        return res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
}