import { useState } from "react";
import Modal from "react-modal";
import "../../styles/NewsCard.css";
import "../../styles/NewsModal.css";

Modal.setAppElement("#root");

export default function NewsCard({ title, description, date, category, content, location }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className="news-card-shop" onClick={() => setIsOpen(true)}>
                <div className="news-header-shop">
                    <div className="news-category-shop">{category}</div>
                    <span className="news-date-shop">{date} &nbsp;|&nbsp; {location}</span>
                </div>
                <h4 className="news-title-shop">{title}</h4>
                <p className="news-description-shop">{description}</p>
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
                        <span className="news-category-shop">{category}</span>
                        <span className="news-modal-date-loc">{date}
                            &nbsp;|&nbsp;
                        {location}</span>
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