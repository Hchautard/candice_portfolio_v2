import React, { useState } from "react";

export default function BentoSlide({ items }) {
    return (
        <div
            className="bento-grid"
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gridTemplateRows: "1fr",
                gap: "16px",
                padding: "20px",
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
                        borderRadius: "16px",
                        minHeight: 0,
                        minWidth: 0,
                        willChange: "transform",
                        transform: "translateZ(0)",
                    }}
                >
                    <BentoCard item={item} />
                </div>
            ))}
        </div>
    );
}

// Composant carte simplifié pour le bento
function BentoCard({ item }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            style={{
                position: "relative",
                width: "100%",
                height: "100%",
                borderRadius: "16px",
                overflow: "hidden",
                cursor: "pointer",
                transform: isHovered ? "scale(1.02)" : "scale(1)",
                boxShadow: isHovered
                    ? "0 20px 40px rgba(0,0,0,0.3)"
                    : "0 4px 12px rgba(0,0,0,0.1)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                willChange: "transform",
                backfaceVisibility: "hidden",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image de fond */}
            <img
                src={item.imageSrc}
                alt={item.title}
                loading="eager"
                decoding="async"
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transform: isHovered ? "scale(1.05)" : "scale(1)",
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
                    height: "50%",
                    background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)",
                    pointerEvents: "none",
                    opacity: isHovered ? 1 : 0.8,
                    transition: "opacity 0.3s ease",
                }}
            />

            {/* Titre */}
            <div
                style={{
                    position: "absolute",
                    bottom: "16px",
                    left: "16px",
                    right: "16px",
                    color: "white",
                    fontSize: "clamp(0.9rem, 2vw, 1.3rem)",
                    fontWeight: "bold",
                    textShadow: "0 2px 8px rgba(0,0,0,0.5)",
                    zIndex: 2,
                    transform: isHovered ? "translateY(-4px)" : "translateY(0)",
                    transition: "transform 0.3s ease",
                }}
            >
                {item.title}
            </div>
        </div>
    );
}