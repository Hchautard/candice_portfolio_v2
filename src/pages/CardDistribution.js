import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import '../styles/CardDistribution.css';

// Espace entre deux cartes (la taille des cartes, elle, est mesurée : elle change selon l'écran)
const GAP_X = 60;
const GAP_Y = 36;
const MAX_PER_ROW = 4;

const prefersReducedMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

// Largeur utile du conteneur : les cartes en position absolue partent du bord intérieur (hors padding)
const contentWidth = (el) => {
  const style = getComputedStyle(el);
  return el.clientWidth - Number.parseFloat(style.paddingLeft) - Number.parseFloat(style.paddingRight);
};

const CardDistribution = ({ cards = [] }) => {
  const cardsRef = useRef([]);
  const containerRef = useRef(null);
  const hasLaidOutRef = useRef(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState('auto');
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [flippedCards, setFlippedCards] = useState(new Set());

  // Largeur mesurée avant le premier affichage, puis suivie à chaque redimensionnement
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    setContainerWidth(contentWidth(container));
    const observer = new ResizeObserver(() => setContainerWidth(contentWidth(container)));
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const firstCard = cardsRef.current.find(Boolean);
    if (!containerWidth || !container || !firstCard) return;

    const cardWidth = firstCard.offsetWidth;
    const cardHeight = firstCard.offsetHeight;
    const spacingX = cardWidth + GAP_X;
    const spacingY = cardHeight + GAP_Y;

    // n cartes occupent (n - 1) espacements + une largeur de carte : aucune ne dépasse du conteneur
    const perRow = Math.min(MAX_PER_ROW, Math.max(1, Math.floor((containerWidth - cardWidth) / spacingX) + 1));
    const rowWidth = (perRow - 1) * spacingX + cardWidth;
    const offsetX = Math.max(0, (containerWidth - rowWidth) / 2);

    const isFirstLayout = !hasLaidOutRef.current;
    hasLaidOutRef.current = true;
    const reduceMotion = prefersReducedMotion();
    const containerTop = container.getBoundingClientRect().top;
    let maxBottom = 0;

    cardsRef.current.forEach((card, index) => {
      if (!card) return;

      const x = offsetX + (index % perRow) * spacingX;
      const y = Math.floor(index / perRow) * spacingY;
      maxBottom = Math.max(maxBottom, y + cardHeight);

      // Au premier placement, seules les cartes visibles sont distribuées depuis le paquet.
      // Les autres sont posées directement, avant l'affichage : elles ne passent jamais à l'écran,
      // donc le lazy-loading de leur image fonctionne (sinon les ~40 flashs se chargent d'un coup).
      const top = containerTop + y;
      const visible = top < window.innerHeight && top + cardHeight > 0;

      if (reduceMotion || (isFirstLayout && !visible)) {
        gsap.set(card, { x, y, rotation: 0 });
      } else {
        gsap.to(card, { x, y, rotation: 0, duration: 0.5 + index * 0.05, ease: "power2.out" });
      }
    });

    setContainerHeight(maxBottom + 50);
  }, [containerWidth, cards.length]);

  const flipCard = (index) => {
    if (!cardsRef.current[index]) return;

    const isFlipped = flippedCards.has(index);

    gsap.to(cardsRef.current[index], {
      rotationY: isFlipped ? 0 : 180,
      duration: prefersReducedMotion() ? 0 : 0.5,
      ease: "power2.out",
    });

    setFlippedCards(prev => {
      const next = new Set(prev);
      if (isFlipped) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
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
            minHeight: containerHeight === 'auto' ? '100vh' : undefined
          }}
          id="card-distribution-container"
      >
        {cardItems.map((card, i) => (
            <div
                key={card.id || i}
                ref={(el) => (cardsRef.current[i] = el)}
                className="absolute rounded-lg shadow-lg cursor-pointer perspective-500 transform-style-preserve-3d
                     w-64 h-80 md:w-80 md:h-96"
                onClick={() => flipCard(i)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    flipCard(i);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-pressed={flippedCards.has(i)}
                aria-label={card.name ? `Retourner la carte « ${card.name} »` : `Retourner la carte ${i + 1}`}
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
                          alt=""
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
                        alt=""
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