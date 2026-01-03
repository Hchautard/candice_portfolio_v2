import React, { useMemo, useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import BentoSlide from "./BentoSlide";
import "../styles/BentoSlider.css";

function useWindowSize() {
    const [windowSize, setWindowSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    });

    useEffect(() => {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
            });
        }

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowSize;
}

// Fonction pour diviser les images en groupes
function groupImagesIntoSlides(images, itemsPerSlide) {
    const slides = [];
    for (let i = 0; i < images.length; i += itemsPerSlide) {
        slides.push(images.slice(i, i + itemsPerSlide));
    }
    return slides;
}

export default function BentoSlider({ images = [] }) {
    const { width } = useWindowSize();

    const getItemsPerSlide = () => {
        if (width < 640) return 1;      // Mobile: 1 image par slide
        if (width < 1024) return 2;     // Tablette: 2 images par slide
        return 3;                        // Desktop: 3 images par slide
    };

    const itemsPerSlide = getItemsPerSlide();
    const isMobile = width < 640;

    const slides = useMemo(() => {
        if (!images || images.length === 0) return [];
        return groupImagesIntoSlides(images, itemsPerSlide);
    }, [images, itemsPerSlide]);

    const settings = {
        dots: true,
        infinite: true,
        speed: 300,
        slidesToShow: 1,
        slidesToScroll: 1,
        adaptiveHeight: false,
        arrows: !isMobile,
        swipe: true,
        touchMove: true,
        lazyLoad: "anticipated",
        waitForAnimate: false,
        cssEase: "ease-out",
        swipeToSlide: true,
        touchThreshold: 10,
    };

    if (!images || images.length === 0) {
        return <div className="flex items-center justify-center h-screen">Aucune image à afficher</div>;
    }

    return (
        <div className="bento-slider-container">
            <div style={{ display: "none" }}>
                {images.map((img, i) => (
                    <img key={i} src={img.imageSrc} alt="" />
                ))}
            </div>

            <Slider {...settings}>
                {slides.map((slideItems, index) => (
                    <div key={index}>
                        <BentoSlide items={slideItems} />
                    </div>
                ))}
            </Slider>
        </div>
    );
}