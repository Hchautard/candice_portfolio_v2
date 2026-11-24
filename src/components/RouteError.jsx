import { useRouteError } from 'react-router-dom';

// Erreur pendant le rendu d'une page (bug, ou chunk introuvable après une mise en ligne).
// Chargé d'emblée et sans dépendance : il doit s'afficher même quand un chunk ne charge plus.
export default function RouteError() {
    const error = useRouteError();
    console.error(error);

    return (
        <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: '#080808', color: '#f1e2ba', textAlign: 'center' }}>
            <div style={{ maxWidth: 480 }}>
                <h1 style={{ fontFamily: '"Alice_Wonderland_2", serif', fontSize: 40, marginBottom: 16 }}>Oups, la page n&apos;a pas pu s&apos;afficher</h1>
                <p style={{ textAlign: 'center', marginBottom: 24 }}>Rechargez la page. Si le problème continue, revenez un peu plus tard.</p>
                <button
                    type="button"
                    onClick={() => window.location.reload()}
                    style={{ padding: '10px 24px', borderRadius: 8, background: '#f1e2ba', color: '#080808', marginRight: 12 }}
                >
                    Recharger
                </button>
                <a href="/" style={{ color: '#bb9c85', textDecoration: 'underline' }}>Accueil</a>
            </div>
        </main>
    );
}
