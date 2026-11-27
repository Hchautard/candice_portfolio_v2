import { Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import ErrorBoundary from './ErrorBoundary';
import { useData } from '../contexts/DataContext';
import { INSTAGRAM } from '../data/social';
import { srcSetBuilder } from '../utils/responsive-images';
import tattooPhoto from '../assets/images/tattoo/done/Portal.webp';
import makeupPhoto from '../assets/images/makeup/mira_1.webp';
import creationPhoto from '../assets/images/makeup/karole_3.webp';

// Les trois métiers de Candice en triptyque, comme un retable : le makeup au centre, plus haut,
// le tatouage et les créations sur les volets. Chaque panneau mène à sa page.

// three.js ne charge que sur ordinateur, dans son propre chunk, après le premier rendu
const TattooMachine3D = lazy(() => import('./TattooMachine3D'));

// Versions réduites des photos (npm run optimize:media), proposées au navigateur (srcset)
const srcSetOf = srcSetBuilder({
    ...import.meta.glob('../assets/images/tattoo/done/w*/Portal.webp', { eager: true, import: 'default' }),
    ...import.meta.glob('../assets/images/makeup/w*/{mira_1,karole_3}.webp', { eager: true, import: 'default' }),
});

const photo = (src, path) => ({ src, srcSet: srcSetOf(path, src) });

const PANELS = [
    {
        id: 'tattoo',
        title: 'Tattoo',
        text: 'Flashs à adopter et projets sur mesure, souvent dessinés en freehand.',
        action: 'Voir les flashs',
        to: '/tattoo',
        photo: photo(tattooPhoto, '../assets/images/tattoo/done/Portal.webp'),
    },
    {
        id: 'makeup',
        title: 'Makeup',
        text: "Looks de défilé, effets spéciaux, drag, et des cours de maquillage à tous les niveaux.",
        action: 'Voir les looks',
        to: '/makeup',
        photo: photo(makeupPhoto, '../assets/images/makeup/mira_1.webp'),
    },
    {
        id: 'creations',
        title: 'Créations',
        text: 'Coiffes, accessoires et pièces de défilé, fabriqués à la main.',
        action: 'Voir les coulisses',
        photo: photo(creationPhoto, '../assets/images/makeup/karole_3.webp'),
        // Coiffe à pointes du défilé POZ : le haut de la photo
        focus: '50% 20%',
    },
];

// Largeur affichée des photos (Home.css, .triptych) : un panneau sur trois, ou ~72 % de l'écran
// sur téléphone (les panneaux défilent côte à côte)
const PHOTO_SIZES = '(max-width: 767px) 72vw, (max-width: 1199px) 32vw, 22vw';

Triptych.propTypes = {
    // Sur ordinateur, la machine à tatouer en 3D remplace la photo du panneau Tattoo
    with3D: PropTypes.bool,
};

export default function Triptych({ with3D = false }) {
    const { news } = useData();
    // Créations : la dernière actualité de l'atelier ; sans actualité, le profil Instagram
    const workshop = news.find((item) => item.category === 'Création');

    return (
        <section className="triptych" aria-labelledby="triptych-title">
            <h2 id="triptych-title" className="sr-only">Mes univers</h2>
            <ul className="triptych__panels">
                {PANELS.map((panel) => {
                    const content = (
                        <>
                            <div className="triptych__frame">
                                <div className="triptych__window">
                                    <img
                                        className="triptych__photo"
                                        src={panel.photo.src}
                                        srcSet={panel.photo.srcSet}
                                        sizes={panel.photo.srcSet && PHOTO_SIZES}
                                        style={panel.focus ? { objectPosition: panel.focus } : undefined}
                                        alt=""
                                        decoding="async"
                                    />
                                    {panel.id === 'tattoo' && with3D && (
                                        <div className="model-container">
                                            {/* Sans WebGL, le modèle disparaît et la photo reste */}
                                            <ErrorBoundary>
                                                <Suspense fallback={null}>
                                                    <TattooMachine3D />
                                                </Suspense>
                                            </ErrorBoundary>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="triptych__plaque">
                                <h3 className="triptych__title">{panel.title}</h3>
                                <p className="triptych__text">{panel.text}</p>
                                <span className="triptych__action">{panel.action}</span>
                            </div>
                        </>
                    );

                    const to = panel.to ?? (workshop && `/news/${workshop.id}`);
                    return (
                        <li key={panel.id} className={`triptych__panel triptych__panel--${panel.id}`}>
                            {to ? (
                                <Link className="triptych__link" to={to}>{content}</Link>
                            ) : (
                                <a className="triptych__link" href={INSTAGRAM.profileUrl} target="_blank" rel="noopener noreferrer">
                                    {content}
                                    <span className="sr-only"> (Instagram, nouvel onglet)</span>
                                </a>
                            )}
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}
