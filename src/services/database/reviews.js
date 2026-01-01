import supabase from '../../utils/supabase.ts';

export const getReviews = async () => {
    const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
};