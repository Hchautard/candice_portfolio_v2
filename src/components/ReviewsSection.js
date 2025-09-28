import {motion} from "framer-motion";
import reviewsData from '../data/reviews.json';
import "../styles/Reviews.css";

export default function ReviewsSection() {
    const reviewItems = reviewsData.reviews;

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={`star ${i < rating ? 'filled' : ''}`}>
                ⭐
            </span>
        ));
    };

    return (
        <motion.section
            className="reviews-section"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
        >
            <div className="container mx-auto px-4">
                <h3 className="section-title">Avis Clients</h3>
                <div className="reviews-grid">
                    {reviewItems.map((review, index) => (
                        <motion.div
                            key={review.id}
                            className="review-card"
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{ scale: 1.02, y: -5 }}
                            whileTap={{ scale: 0.98 }}
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
                            <p className="review-comment">"{review.comment}"</p>
                            <div className="review-footer">
                                <span className="review-date">
                                    {new Date(review.date).toLocaleDateString('fr-FR')}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.section>
    );
}