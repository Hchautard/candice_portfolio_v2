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
        setCardsPerRow(Math.floor(containerWidth / 280)); // largeur estimée d'une carte + marge
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
        x: col * 320, // Écartement horizontal
        y: row * 340, // Écartement vertical
        rotation: Math.random() * 10 - 5, // Légère rotation aléatoire
        duration: 0.5 + index * 0.05,
        ease: "power2.out",
      });
    });
  }, [cardsPerRow]); // Met à jour l'animation si le nombre de cartes par ligne change

  const flipCard = (index) => {

    if (cardsRef.current[index].flipped) {
      gsap.to(cardsRef.current[index], {
        rotationY: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    } else {
      gsap.to(cardsRef.current[index], {
        rotationY: 180,
        duration: 0.5,
        ease: "power2.out",
      });
    }

    cardsRef.current[index].flipped = !cardsRef.current[index].flipped;
  }

  return (
    <div ref={containerRef} className="relative w-full h-auto p-4">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          ref={(el) => (cardsRef.current[i] = el)}
          className="absolute w-64 h-80 bg-red-500 rounded-lg shadow-lg"
          onClick={() => flipCard(i)}
          flipped = {false}
        />
      ))}
    </div>
  );
};

export default CardDistribution;
