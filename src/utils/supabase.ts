import { PostgrestClient } from "@supabase/postgrest-js";

const supabaseUrl = import.meta.env.REACT_APP_SUPABASE_URL;
const supabaseKey = import.meta.env.REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

// Le site ne fait que lire deux tables (actualités, avis) : seul le client des tables de
// supabase-js (postgrest-js) est chargé, avec les mêmes en-têtes que createClient. Le reste
// (connexion, temps réel, fichiers, fonctions) pesait ~150 Ko dans le JavaScript de chaque page.
// Pour ajouter l'un de ces services, revenir à createClient de @supabase/supabase-js.
function createTablesClient(url: string, key: string) {
    try {
        // new URL rejette une adresse invalide ; « / » final ajouté comme dans createClient
        const restUrl = new URL("rest/v1", url.endsWith("/") ? url : `${url}/`).href;
        return new PostgrestClient(restUrl, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
    } catch {
        return null;
    }
}

// Sans configuration (CI, clone sans .env) ou avec une adresse invalide, le site s'affiche
// sans actualités ni avis plutôt que de planter au chargement.
const supabase = supabaseUrl && supabaseKey ? createTablesClient(supabaseUrl, supabaseKey) : null;

if (!supabase) {
    console.warn("Supabase non configuré : actualités et avis désactivés (voir REACT_APP_SUPABASE_URL dans .env).");
}

export default supabase;
