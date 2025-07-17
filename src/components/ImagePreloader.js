import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/ImagePreloader.css';

// Import de toutes les images
// Images tattoo
import tattoo1 from "../assets/images/tattoo/1.png";
import tattoo2 from "../assets/images/tattoo/2.png";
import tattoo3 from "../assets/images/tattoo/3.png";
import tattoo4 from "../assets/images/tattoo/4.png";
import tattoo5 from "../assets/images/tattoo/5.png";
import tattoo6 from "../assets/images/tattoo/6.png";
import tattoo7 from "../assets/images/tattoo/7.png";
import tattoo8 from "../assets/images/tattoo/8.png";

// Images makeup
import flora1 from "../assets/images/makeup/flora_1.png";
import flora2 from "../assets/images/makeup/flora_2.png";
import mira1 from "../assets/images/makeup/mira_1.png";
import karole1 from "../assets/images/makeup/karole_1.png";
import karole2 from "../assets/images/makeup/karole_2.png";
import alice1 from "../assets/images/makeup/alice_1.png";
import song1 from "../assets/images/makeup/song_1.png";
import candice1 from "../assets/images/makeup/candice_1.jpg";
import karole3 from "../assets/images/makeup/karole_3.png";
import perles1 from "../assets/images/makeup/perles_1.png";
import carte1 from "../assets/images/makeup/carte_1.png";
import ziggy1 from "../assets/images/makeup/ziggy_1.png";
import hematome1 from "../assets/images/makeup/hematome_1.png";

const ImagePreloader = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showLoader, setShowLoader] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const location = useLocation();

  // Images essentielles à précharger au premier chargement
  const essentialImages = [
    // Quelques images de chaque section pour un chargement initial rapide
    tattoo1, tattoo2, flora1, alice1, karole1
  ];

  // Images par route
  const imagesByRoute = {
    '/tattoo': [tattoo1, tattoo2, tattoo3, tattoo4, tattoo5, tattoo6, tattoo7, tattoo8],
    '/makeup': [flora1, flora2, mira1, karole1, karole2, alice1, song1, candice1, karole3, perles1, carte1, ziggy1, hematome1],
  };

  useEffect(() => {
    // Vérifier si c'est la première visite
    const hasVisited = sessionStorage.getItem('hasVisited');
    
    if (hasVisited) {
      // Si déjà visité, pas de loader principal
      setInitialLoad(false);
      setLoading(false);
      setShowLoader(false);
      
      // Précharger les images de la route actuelle en arrière-plan
      const routeImages = imagesByRoute[location.pathname] || [];
      if (routeImages.length > 0) {
        preloadImagesInBackground(routeImages);
      }
      return;
    }

    // Première visite : précharger les images essentielles
    let loadedCount = 0;

    const preloadImages = async (images) => {
      const imagePromises = images.map((src) => {
        return new Promise((resolve) => {
          const img = new Image();
          
          img.onload = () => {
            loadedCount++;
            const progress = Math.round((loadedCount / images.length) * 100);
            setLoadingProgress(progress);
            resolve();
          };
          
          img.onerror = () => {
            console.warn(`Impossible de charger l'image: ${src}`);
            loadedCount++;
            const progress = Math.round((loadedCount / images.length) * 100);
            setLoadingProgress(progress);
            resolve();
          };
          
          img.src = src;
        });
      });

      try {
        await Promise.all(imagePromises);
        
        // Marquer comme visité
        sessionStorage.setItem('hasVisited', 'true');
        
        // Animation de sortie
        setTimeout(() => {
          setLoading(false);
          setTimeout(() => {
            setShowLoader(false);
            setInitialLoad(false);
          }, 500);
        }, 800);
        
      } catch (error) {
        console.error('Erreur lors du préchargement:', error);
        setLoading(false);
        setShowLoader(false);
        setInitialLoad(false);
      }
    };

    preloadImages(essentialImages);
  }, []);

  // Fonction pour précharger en arrière-plan sans bloquer
  const preloadImagesInBackground = (images) => {
    images.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  };

  // Précharger les images de la route actuelle quand on change de page
  useEffect(() => {
    if (!initialLoad) {
      const routeImages = imagesByRoute[location.pathname] || [];
      if (routeImages.length > 0) {
        preloadImagesInBackground(routeImages);
      }
    }
  }, [location.pathname, initialLoad]);

  // Si ce n'est pas le chargement initial ou si le loader ne doit pas être affiché
  if (!showLoader || !initialLoad) {
    return children;
  }

  return (
    <>
      <div className={`preloader-container ${!loading ? 'fade-out' : ''}`}>
        <div className="preloader-content">
          {/* Logo animé */}
          <h1 className="preloader-title">L'Anomalie</h1>
          
          {/* Animation SVG */}
          <div className="tattoo-machine-loader">
            <svg width="100" height="100" viewBox="0 0 100 100">
              {/* Cercle de fond */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#333"
                strokeWidth="2"
                opacity="0.3"
              />
              
              {/* Cercle de progression */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#ff6b6b"
                strokeWidth="3"
                strokeDasharray={`${251 * (loadingProgress / 100)} 251`}
                transform="rotate(-90 50 50)"
                className="progress-circle"
              />
              
              {/* Symbole central */}
              <g transform="translate(50, 50)">
                <path
                  d="M-15,-8 L-15,8 L-8,15 L8,15 L15,8 L15,-8 L8,-15 L-8,-15 Z"
                  fill="#333"
                  className="machine-icon"
                />
                <circle cx="0" cy="0" r="4" fill="#ff6b6b" className="machine-needle" />
              </g>
            </svg>
          </div>
          
          {/* Barre de progression */}
          <div className="progress-bar-container">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <span className="progress-text">{loadingProgress}%</span>
          </div>
          
          {/* Message de chargement */}
          <p className="loading-message">
            Chargement en cours...
          </p>
        </div>
      </div>
      
      {/* Contenu principal */}
      <div className={`main-content ${loading && initialLoad ? 'hidden' : 'visible'}`}>
        {children}
      </div>
    </>
  );
};

export default ImagePreloader;