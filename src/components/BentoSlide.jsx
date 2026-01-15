import React, { useState, useEffect } from "react";
import LazyImage from "./LazyImage";

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

export default function BentoSlide({ items }) {
    const { width } = useWindowSize();

    const getColumns = () => {
        if (width < 640) return 1;
        if (width < 1024) return 2;
        return 3;
    };

    const columns = getColumns();
    const isMobile = width < 640;

    return (
        <div
            className="bento-grid"
            style={{
                display: "grid",
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                gridTemplateRows: "1fr",
                gap: isMobile ? "12px" : "16px",
                padding: isMobile ? "12px" : "20px",
                width: "100%",
                height: "90vh",
                boxSizing: "border-box",
                willChange: "transform",
                transform: "translateZ(0)",
            }}
        >
            {items.map((item, index) => (
                <div
                    key={index}
                    className="bento-cell"
                    style={{
                        position: "relative",
                        overflow: "hidden",
                        borderRadius: isMobile ? "12px" : "16px",
                        minHeight: 0,
                        minWidth: 0,
                        willChange: "transform",
                        transform: "translateZ(0)",
                    }}
                >
                    <BentoCard item={item} isMobile={isMobile} />
                </div>
            ))}
        </div>
    );
}

function BentoCard({ item, isMobile }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            style={{
                position: "relative",
                width: "100%",
                height: "100%",
                borderRadius: isMobile ? "12px" : "16px",
                overflow: "hidden",
                cursor: "pointer",
                transform: isHovered && !isMobile ? "scale(1.02)" : "scale(1)",
                boxShadow: isHovered && !isMobile
                    ? "0 20px 40px rgba(0,0,0,0.3)"
                    : "0 4px 12px rgba(0,0,0,0.1)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                willChange: "transform",
                backfaceVisibility: "hidden",
            }}
            onMouseEnter={() => !isMobile && setIsHovered(true)}
            onMouseLeave={() => !isMobile && setIsHovered(false)}
        >
            <LazyImage
                src={item.imageSrc}
                srcSmall={item.imageSrcSmall}
                alt={item.title}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transform: isHovered && !isMobile ? "scale(1.05)" : "scale(1)",
                    transition: "transform 0.3s ease",
                    willChange: "transform",
                    backfaceVisibility: "hidden",
                }}
            />

            {/* Overlay gradient pour le titre */}
            <div
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: isMobile ? "40%" : "50%",
                    background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)",
                    pointerEvents: "none",
                    opacity: isHovered || isMobile ? 1 : 0.8,
                    transition: "opacity 0.3s ease",
                }}
            />

            {/* Titre */}
            <div
                style={{
                    position: "absolute",
                    bottom: isMobile ? "12px" : "16px",
                    left: isMobile ? "12px" : "16px",
                    right: isMobile ? "12px" : "16px",
                    color: "white",
                    fontSize: isMobile ? "1.1rem" : "clamp(0.9rem, 2vw, 1.3rem)",
                    fontWeight: "bold",
                    textShadow: "0 2px 8px rgba(0,0,0,0.5)",
                    zIndex: 2,
                    transform: isHovered && !isMobile ? "translateY(-4px)" : "translateY(0)",
                    transition: "transform 0.3s ease",
                }}
            >
                {item.title}
            </div>
        </div>
    );
}
