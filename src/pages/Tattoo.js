import "../styles/Tattoo.css"
import CardDistribution from "./CardDistribution";
import { useEffect, useMemo, useState } from "react";
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

const SKELETON_COUNT = 7;

function SkeletonCard() {
    return (
        <div className="skeleton-card">
            <div className="skeleton-image shimmer" />
            <div className="skeleton-text shimmer" />
        </div>
    );
}

function SkeletonGrid() {
    return (
        <div className="skeleton-grid">
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <SkeletonCard key={i} />
            ))}
        </div>
    );
}

function Tattoo() {
    const [showComponent, setShowComponent] = useState(false);
    const [imagesLoaded, setImagesLoaded] = useState(false);
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

    useEffect(() => {
        const preloadImages = async () => {
            const imagePromises = allImages.map((card) => {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.onload = resolve;
                    img.onerror = reject;
                    img.src = card.imageSrc;
                });
            });

            try {
                await Promise.all(imagePromises);
                setImagesLoaded(true);
            } catch (error) {
                console.error("Erreur lors du chargement des images:", error);
                setImagesLoaded(true);
            }
        };

        preloadImages();
    }, [allImages]);

    useEffect(() => {
        if (imagesLoaded) {
            const timer = setTimeout(() => {
                setShowComponent(true);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [imagesLoaded]);

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
                    {!showComponent && <SkeletonGrid />}
                    {showComponent && imagesLoaded && (
                        <CardDistribution key={activeCategory} cards={filteredImages} />
                    )}
                </div>
            </div>
        </div>
    );
}

export default Tattoo;
