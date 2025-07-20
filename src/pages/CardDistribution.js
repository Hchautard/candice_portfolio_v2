import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import '../styles/CardDistribution.css';

const CardDistribution = ({ cards = [] }) => {
  const cardsRef = useRef([]);
  const containerRef = useRef(null);
  const [cardsPerRow, setCardsPerRow] = useState(5);
  const [containerHeight, setContainerHeight] = useState('auto');
  const [loadedImages, setLoadedImages] = useState(new Set());

  useEffect(() => {
    // Met à jour le nombre de cartes par ligne selon la largeur du conteneur
    const updateCardsPerRow = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const cardWidth = window.innerWidth <= 768 ? 280 : 330;
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
    const cardSpacingX = isMobile ? 380 : 380;
    const cardSpacingY = isMobile ? 420 : 420;
    const cardHeight = isMobile ? 340 : 340;

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

      const cardBottom = (row + 1) * cardSpacingY + cardHeight;
      if (cardBottom > maxHeight) {
        maxHeight = cardBottom;
      }
    });

    setContainerHeight(maxHeight + 50);

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

  // Gestion du chargement des images
  const handleImageLoad = (cardId) => {
    setLoadedImages(prev => new Set([...prev, cardId]));
  };

  const handleImageError = (cardId) => {
    console.error(`Erreur de chargement pour l'image ${cardId}`);
  };

  const cardItems = cards.length > 0 ? cards : [...Array(20)].map((_, i) => ({ id: i }));

  return (
      <div
          ref={containerRef}
          className="relative p-4 overflow-visible"
          style={{
            height: `${containerHeight}px`,
            minHeight: '100vh'
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
                {card.imageSrc ? (
                    <div className="relative w-full h-full">
                      {!loadedImages.has(card.id) && (
                          <div className="absolute inset-0 bg-gray-300 rounded-lg flex items-center justify-center">
                            <div className="animate-pulse">Chargement...</div>
                          </div>
                      )}
                      <img
                          src={card.imageSrc}
                          alt={card.alt || `Card ${i}`}
                          className={`w-full h-full object-cover rounded-lg transition-opacity duration-300 ${
                              loadedImages.has(card.id) ? 'opacity-100' : 'opacity-0'
                          }`}
                          loading="lazy" // Lazy loading natif
                          onLoad={() => handleImageLoad(card.id)}
                          onError={() => handleImageError(card.id)}
                      />
                    </div>
                ) : card.image ? (
                    <img
                        src={card.image}
                        alt={card.alt || `Card ${i}`}
                        className="w-full h-full object-cover rounded-lg"
                        loading="lazy"
                        onLoad={() => handleImageLoad(card.id)}
                        onError={() => handleImageError(card.id)}
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
                        loading="lazy"
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