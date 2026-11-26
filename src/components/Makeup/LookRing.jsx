import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import LazyImage from '../LazyImage';
import { fullTitle, lookShape, photosLabel } from './look';

gsap.registerPlugin(CustomEase);

// Carrousel en cylindre : une carte par look, posées en cercle et vues depuis le centre.
// Le défilement de la page fait tourner le cylindre (section haute, scène collante) et s'arrête
// sur un look ; on peut aussi le faire tourner en glissant, avec les flèches et au clavier.
// La géométrie (taille des cartes, rayon, perspective) est en CSS (Makeup.css) ; ici, la rotation.

// --ease-in-out de index.css : passage d'un look à l'autre (déplacement à l'écran)
const EASE_IN_OUT = CustomEase.create('makeup-turn', '0.77,0,0.175,1');
// Durée d'un passage d'un look à l'autre (flèches, clavier, clic, arrêt après un défilement)
const TURN_DURATION = 0.5;
// Pause du défilement (ms) après laquelle le cylindre se cale sur un look
const SETTLE_DELAY = 150;
// Au-delà, une carte est masquée : hors de l'écran, ou derrière le visiteur, où le navigateur
// la dessinerait démesurée
const MAX_VISIBLE_ANGLE = 60;
// Photos chargées de part et d'autre du look affiché : les voisines sont prêtes avant d'arriver
const PRELOAD_DISTANCE = 2;
// Déplacement du pointeur à partir duquel un appui devient un glisser (en deçà : un clic)
const DRAG_THRESHOLD = 6;

// Largeur affichée d'une carte, pour choisir la version de la photo (srcset) : même calcul que
// --card-w dans Makeup.css (les cartes voisines, vues de biais, paraissent un peu plus larges)
const CARD_SIZES = 'min(43.5vh, 465px, 78vw)';

/** Écart signé entre la carte i et la position pos, sur un anneau fermé de count cartes */
function ringOffset(i, pos, count) {
    const d = (((i - pos) % count) + count) % count;
    return d > count / 2 ? d - count : d;
}

/** Looks à moins de PRELOAD_DISTANCE cartes de index */
function nearby(index, count) {
    const result = [];
    for (let d = -PRELOAD_DISTANCE; d <= PRELOAD_DISTANCE; d++) result.push((((index + d) % count) + count) % count);
    return result;
}

const pad = (n) => String(n).padStart(2, '0');

LookRing.propTypes = {
    looks: PropTypes.arrayOf(lookShape).isRequired,
    onOpen: PropTypes.func.isRequired,
};

export default function LookRing({ looks, onOpen }) {
    const count = looks.length;
    const step = 360 / count;

    const [active, setActive] = useState(0);
    const [loaded, setLoaded] = useState(() => new Set(nearby(0, count)));

    const sectionRef = useRef(null);
    const cardRefs = useRef([]);
    const visibleRef = useRef([]);
    const activeRef = useRef(0);
    const turnRef = useRef(null);
    const dragRef = useRef(null);
    const draggedRef = useRef(false);
    // Doigt ou bouton de souris appuyé : le visiteur tient le défilement, le cylindre attend
    const pressedRef = useRef(false);
    // Sens du dernier défilement (1 : vers les looks suivants, -1 : vers les précédents)
    const directionRef = useRef(0);

    // Position du cylindre (en looks, décimale pendant la rotation) → transformation de chaque
    // carte : elle tourne autour du visiteur, au centre du cylindre, à un rayon de distance.
    // Pas de transformation sur le cylindre lui-même : placé à l'endroit du regard, il rendait
    // les cartes inaccessibles au clic dans Chromium.
    const render = useCallback((pos) => {
        cardRefs.current.forEach((card, i) => {
            if (!card) return;
            const angle = ringOffset(i, pos, count) * step;
            const visible = Math.abs(angle) <= MAX_VISIBLE_ANGLE;
            if (visible) {
                card.style.transform = `translateZ(var(--radius)) rotateY(${(-angle).toFixed(3)}deg) translateZ(calc(var(--radius) * -1))`;
            }
            if (visibleRef.current[i] !== visible) {
                visibleRef.current[i] = visible;
                card.style.visibility = visible ? 'visible' : 'hidden';
            }
        });
        const index = Math.min(count - 1, Math.max(0, Math.round(pos)));
        if (index !== activeRef.current) {
            activeRef.current = index;
            setActive(index);
        }
    }, [count, step]);

    // La section fait défiler la scène collante sur sa hauteur moins celle de l'écran, répartie
    // également entre les looks : position de la page où chaque look est de face.
    const geometry = useCallback(() => {
        const section = sectionRef.current;
        const top = section.getBoundingClientRect().top + window.scrollY;
        const travel = Math.max(0, section.offsetHeight - window.innerHeight);
        return { top, perLook: count > 1 ? travel / (count - 1) : 0 };
    }, [count]);

    const positionFromScroll = useCallback(() => {
        const { top, perLook } = geometry();
        return perLook ? Math.min(count - 1, Math.max(0, (window.scrollY - top) / perLook)) : 0;
    }, [count, geometry]);

    // Tourne jusqu'au look index en faisant défiler la page jusqu'à sa position
    const turnTo = useCallback((index, { focus = false } = {}) => {
        if (count < 2) return;
        const target = Math.min(count - 1, Math.max(0, index));
        const { top, perLook } = geometry();
        const scroll = { y: window.scrollY };

        turnRef.current?.kill();
        turnRef.current = gsap.to(scroll, {
            y: top + target * perLook,
            duration: TURN_DURATION,
            ease: EASE_IN_OUT,
            onUpdate: () => window.scrollTo(0, scroll.y),
            onComplete: () => focus && cardRefs.current[target]?.focus({ preventScroll: true }),
        });
    }, [count, geometry]);

    // Le défilement de la page fait tourner le cylindre, sans retard (glisser reste collé au
    // doigt, et la molette est déjà adoucie par le navigateur). Quand il s'arrête entre deux
    // looks, le cylindre finit de tourner jusqu'au suivant dans le sens du défilement : un petit
    // coup de molette suffit à changer de look, sans en sauter.
    useLayoutEffect(() => {
        let frame = 0;
        let settleTimer = 0;
        let lastPos = positionFromScroll();

        const settle = () => {
            if (pressedRef.current || turnRef.current?.isActive()) return;
            const pos = positionFromScroll();
            if (Math.abs(pos - Math.round(pos)) < 0.01) return;
            const direction = directionRef.current;
            turnTo(direction > 0 ? Math.ceil(pos) : direction < 0 ? Math.floor(pos) : Math.round(pos));
        };
        const scheduleSettle = () => {
            clearTimeout(settleTimer);
            settleTimer = setTimeout(settle, SETTLE_DELAY);
        };

        const update = () => {
            frame = 0;
            const pos = positionFromScroll();
            if (pos !== lastPos) directionRef.current = Math.sign(pos - lastPos);
            lastPos = pos;
            render(pos);
            scheduleSettle();
        };
        const onScroll = () => {
            frame ||= requestAnimationFrame(update);
        };

        // Toute action du visiteur interrompt une rotation en cours. Les doigts sont suivis par
        // touchstart/touchend : le navigateur annule le pointeur dès qu'il fait défiler la page.
        const press = () => {
            pressedRef.current = true;
            turnRef.current?.kill();
        };
        const release = () => {
            pressedRef.current = false;
            scheduleSettle();
        };
        const onPointerDown = (event) => event.pointerType !== 'touch' && press();
        const onPointerUp = (event) => event.pointerType !== 'touch' && release();
        const onTouchEnd = (event) => event.touches.length === 0 && release();
        const onWheel = () => turnRef.current?.kill();

        const listeners = [
            ['scroll', onScroll],
            ['resize', onScroll],
            ['wheel', onWheel],
            ['pointerdown', onPointerDown],
            ['pointerup', onPointerUp],
            ['pointercancel', onPointerUp],
            ['touchstart', press],
            ['touchend', onTouchEnd],
            ['touchcancel', onTouchEnd],
        ];
        listeners.forEach(([type, listener]) => window.addEventListener(type, listener, { passive: true }));
        render(lastPos);

        return () => {
            listeners.forEach(([type, listener]) => window.removeEventListener(type, listener));
            cancelAnimationFrame(frame);
            clearTimeout(settleTimer);
            turnRef.current?.kill();
        };
    }, [positionFromScroll, render, turnTo]);

    // Photos du look affiché et de ses voisins, gardées une fois chargées
    useEffect(() => {
        setLoaded((previous) => {
            const missing = nearby(active, count).filter((i) => !previous.has(i));
            return missing.length ? new Set([...previous, ...missing]) : previous;
        });
    }, [active, count]);

    const onCardClick = (index) => {
        if (index === activeRef.current) onOpen(looks[index]);
        else turnTo(index);
    };

    const onKeyDown = (event) => {
        const targets = { ArrowLeft: activeRef.current - 1, ArrowRight: activeRef.current + 1, Home: 0, End: count - 1 };
        if (!(event.key in targets)) return;
        event.preventDefault();
        turnTo(targets[event.key], { focus: true });
    };

    // Glisser horizontalement fait défiler la page : la rotation et l'arrêt sur un look restent
    // ceux du défilement. Une largeur de carte glissée = un look. Le geste vertical reste au
    // navigateur (touch-action: pan-y dans Makeup.css).
    const onPointerDown = (event) => {
        if (!event.isPrimary || event.button !== 0) return;
        dragRef.current = { x: event.clientX, y: event.clientY, scroll: window.scrollY, dragging: false };
        draggedRef.current = false;
    };

    const onPointerMove = (event) => {
        const drag = dragRef.current;
        if (!drag || count < 2) return;
        const dx = event.clientX - drag.x;

        if (!drag.dragging) {
            if (Math.abs(dx) < DRAG_THRESHOLD) return;
            if (Math.abs(event.clientY - drag.y) > Math.abs(dx)) {
                dragRef.current = null;
                return;
            }
            drag.dragging = true;
            draggedRef.current = true;
            event.currentTarget.setPointerCapture(event.pointerId);
        }

        const cardWidth = cardRefs.current[activeRef.current]?.offsetWidth || 300;
        window.scrollTo(0, drag.scroll - (dx / cardWidth) * geometry().perLook);
    };

    const onPointerEnd = () => {
        dragRef.current = null;
    };

    // Après un glisser, le relâchement n'est pas un clic sur la carte
    const onClickCapture = (event) => {
        if (!draggedRef.current) return;
        draggedRef.current = false;
        event.preventDefault();
        event.stopPropagation();
    };

    const current = looks[active];

    return (
        <section
            ref={sectionRef}
            className="look-ring"
            style={{ '--count': count }}
            aria-roledescription="carrousel"
            aria-label="Looks maquillage"
        >
            <div className="look-ring__stage">
                <div
                    className="look-ring__viewport"
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerEnd}
                    onPointerCancel={onPointerEnd}
                    onClickCapture={onClickCapture}
                    onDragStart={(event) => event.preventDefault()}
                    onKeyDown={onKeyDown}
                >
                    <div className="look-ring__cylinder">
                        {looks.map((look, i) => {
                            const cover = look.photos[0];
                            return (
                                <button
                                    key={look.id}
                                    ref={(el) => { cardRefs.current[i] = el; }}
                                    type="button"
                                    className="look-card"
                                    data-active={i === active || undefined}
                                    tabIndex={i === active ? 0 : -1}
                                    aria-label={i === active
                                        ? `${fullTitle(look)} : ${photosLabel(look).toLowerCase()}`
                                        : `Afficher le look ${fullTitle(look)}`}
                                    onClick={() => onCardClick(i)}
                                >
                                    {loaded.has(i) && (
                                        <LazyImage
                                            src={cover.src}
                                            srcSet={cover.srcSet}
                                            sizes={cover.srcSet && CARD_SIZES}
                                            srcSmall={cover.srcSmall}
                                            alt=""
                                            className="look-card__photo"
                                            style={look.focus ? { objectPosition: look.focus } : undefined}
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="look-ring__caption">
                    <div className="look-titles">
                        {looks.map((look, i) => (
                            <p key={look.id} className="look-title" data-active={i === active || undefined} aria-hidden={i !== active}>
                                {look.series && <span className="look-title__series">{look.series}</span>}
                                <span className="look-title__name">{look.title}</span>
                            </p>
                        ))}
                    </div>

                    <div className="look-ring__controls">
                        <button
                            type="button"
                            className="look-ring__arrow"
                            aria-label="Look précédent"
                            aria-disabled={active === 0}
                            onClick={() => turnTo(active - 1)}
                        >
                            <ArrowIcon direction="left" />
                        </button>
                        <p className="look-ring__counter">
                            <span className="sr-only">Look </span>{pad(active + 1)}<span aria-hidden="true"> / </span><span className="sr-only"> sur </span>{pad(count)}
                        </p>
                        <button
                            type="button"
                            className="look-ring__arrow"
                            aria-label="Look suivant"
                            aria-disabled={active === count - 1}
                            onClick={() => turnTo(active + 1)}
                        >
                            <ArrowIcon direction="right" />
                        </button>
                        <button type="button" className="look-ring__open" onClick={() => onOpen(current)}>
                            {photosLabel(current)}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

ArrowIcon.propTypes = { direction: PropTypes.oneOf(['left', 'right']).isRequired };

function ArrowIcon({ direction }) {
    return (
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
            <path
                d={direction === 'left' ? 'M19 12H5m6-6-6 6 6 6' : 'M5 12h14m-6-6 6 6-6 6'}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
