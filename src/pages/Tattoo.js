import "../styles/Tattoo.css"
import CardDistribution from "./CardDistribution";
import { useEffect, useState } from "react";
import DocumentTitleSetter from "../utils/title-setter.ts";

function getImages() {
    const images = require.context('../assets/images/tattoo', false, /\.png$/);
    const imagePaths = images.keys().map(images);
    return imagePaths;
}

function formatImageForCards(imageSrc) {
    let formatedImages = [];
    for (let i = 0; i < imageSrc.length; i++) {
        formatedImages.push({ id: i + 1, imageSrc: imageSrc[i], backContent: "Disponible !" });
    }
    return formatedImages;
}

function setupCss() {
    document.body.classList.add('tattoo-page');
    document.body.classList.remove('project-page');
    document.body.classList.remove('contact-page');
    document.body.classList.remove('makeup-page');
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

    DocumentTitleSetter("Tattoo");
    setupCss();

    const formattedImages = formatImageForCards(getImages());

    useEffect(() => {
        const preloadImages = async () => {
            const imagePromises = formattedImages.map((card) => {
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
    }, []);

    useEffect(() => {
        if (document.body.classList.contains('contact-page') || document.body.classList.contains('project-page')) {
            document.body.classList.remove('contact-page');
            document.body.classList.remove('project-page');
        }

        document.body.classList.add('tattoo-page');

        if (imagesLoaded) {
            const timer = setTimeout(() => {
                setShowComponent(true);
            }, 500);
            return () => clearTimeout(timer);
        }

        return () => {
            document.body.classList.remove('tattoo-page');
        };
    }, [imagesLoaded]);

    return (
        <div className="Tattoo">
            <div className="container-tattoo">
                {!showComponent && <SkeletonGrid />}
                {showComponent && imagesLoaded && <CardDistribution cards={formattedImages} />}
            </div>
        </div>
    );
}

export default Tattoo;