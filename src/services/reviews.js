/**
 * Récupère les avis Google via l'API RapidAPI
 * @param {Object} options - Options de configuration
 * @param {string} options.sort - Type de tri ('relevant', 'newest', 'oldest')
 * @param {boolean} options.nextpage - Si récupérer la page suivante
 * @returns {Promise} - Promise qui résout avec les données des avis
 */
export async function getGoogleReviews(options = {}) {
    try {
        const { sort = 'relevant', nextpage = false } = options;

        const searchId = process.env.REACT_APP_SEARCH_ID;
        const apiKey = process.env.REACT_APP_X_RAPID_API_KEY;
        const apiHost = process.env.REACT_APP_X_RAPID_API_HOST;

        if (!searchId || !apiKey || !apiHost) {
            throw new Error('Variables d\'environnement manquantes. Vérifiez votre fichier .env');
        }

        const url = `https://google-reviews-scraper.p.rapidapi.com/getReviewsV2?searchId=${encodeURIComponent(searchId)}&sort=${sort}&nextpage=${nextpage}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'x-rapidapi-key': apiKey,
                'x-rapidapi-host': apiHost
            },
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status} - ${response.statusText}`);
        }

        return await response.json();

    } catch (error) {
        console.error('Erreur dans getGoogleReviews:', error);
        throw error;
    }
}
