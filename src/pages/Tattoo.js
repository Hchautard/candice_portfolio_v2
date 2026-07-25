import "../styles/Tattoo.css"
import CardDistribution from "./CardDistribution";
import { useMemo, useState } from "react";
import DocumentTitleSetter from "../utils/title-setter.ts";
import { CATEGORIES, IMAGE_CATEGORY_MAP } from "../data/tattooCategories";

function getImages() {
    const images = require.context('../assets/images/tattoo', false, /\.png$/);
    return images.keys().map(key => ({
        src: images(key),
        name: key.replace('./', '').replace('.png', '')
    }));
}

function formatImageForCards(rawImages) {
    return rawImages.map((img, i) => ({
        id: i + 1,
        imageSrc: img.src,
        name: img.name,
        category: IMAGE_CATEGORY_MAP[img.name] || 'tous',
        backContent: "Disponible !"
    }));
}

function Tattoo() {
    const [activeCategory, setActiveCategory] = useState('tous');

    DocumentTitleSetter("Tattoo");

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
            <h1 className="sr-only">Portfolio Tattoo — L&apos;Anomalie</h1>
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
                    <CardDistribution key={activeCategory} cards={filteredImages} />
                </div>
            </div>
        </div>
    );
}

export default Tattoo;
