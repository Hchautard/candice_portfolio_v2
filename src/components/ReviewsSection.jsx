import { motion, useReducedMotion } from "motion/react";
import { useState, useEffect, useRef } from "react";
import "../styles/Reviews.css";
import { useData } from '../contexts/DataContext';
import Spinner from './Spinner';

// Copies de la liste mises bout à bout pour que le défilement en boucle ne laisse jamais de vide
const COPIES = 4;
const SPEED = 0.5; // px par frame

const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
        <span key={i} aria-hidden="true" className={`star ${i < rating ? 'filled' : ''}`}>
            ★
        </span>
    ));
};

export default function ReviewsSection() {
    const { reviews, loading, error } = useData();
    const reduceMotion = useReducedMotion();
    const [isPausedByUser, setIsPausedByUser] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const wrapperRef = useRef(null);
    const trackRef = useRef(null);
    const positionRef = useRef(0);

    // Mouvement réduit demandé : pas de défilement automatique, la rangée se fait défiler à la main
    const autoScroll = !reduceMotion && reviews.length > 0;
    const isRunning = autoScroll && isVisible && !isPausedByUser && !isHovered;

    // Pas d'animation tant que la section est hors écran
    useEffect(() => {
        const wrapper = wrapperRef.current;
        if (!wrapper || !autoScroll) return;

        const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting));
        observer.observe(wrapper);
        return () => observer.disconnect();
    }, [autoScroll, loading]);

    useEffect(() => {
        const track = trackRef.current;
        if (!track || !isRunning) return;

        // Largeur d'une copie de la liste, mesurée : les cartes sont plus étroites sur mobile
        const loopWidth = track.children[reviews.length].offsetLeft - track.children[0].offsetLeft;
        let frame;

        const step = () => {
            positionRef.current = (positionRef.current + SPEED) % loopWidth;
            track.style.transform = `translateX(-${positionRef.current}px)`;
            frame = requestAnimationFrame(step);
        };

        frame = requestAnimationFrame(step);
        return () => cancelAnimationFrame(frame);
    }, [isRunning, reviews.length]);

    if (loading) return <Spinner />;
    if (error || reviews.length === 0) return null;

    const copies = autoScroll ? COPIES : 1;
    const items = Array.from({ length: copies }, (_, copy) => reviews.map((review) => ({ review, copy }))).flat();

    return (
        <motion.section
            className="reviews-section"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
        >
            <div className="container-carousel">
                <h2 className="section-title">Avis Clients</h2>

                <div className="carousel-wrapper" ref={wrapperRef}>
                    <div
                        className={`carousel-track ${autoScroll ? '' : 'carousel-track--manual'}`}
                        ref={trackRef}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        // Défilement manuel : la rangée doit pouvoir recevoir le focus pour défiler au clavier
                        {...(autoScroll ? {} : { tabIndex: 0, role: 'region', 'aria-label': 'Avis clients' })}
                    >
                        {items.map(({ review, copy }) => (
                            <div
                                key={`${review.id}-${copy}`}
                                className="review-card-carousel"
                                // Les copies ne servent qu'à la boucle visuelle : un lecteur d'écran ne lit chaque avis qu'une fois
                                aria-hidden={copy > 0 ? 'true' : undefined}
                            >
                                <div className="review-header">
                                    <div className="client-info">
                                        <h3 className="client-name">{review.author}</h3>
                                        <div className="rating" role="img" aria-label={`Note : ${review.rating} sur 5`}>
                                            {renderStars(review.rating)}
                                        </div>
                                    </div>
                                    <div className="tattoo-style">{review.tattoo_style}</div>
                                </div>
                                <p className="review-comment">{review.comment}</p>
                                <div className="review-footer">
                                    <span className="review-date">
                                        {new Date(review.created_at).toLocaleDateString('fr-FR')}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="carousel-hint">
                    {autoScroll ? (
                        <button
                            type="button"
                            className="carousel-toggle"
                            onClick={() => setIsPausedByUser((paused) => !paused)}
                        >
                            {isPausedByUser ? 'Reprendre le défilement' : 'Mettre en pause le défilement'}
                        </button>
                    ) : (
                        <span>Faites défiler la rangée pour lire tous les avis</span>
                    )}
                </div>
            </div>
        </motion.section>
    );
}
