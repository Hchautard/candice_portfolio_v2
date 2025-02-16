import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const CardDistribution = () => {
  const cardsRef = useRef([]);
  const containerRef = useRef(null);
  const [cardsPerRow, setCardsPerRow] = useState(5);

  useEffect(() => {
    // Met à jour le nombre de cartes par ligne selon la largeur du conteneur
    const updateCardsPerRow = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        setCardsPerRow(Math.floor(containerWidth / 100)); // 100px = largeur estimée d'une carte + marge
      }
    };

    updateCardsPerRow();
    window.addEventListener("resize", updateCardsPerRow);
    return () => window.removeEventListener("resize", updateCardsPerRow);
  }, []);

  useEffect(() => {
    cardsRef.current.forEach((card, index) => {
      const row = Math.floor(index / cardsPerRow);
      const col = index % cardsPerRow;

      gsap.to(card, {
        x: col * 100, // Écartement horizontal
        y: row * 120, // Écartement vertical
        rotation: Math.random() * 10 - 5, // Légère rotation aléatoire
        duration: 0.5 + index * 0.05,
        ease: "power2.out",
      });
    });
  }, [cardsPerRow]); // Met à jour l'animation si le nombre de cartes par ligne change

  return (
    <div ref={containerRef} className="relative w-full h-auto p-4">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          ref={(el) => (cardsRef.current[i] = el)}
          className="absolute w-20 h-32 bg-red-500 rounded-lg shadow-lg"
        />
      ))}
    </div>
  );
};

export default CardDistribution;
