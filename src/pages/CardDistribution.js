import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import '../styles/CardDistribution.css';

const CardDistribution = ({ cards = [] }) => {
  const cardsRef = useRef([]);
  const containerRef = useRef(null);
  const [cardsPerRow, setCardsPerRow] = useState(5);
  const [containerHeight, setContainerHeight] = useState('auto');

  useEffect(() => {
    // Met à jour le nombre de cartes par ligne selon la largeur du conteneur
    const updateCardsPerRow = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const cardWidth = window.innerWidth <= 768 ? 280 : 330; // Cartes plus petites sur mobile
        const newCardsPerRow = Math.max(1, Math.floor(containerWidth / cardWidth));
        setCardsPerRow(newCardsPerRow);
      }
    };

    updateCardsPerRow();
    window.addEventListener("resize", updateCardsPerRow);
    return () => window.removeEventListener("resize", updateCardsPerRow);
  }, []);

  useEffect(() => {
    let maxHeight = 0;
    const isMobile = window.innerWidth <= 768;
    const cardSpacingX = isMobile ? 380 : 380; // Espacement horizontal réduit sur mobile
    const cardSpacingY = isMobile ? 420 : 420; // Espacement vertical réduit sur mobile
    const cardHeight = isMobile ? 340 : 340; // Hauteur de carte réduite sur mobile
    
    // Calcul de la largeur totale pour centrer les cartes
    const totalWidth = cardsPerRow * cardSpacingX;
    const containerWidth = containerRef.current?.offsetWidth || 0;
    const offsetX = Math.max(0, (containerWidth - totalWidth) / 2);
    
    cardsRef.current.forEach((card, index) => {
      if (!card) return;
      
      const row = Math.floor(index / cardsPerRow);
      const col = index % cardsPerRow;

      gsap.to(card, {
        x: offsetX + col * cardSpacingX,
        y: row * cardSpacingY,
        rotation: Math.random() * 10 - 5,
        duration: 0.5 + index * 0.05,
        ease: "power2.out",
      });
      
      // Calcul de la hauteur maximale nécessaire
      const cardBottom = (row + 1) * cardSpacingY + cardHeight;
      if (cardBottom > maxHeight) {
        maxHeight = cardBottom;
      }
    });
    
    // Met à jour la hauteur du conteneur
    setContainerHeight(maxHeight + 50); // Ajoute un peu d'espace en bas
    
  }, [cardsPerRow, cards.length]);

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
      className="relative p-4 overflow-visible"
      style={{ 
        height: `${containerHeight}px`,
        minHeight: '100vh' // Assure une hauteur minimale
      }}
      id="card-distribution-container"
    >
      {cardItems.map((card, i) => (
        <div
          key={card.id || i}
          ref={(el) => (cardsRef.current[i] = el)}
          className="absolute rounded-lg shadow-lg cursor-pointer perspective-500 transform-style-preserve-3d
                     w-80 h-96 
                     md:w-80 md:h-96 
                     sm:w-64 sm:h-80"
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
          <div className="absolute w-full h-full rounded-lg backface-hidden rotate-y-180 odd-face">
            {card.backImage ? (
              <img 
                src={card.backImage} 
                alt={`Back of card ${i}`} 
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-full rounded-lg flex items-center justify-center odd-face-content">
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