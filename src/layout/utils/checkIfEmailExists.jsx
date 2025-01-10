import { supabase } from '../../services/supabase'; // Ensure your Supabase client is properly imported

const CheckIfEmailExists = async (email) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('email')
            .eq('email', email)
            .single();

        if (error) {
            // Handle case where email is not found or other errors
            if (error.message.includes('No rows found')) {
                return false; // Email does not exist
            } else {
                console.error('Error checking email:', error.message);
                throw new Error('Error checking email'); // Throw error for unexpected issues
            }
        }

        return !!data; // Email exists if data is returned
    } catch (err) {
        console.error('Not a serious error:', err.message);
        //throw new Error('Unexpected error occurred');
    }
};

export default CheckIfEmailExists;
