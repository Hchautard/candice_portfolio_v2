import "../styles/Tattoo.css"
import CardDistribution from "./CardDistribution";
import { useEffect, useState } from "react";

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

function setupCss(){
    document.body.classList.add('tattoo-page');
    document.body.classList.remove('project-page');
    document.body.classList.remove('contact-page');
    document.body.classList.remove('makeup-page');
}

function Tattoo() {
    const [showComponent, setShowComponent] = useState(false);
    const [imagesLoaded, setImagesLoaded] = useState(false);

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

        // Add class to body when component mounts
        document.body.classList.add('tattoo-page');

        // Attendre que les images soient chargées avant d'afficher
        if (imagesLoaded) {
            const timer = setTimeout(() => {
                setShowComponent(true);
            }, 500);

            return () => clearTimeout(timer);
        }

        // Remove class when component unmounts
        return () => {
            document.body.classList.remove('tattoo-page');
        };
    }, [imagesLoaded]);

    return (
        <div className="Tattoo">
            <div className="container-tattoo">
                {!imagesLoaded && (
                    <div className="loading-container">
                        <div className="loading-spinner">Chargement des tatouages...</div>
                    </div>
                )}
                {showComponent && imagesLoaded ? (
                    <CardDistribution cards={formattedImages} />
                ) : null}
            </div>
        </div>
    );
}

export default Tattoo;