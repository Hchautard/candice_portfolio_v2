import { Link } from 'react-router-dom';
import InstagramIcon from './InstagramIcon';
import { INSTAGRAM } from '../data/social';
import '../styles/SiteFooter.css';

// Pied de page commun : chaque page se termine sur Instagram, la ligne d'arrivée du site.
export default function SiteFooter() {
    return (
        <footer className="site-footer">
            <div className="site-footer-inner">
                <div className="site-footer-brand">
                    <p className="site-footer-name">L&apos;Anomalie</p>
                    <p className="site-footer-tagline">
                        Tatouages cyber-sigilism, gothiques et dark fantasy, à Montpellier.
                    </p>
                </div>

                <div className="site-footer-actions">
                    <a className="site-footer-dm" href={INSTAGRAM.dmUrl} target="_blank" rel="noopener noreferrer">
                        <InstagramIcon size={20} />
                        M&apos;écrire sur Instagram
                    </a>
                    <ul className="site-footer-links">
                        <li>
                            <a href={INSTAGRAM.profileUrl} target="_blank" rel="noopener noreferrer">
                                Suivre {INSTAGRAM.handle}
                            </a>
                        </li>
                        <li>
                            <Link to="/contact">Formulaire de demande</Link>
                        </li>
                    </ul>
                </div>
            </div>
            <p className="site-footer-legal">© {new Date().getFullYear()} L&apos;Anomalie · Candice</p>
        </footer>
    );
}
