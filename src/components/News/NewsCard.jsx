import {useState} from "react";
import Modal from "react-modal";
import "../../styles/NewsCard.css";
import "../../styles/NewsModal.css";
import creation from "../../assets/images/news/creation.jpg";
import illustration from "../../assets/images/news/illustration.jpg";
import event from "../../assets/images/news/event.jpg";

export default function NewsCard({title, description, date, category, content, location, context}) {
    const [isOpen, setIsOpen] = useState(false);

    const backgrounds = {
        "Création": creation,
        "Illustration": illustration,
        "Événement": event
    };

    const backgroundImage = backgrounds[category] || creation;

    return (
        <>
            <div className="news-card-shop" onClick={() => setIsOpen(true)}
                 style={{
                     backgroundImage: `url(${backgroundImage})`,
                     backgroundSize: "cover",
                     backgroundPosition: "center",
                     backgroundRepeat: "no-repeat",
                        backgroundBlendMode: "darken",
                        backgroundColor: "rgba(0, 0, 0, 0.6)",

                 }}
            >
                <div className="news-header-shop">
                    {category && context === "grid-shop" &&
                        <div className="news-category-shop">{category}</div>
                    }
                    <span className="news-date-shop">
                        {date}{date && location && <>&nbsp;|&nbsp;{location}</>}
                    </span>
                </div>
                <h4 className="news-title-shop">{title}</h4>
                {context === "grid-shop" &&
                    <p className="news-description-shop">{description}</p>
                }
                <div className="news-footer-shop">
                    <div className="news-arrow-shop">Lire la suite →</div>
                </div>
            </div>

            <Modal
                isOpen={isOpen}
                onRequestClose={() => setIsOpen(false)}
                className="news-modal"
                overlayClassName="news-modal-overlay"
                closeTimeoutMS={300}
            >
                <div className="news-modal-header">
                    <div className="news-modal-meta">
                        {category &&
                        <span className="news-category-shop">{category}</span>
                        }
                        {date &&
                            <span className="news-modal-date-loc">
                                {date}{date && location && <>&nbsp;|&nbsp;{location}</>}
                            </span>
                        }
                    </div>
                    <button className="news-modal-close" onClick={() => setIsOpen(false)}>✕</button>
                </div>

                <h2 className="news-modal-title">{title}</h2>
                <p className="news-modal-description">{description}</p>

                <div className="news-modal-content">
                    {content}
                </div>
            </Modal>
        </>
    );
}