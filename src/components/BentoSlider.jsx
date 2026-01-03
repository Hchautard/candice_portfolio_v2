import React, { useMemo } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import BentoSlide from "./BentoSlide";
import "../styles/BentoSlider.css";

const ITEMS_PER_SLIDE = 3;

// Fonction pour diviser les images en groupes de 3
function groupImagesIntoSlides(images, itemsPerSlide) {
    const slides = [];
    for (let i = 0; i < images.length; i += itemsPerSlide) {
        slides.push(images.slice(i, i + itemsPerSlide));
    }
    return slides;
}

export default function BentoSlider({ images = [], itemsPerSlide = ITEMS_PER_SLIDE }) {
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
        arrows: true,
        swipe: true,
        touchMove: true,
        lazyLoad: "anticipated",
        waitForAnimate: false,
        cssEase: "ease-out",
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