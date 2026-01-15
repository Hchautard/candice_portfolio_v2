import React, { useState, useEffect, useRef } from 'react';

export default function LazyImage({src,
                                    srcSmall,
                                    alt,
                                    style,
                                    onLoad,
                                    className
                                  }) {
  const [imageSrc, setImageSrc] = useState(srcSmall || src);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    // Créer un nouvel objet Image pour précharger l'image haute résolution
    const img = new Image();

    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
      if (onLoad) onLoad();
    };

    img.onerror = () => {
      // En cas d'erreur, on garde la version small
      setIsLoaded(true);
    };

    // Commencer le chargement de l'image haute résolution
    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, onLoad]);

  return (
      <img
          ref={imgRef}
          src={imageSrc}
          alt={alt}
          style={{
            ...style,
            filter: !isLoaded && srcSmall ? 'blur(10px)' : 'none',
            transition: 'filter 0.3s ease',
          }}
          className={className}
      />
  );
}
