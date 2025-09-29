import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import reviewsData from '../data/reviews.json';
import "../styles/Reviews.css";

export default function ReviewsSection() {
    const reviewItems = reviewsData.reviews;
    const [isPaused, setIsPaused] = useState(false);
    const scrollRef = useRef(null);
    const animationRef = useRef(null);
    const scrollPositionRef = useRef(0);

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={`star ${i < rating ? 'filled' : ''}`}>
                ⭐
            </span>
        ));
    };

    const duplicatedReviews = [...reviewItems, ...reviewItems, ...reviewItems, ...reviewItems];

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        const scrollSpeed = 0.5;
        const cardWidth = 380 + 32; // largeur de carte + gap (2rem = 32px)
        const resetPoint = reviewItems.length * cardWidth;

        const scroll = () => {
            if (!isPaused && scrollContainer) {
                scrollPositionRef.current += scrollSpeed;

                if (scrollPositionRef.current >= resetPoint) {
                    scrollPositionRef.current -= resetPoint;
                }

                scrollContainer.style.transform = `translateX(-${scrollPositionRef.current}px)`;
            }

            animationRef.current = requestAnimationFrame(scroll);
        };

        animationRef.current = requestAnimationFrame(scroll);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isPaused, reviewItems.length]);

    return (
        <motion.section
            className="reviews-section"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
        >
            <div className="container-carousel">
                <h3 className="section-title">Avis Clients</h3>

                <div className="carousel-wrapper">
                    <div
                        className="carousel-track"
                        ref={scrollRef}
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                    >
                        {duplicatedReviews.map((review, index) => (
                            <div
                                key={`${review.id}-${index}`}
                                className="review-card-carousel"
                            >
                                <div className="review-header">
                                    <div className="client-info">
                                        <h4 className="client-name">{review.clientName}</h4>
                                        <div className="rating">
                                            {renderStars(review.rating)}
                                        </div>
                                    </div>
                                    <div className="tattoo-style">{review.tattooStyle}</div>
                                </div>
                                <p className="review-comment">{review.comment}</p>
                                <div className="review-footer">
                                    <span className="review-date">
                                        {new Date(review.date).toLocaleDateString('fr-FR')}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="carousel-hint">
                    <span>← Défilement automatique • Survolez pour mettre en pause →</span>
                </div>
            </div>
        </motion.section>
    );
}