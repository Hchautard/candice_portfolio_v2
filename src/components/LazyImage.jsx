import React, { useState, useEffect } from 'react';
import PropTypes from "prop-types";

LazyImage.propTypes = {
  src: PropTypes.string.isRequired,
  srcSet: PropTypes.string,
  sizes: PropTypes.string,
  srcSmall: PropTypes.string,
  alt: PropTypes.string.isRequired,
  style: PropTypes.object,
  onLoad: PropTypes.func,
  className: PropTypes.string,
};

// Affiche la miniature floue (srcSmall) pendant que la photo se charge, puis la photo nette.
// Avec srcSet/sizes, le préchargement choisit la même version que l'<img> affichée ensuite :
// le navigateur la reprend de son cache au lieu de la télécharger deux fois.
export default function LazyImage({src,
                                    srcSet,
                                    sizes,
                                    srcSmall,
                                    alt,
                                    style,
                                    onLoad,
                                    className
                                  }) {
  // 'loading' → 'loaded', ou 'failed' : on garde alors la miniature
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    setStatus('loading');
    const img = new Image();

    img.onload = () => {
      setStatus('loaded');
      if (onLoad) onLoad();
    };
    img.onerror = () => setStatus('failed');

    // sizes avant srcset, et src en dernier : le choix de la version se fait avec les deux
    if (sizes) img.sizes = sizes;
    if (srcSet) img.srcset = srcSet;
    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, srcSet, sizes, onLoad]);

  const showFull = status === 'loaded' || !srcSmall;

  return (
      <img
          src={showFull ? src : srcSmall}
          srcSet={showFull ? srcSet : undefined}
          sizes={showFull ? sizes : undefined}
          alt={alt}
          style={{
            ...style,
            filter: status === 'loading' && srcSmall ? 'blur(10px)' : 'none',
            transition: 'filter 0.3s ease',
          }}
          className={className}
      />
  );
}
