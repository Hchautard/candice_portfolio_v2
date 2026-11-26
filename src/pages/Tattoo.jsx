import "../styles/Tattoo.css"
import CardDistribution from "./CardDistribution";
import { useMemo, useState } from "react";
import DocumentTitleSetter from "../utils/title-setter.ts";
import { CATEGORIES, IMAGE_CATEGORY_MAP } from "../data/tattooCategories";
import { DONE_IMAGE_MAP, REALISATIONS } from "../data/tattooDone";
import { INSTAGRAM } from "../data/social";
import { srcSetBuilder } from "../utils/responsive-images";

// Images optimisées en WebP via `npm run optimize:media`, avec leurs versions réduites (w400/…).
// import.meta.glob (Vite) liste les fichiers au build : chemin → URL de l'image
const flashImages = import.meta.glob('../assets/images/tattoo/*.webp', { eager: true, import: 'default' });
const doneImages = import.meta.glob('../assets/images/tattoo/done/*.webp', { eager: true, import: 'default' });
const srcSetOf = srcSetBuilder({
    ...import.meta.glob('../assets/images/tattoo/w*/*.webp', { eager: true, import: 'default' }),
    ...import.meta.glob('../assets/images/tattoo/done/w*/*.webp', { eager: true, import: 'default' }),
});

// Les réalisations font la largeur d'une carte flash (320 px au plus, cf. .realisations-grid)
const REALISATION_SIZES = "(max-width: 359px) calc(100vw - 32px), 320px";

const fileName = (path) => path.split('/').pop().replace(/\.webp$/, '');

// Comparaison binaire des chemins : même ordre que l'ancien require.context de webpack
// (localeCompare placerait « Cyber1 » avant « Cyber-etoile »)
const byPath = (a, b) => {
    if (a === b) return 0;
    return a < b ? -1 : 1;
};

function getImages() {
    return Object.keys(flashImages).sort(byPath).map(path => ({
        src: flashImages[path],
        srcSet: srcSetOf(path, flashImages[path]),
        name: fileName(path)
    }));
}

const donePath = (file) => `../assets/images/tattoo/done/${file}.webp`;
const doneImage = (file) => doneImages[donePath(file)];
const doneSrcSet = (file) => srcSetOf(donePath(file), doneImage(file));

function formatImageForCards(rawImages) {
    return rawImages.map((img, i) => {
        const doneName = DONE_IMAGE_MAP[img.name];
        return {
            id: i + 1,
            imageSrc: img.src,
            imageSrcSet: img.srcSet,
            name: img.name,
            category: IMAGE_CATEGORY_MAP[img.name] || 'tous',
            backImage: doneName ? doneImage(doneName) : undefined,
            backImageSrcSet: doneName ? doneSrcSet(doneName) : undefined,
            backContent: "Disponible !"
        };
    });
}

function Tattoo() {
    const [activeCategory, setActiveCategory] = useState('tous');

    DocumentTitleSetter("Tattoo", {
        description: "Flashs à adopter et réalisations de Candice, tatoueuse à Montpellier : cyber-sigilism, gothique et dark fantasy, adaptés à votre morphologie.",
    });

    const allImages = useMemo(() => formatImageForCards(getImages()), []);

    const filteredImages = useMemo(() =>
        activeCategory === 'tous'
            ? allImages
            : allImages.filter(img => img.category === activeCategory),
        [allImages, activeCategory]
    );

    const categoryCounts = useMemo(() =>
        CATEGORIES.reduce((acc, cat) => {
            acc[cat.id] = cat.id === 'tous'
                ? allImages.length
                : allImages.filter(img => img.category === cat.id).length;
            return acc;
        }, {}),
        [allImages]
    );

    return (
        <div className="Tattoo">
            <div className="container-tattoo">
                <aside className="tattoo-sidebar">
                    <div className="sidebar-inner">
                        <p className="sidebar-title">Filtrer</p>
                        <ul className="sidebar-categories">
                            {CATEGORIES.map(cat => (
                                <li key={cat.id}>
                                    <button
                                        className={`sidebar-cat-btn${activeCategory === cat.id ? ' active' : ''}`}
                                        onClick={() => setActiveCategory(cat.id)}
                                    >
                                        <span className="cat-label">{cat.label}</span>
                                        <span className="cat-count">{categoryCounts[cat.id]}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>
                <div className="tattoo-content">
                    <header className="tattoo-intro">
                        <h1>Mes flashs</h1>
                        <p>
                            À adopter tels quels ou à adapter à votre morphologie. Touchez une carte pour la retourner.
                        </p>
                        <p>
                            Un flash vous plaît&nbsp;?{' '}
                            <a href={INSTAGRAM.dmUrl} target="_blank" rel="noopener noreferrer">
                                Écrivez-moi sur Instagram<span className="sr-only"> (nouvel onglet)</span>
                            </a>
                            {' '}en me donnant son nom.
                        </p>
                    </header>
                    <CardDistribution key={activeCategory} cards={filteredImages} />

                    <section className="realisations" aria-labelledby="realisations-title">
                        <h2 id="realisations-title" className="realisations-title">Autres réalisations</h2>
                        <ul className="realisations-grid">
                            {REALISATIONS.map(({ file, alt }) => (
                                <li key={file}>
                                    <img
                                        src={doneImage(file)}
                                        srcSet={doneSrcSet(file)}
                                        sizes={REALISATION_SIZES}
                                        alt={alt}
                                        width="1080"
                                        height="1350"
                                        loading="lazy"
                                        className="realisations-img"
                                    />
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default Tattoo;
