import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import '../styles/CardDistribution.css';

const CardDistribution = ({ cards = [] }) => {
  const cardsRef = useRef([]);
  const containerRef = useRef(null);
  const [cardsPerRow, setCardsPerRow] = useState(5);
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    // Met à jour le nombre de cartes par ligne selon la largeur du conteneur
    const updateCardsPerRow = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        setCardsPerRow(Math.floor(containerWidth / 330)); // largeur estimée d'une carte + marge
      }
    };

    updateCardsPerRow();
    window.addEventListener("resize", updateCardsPerRow);
    return () => window.removeEventListener("resize", updateCardsPerRow);
  }, []);

  useEffect(() => {
    let maxHeight = 0;
    
    cardsRef.current.forEach((card, index) => {
      if (!card) return;
      
      const row = Math.floor(index / cardsPerRow);
      const col = index % cardsPerRow;

      gsap.to(card, {
        x: col * 380, // Écartement horizontal
        y: row * 420, // Écartement vertical
        rotation: Math.random() * 10 - 5, // Légère rotation aléatoire
        duration: 0.5 + index * 0.05,
        ease: "power2.out",
      });
      
      // Calculate the maximum height needed for the container
      const cardBottom = (row + 1) * 340 + 80; // Add card height (80px) to position
      if (cardBottom > maxHeight) {
        maxHeight = cardBottom;
      }
    });
    
    // Update container height
    setContainerHeight(maxHeight);
    
  }, [cardsPerRow, cards.length]); // Met à jour l'animation si le nombre de cartes par ligne ou le nombre de cartes change

  const flipCard = (index) => {
    if (!cardsRef.current[index]) return;
    
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

  // Utiliser les cartes fournies ou générer des cartes vides si aucune n'est fournie
  const cardItems = cards.length > 0 ? cards : [...Array(20)].map((_, i) => ({ id: i }));

  return (
    <div 
      ref={containerRef} 
      className="relative w-full p-4"
      style={{ height: `${containerHeight}px` }}
    >
      {cardItems.map((card, i) => (
        <div
          key={card.id || i}
          ref={(el) => (cardsRef.current[i] = el)}
          className="absolute w-80 h-96 rounded-lg shadow-lg cursor-pointer perspective-500 transform-style-preserve-3d"
          onClick={() => flipCard(i)}
          flipped={false}
        >
          {/* Face avant de la carte */}
          <div className="absolute w-full h-full rounded-lg backface-hidden">
            {card.image ? (
              <img 
                src={card.image} 
                alt={card.alt || `Card ${i}`} 
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-full bg-red-500 rounded-lg"></div>
            )}
          </div>
          
          {/* Face arrière de la carte */}
          <div className="absolute w-full h-full bg-blue-500 rounded-lg backface-hidden rotate-y-180">
            {card.backImage ? (
              <img 
                src={card.backImage} 
                alt={`Back of card ${i}`} 
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-full rounded-lg flex items-center justify-center">
                {card.backContent || ""}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardDistribution;