import supabase from '../../utils/supabase.ts';

export const getNews = async () => {
    const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
};