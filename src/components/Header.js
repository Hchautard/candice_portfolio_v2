import { useState, useEffect } from 'react';
import { Divider } from '@mui/material';
import { Link } from 'react-router-dom'; 
import '../styles/Header.css';
import logo from '../assets/images/logo_anomalie_new.png';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    // Empêcher le scroll quand le menu est ouvert
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
        } else {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
        }

        // Cleanup
        return () => {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
        };
    }, [isMenuOpen]);

    // Fermer le menu lors du changement de taille d'écran
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="Header">
            {/* Bouton burger (visible uniquement sur mobile) */}
            <button 
                className="burger-button"
                onClick={toggleMenu}
                aria-label="Menu"
                aria-expanded={isMenuOpen}
            >
                <span className={`burger-line ${isMenuOpen ? 'open' : ''}`}></span>
                <span className={`burger-line ${isMenuOpen ? 'open' : ''}`}></span>
                <span className={`burger-line ${isMenuOpen ? 'open' : ''}`}></span>
            </button>

            {/* Navigation */}
            <nav className={`navbar navbar-expand-lg ${isMenuOpen ? 'menu-open' : ''}`}>
                <div className="flex justify-center items-center gap-x-4 text-align-center">
                    <Link
                        to="/"
                        className="block header-link rounded-lg px-3 py-2 text-base"
                        onClick={closeMenu}
                    >
                        Accueil
                    </Link>
                    <Link
                        to="/tattoo"
                        className="block header-link rounded-lg px-3 py-2 text-base"
                        onClick={closeMenu}
                    >
                        Tattoo
                    </Link>
                    <Link
                        to="/makeup"
                        className="block header-link rounded-lg px-3 py-2 text-base"
                        onClick={closeMenu}
                    >
                        Makeup
                    </Link>
                    <Link
                        to="/contact"
                        className="block header-link rounded-lg px-3 py-2 text-base"
                        onClick={closeMenu}
                    >
                        Contact
                    </Link>
                </div>
            </nav>

            {/* Overlay pour fermer le menu en cliquant à côté */}
            <div 
                className={`menu-overlay ${isMenuOpen ? 'active' : ''}`} 
                onClick={closeMenu}
                aria-hidden="true"
            ></div>
        </div>
    );
}