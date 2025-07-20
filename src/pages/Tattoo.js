import "../styles/Tattoo.css"
import CardDistribution from "./CardDistribution";
import { useEffect, useState } from "react";

import image1 from "../assets/images/tattoo/1.png";
import image2 from "../assets/images/tattoo/2.png";
import image3 from "../assets/images/tattoo/3.png";
import image4 from "../assets/images/tattoo/4.png";
import image5 from "../assets/images/tattoo/5.png";
import image6 from "../assets/images/tattoo/6.png";
import image7 from "../assets/images/tattoo/7.png";
import image8 from "../assets/images/tattoo/8.png";

function Tattoo() {
    const [showComponent, setShowComponent] = useState(false);
    const [imagesLoaded, setImagesLoaded] = useState(false);

    // Lazy loading des images
    const myCards = [
        { id: 1, imageSrc: image1, backContent: "Disponible !" },
        { id: 2, imageSrc: image2, backContent: "Disponible !" },
        { id: 3, imageSrc: image3, backContent: "Disponible !" },
        { id: 4, imageSrc: image4, backContent: "Disponible !" },
        { id: 5, imageSrc: image5, backContent: "Disponible !" },
        { id: 6, imageSrc: image6, backContent: "Disponible !" },
        { id: 7, imageSrc: image7, backContent: "Disponible !" },
        { id: 8, imageSrc: image8, backContent: "Disponible !" },
    ];

    useEffect(() => {
        const preloadImages = async () => {
            const imagePromises = myCards.map((card) => {
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
                // Afficher quand même le composant même si certaines images échouent
                setImagesLoaded(true);
            }
        };

        preloadImages();
    }, []);

    useEffect(() => {
        // Add class to body when component mounts
        document.body.classList.add('tattoo-page');

        // Attendre que les images soient chargées avant d'afficher
        if (imagesLoaded) {
            const timer = setTimeout(() => {
                setShowComponent(true);
            }, 500); // Délai réduit car les images sont déjà chargées

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
                    <CardDistribution cards={myCards} />
                ) : null}
            </div>
        </div>
    );
}

export default Tattoo;