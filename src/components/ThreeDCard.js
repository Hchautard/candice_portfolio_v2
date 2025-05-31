"use client";

import React, { useState } from "react";
import { CardBody, CardContainer, CardItem } from "./Card";
import { ImageModal } from "./ImageModal";
import '../styles/ThreeDCard.css';

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// Composant placeholder pendant le chargement
const ImagePlaceholder = () => (
  <div className="w-full h-60 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse flex items-center justify-center">
    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  </div>
);

export function ThreeDCardDemo({ 
  height = 70, 
  width = 'auto', 
  title = "Make things float in air", 
  description = "Hover over this card to unleash the power of CSS perspective",
  imageUrl = "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  loading = "lazy"
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true); // Pour arrêter l'animation de chargement
  };

  const handleCardClick = () => {
    if (imageLoaded && !imageError) {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <CardContainer 
        className={cn('h-64', width === 'full' ? 'w-full' : 'w-lg') + ' card-container'}
        onClick={handleCardClick}
        style={{ cursor: imageLoaded && !imageError ? 'pointer' : 'default' }}
      >
        <CardBody
          className={cn(
            "bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1]",
            "dark:bg-black dark:border-white/[0.2] border-black/[0.1]",
            "h-auto rounded-xl border",
            width === 'full' ? 'w-full' : 'w-auto sm:w-[30rem]',
            imageLoaded && !imageError ? "hover:scale-[1.02] transition-transform duration-300" : ""
          )}
        >
          <CardItem translateY="20" translateZ="101"
            className="title absolute">
            {title}
          </CardItem>

          <CardItem translateZ="100" className="w-full">
            {!imageLoaded && !imageError && <ImagePlaceholder />}
            
            <img
              src={imageUrl}
              height="1000"
              width="1000"
              className={cn(
                "w-full h-60 object-cover rounded-xl group-hover/card:shadow-xl transition-opacity duration-300",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
              alt={title}
              loading={loading}
              onLoad={handleImageLoad}
              onError={handleImageError}
              style={{ display: imageLoaded || imageError ? 'block' : 'none' }}
            />
            
            {imageError && (
              <div className="w-full h-60 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                <p className="text-gray-500">Image non disponible</p>
              </div>
            )}
            
            {/* Indicateur de clic */}
            {/* {imageLoaded && !imageError && (
              <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                </svg>
              </div>
            )} */}
          </CardItem>
        </CardBody>
      </CardContainer>

      <ImageModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        imageSrc={imageUrl}
        imageAlt={title}
      />
    </>
  );
}