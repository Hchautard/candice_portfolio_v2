import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.REACT_APP_SUPABASE_URL;
const supabaseKey = import.meta.env.REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

// Sans configuration (CI, clone sans .env), createClient lèverait une erreur au chargement
// et ferait planter tout le site : on l'affiche alors sans actualités ni avis.
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

if (!supabase) {
    console.warn("Supabase non configuré : actualités et avis désactivés (voir REACT_APP_SUPABASE_URL dans .env).");
}

export default supabase;
