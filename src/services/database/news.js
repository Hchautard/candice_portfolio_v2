import supabase from '../../utils/supabase.ts';
import { byDateDesc } from '../../utils/dates';

// Actualités de la plus récente à la plus ancienne (date de l'événement) ;
// celles sans date valide à la fin, dans l'ordre de création (le tri est stable)
export const getNews = async () => {
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return [...(data || [])].sort(byDateDesc('date_event'));
};
