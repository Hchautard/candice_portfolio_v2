import { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import InstagramIcon from './InstagramIcon';
import { INSTAGRAM } from '../data/social';
import '../styles/Header.css';

const LINKS = [
    { to: '/', label: 'Accueil', end: true },
    { to: '/project', label: 'Le salon' },
    { to: '/tattoo', label: 'Tattoo' },
    { to: '/makeup', label: 'Makeup' },
    { to: '/contact', label: 'Contact' },
];

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const burgerRef = useRef(null);
    const navRef = useRef(null);
    const { pathname } = useLocation();

    const closeMenu = () => setIsMenuOpen(false);

    // Fermer le menu à chaque changement de page (lien, retour arrière du navigateur)
    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    // Bloquer le scroll de la page sous le menu, sans la renvoyer en haut :
    // body en position fixe décalé de la position courante, restaurée à la fermeture
    // (sauf si on a changé de page entre-temps, la nouvelle page commence alors en haut).
    useEffect(() => {
        if (!isMenuOpen) return undefined;

        const { body } = document;
        const scrollY = window.scrollY;
        const lockedPath = window.location.pathname;
        body.style.position = 'fixed';
        body.style.top = `-${scrollY}px`;
        body.style.width = '100%';
        body.style.overflow = 'hidden';

        return () => {
            body.style.position = '';
            body.style.top = '';
            body.style.width = '';
            body.style.overflow = '';
            if (window.location.pathname === lockedPath) window.scrollTo(0, scrollY);
        };
    }, [isMenuOpen]);

    // Menu ouvert : Échap le ferme (le focus revient sur le bouton),
    // Tab reste dans le menu (bouton + liens) au lieu de partir dans la page masquée.
    useEffect(() => {
        if (!isMenuOpen) return undefined;

        const onKeyDown = (event) => {
            if (event.key === 'Escape') {
                setIsMenuOpen(false);
                burgerRef.current?.focus();
                return;
            }
            if (event.key !== 'Tab' || !navRef.current) return;

            const focusables = [burgerRef.current, ...navRef.current.querySelectorAll('a')];
            const first = focusables[0];
            const last = focusables.at(-1);
            const inside = focusables.includes(document.activeElement);

            if (event.shiftKey && (document.activeElement === first || !inside)) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && (document.activeElement === last || !inside)) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [isMenuOpen]);

    // Fermer le menu quand on repasse en affichage bureau
    useEffect(() => {
        const desktop = window.matchMedia('(min-width: 769px)');
        const onChange = (event) => {
            if (event.matches) setIsMenuOpen(false);
        };
        desktop.addEventListener('change', onChange);
        return () => desktop.removeEventListener('change', onChange);
    }, []);

    return (
        <header className="Header">
            {/* Bouton burger (visible uniquement sur mobile) */}
            <button
                ref={burgerRef}
                type="button"
                className="burger-button"
                onClick={() => setIsMenuOpen((open) => !open)}
                aria-label="Menu"
                aria-expanded={isMenuOpen}
                aria-controls="main-nav"
            >
                <span className={`burger-line ${isMenuOpen ? 'open' : ''}`}></span>
                <span className={`burger-line ${isMenuOpen ? 'open' : ''}`}></span>
                <span className={`burger-line ${isMenuOpen ? 'open' : ''}`}></span>
            </button>

            {/* Navigation : NavLink ajoute la classe "active" et aria-current="page" sur la page courante */}
            <nav
                ref={navRef}
                id="main-nav"
                aria-label="Navigation principale"
                className={`navbar navbar-expand-lg ${isMenuOpen ? 'menu-open' : ''}`}
            >
                <div className="flex justify-center items-center gap-x-4 text-align-center">
                    {LINKS.map(({ to, label, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            className="block header-link rounded-lg px-3 py-2 text-base"
                            onClick={closeMenu}
                        >
                            {label}
                        </NavLink>
                    ))}
                    {/* Instagram, canal principal : pictogramme sur bureau, pictogramme + pseudo dans le menu mobile */}
                    <a
                        className="header-instagram"
                        href={INSTAGRAM.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={closeMenu}
                    >
                        <InstagramIcon size={20} />
                        <span className="header-instagram-label">{INSTAGRAM.handle}</span>
                        <span className="sr-only"> sur Instagram (nouvel onglet)</span>
                    </a>
                </div>
            </nav>

            {/* Overlay pour fermer le menu en cliquant à côté */}
            <div
                className={`menu-overlay ${isMenuOpen ? 'active' : ''}`}
                onClick={closeMenu}
                aria-hidden="true"
            ></div>
        </header>
    );
}
