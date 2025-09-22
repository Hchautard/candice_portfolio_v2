
// Composant pour les news défilantes
import {useNavigate} from "react-router-dom";
import {motion} from "framer-motion";

export default function ReviewsSection() {
    const navigate = useNavigate();

    // Données de news simulées - remplacez par vos vraies données
    const newsItems = [
        {
            id: 1,
            title: "Nouveaux flashs Cyber Sigilism disponibles",
            description: "Venez vous découvrir mes derniers flashs",
            date: "2024-12-15",
            category: "Tatouage"
        },
        {
            id: 2,
            title: "Atelier Dark Fantasy - Places limitées",
            description: "Réservez votre session pour un tatouage unique",
            date: "2024-12-10",
            category: "Événement"
        },
        {
            id: 3,
            title: "Collaboration avec des artistes locaux",
            description: "Nouveaux partenariats pour des créations exclusives",
            date: "2024-12-05",
            category: "Partenariat"
        }
    ];

    const handleNewsClick = (newsItem) => {
        // Redirection vers la page shop avec l'ID de la news
        navigate(`/project?news=${newsItem.id}`);
    };

    return (
        <motion.section
            className="news-section"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
        >
            <div className="container mx-auto px-4">
                <h3 className="section-title">Avis</h3>
                <div className="news-grid">
                    {newsItems.map((news, index) => (
                        <motion.div
                            key={news.id}
                            className="news-card"
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            onClick={() => handleNewsClick(news)}
                            whileHover={{ scale: 1.02, y: -5 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="news-category">{news.category}</div>
                            <h4 className="news-title">{news.title}</h4>
                            <p className="news-description">{news.description}</p>
                            <div className="news-footer">
                                <span className="news-date">{new Date(news.date).toLocaleDateString('fr-FR')}</span>
                                <span className="news-arrow">→</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.section>
    );
}