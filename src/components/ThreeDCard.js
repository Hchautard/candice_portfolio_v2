"use client";

import React, { useState } from "react";
import { CardBody, CardContainer, CardItem } from "./Card";
import '../styles/ThreeDCard.css';

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const ImagePlaceholder = () => (
    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse flex items-center justify-center">
      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </div>
);

export function ThreeDCardDemo({
                                 height = 70,
                                 width = '',
                                 title = "",
                                 description = "Hover over this card to unleash the power of CSS perspective",
                                 imageUrl = "",
                                 loading = "lazy",
                                 fullSize = false, // Nouveau prop pour le mode bento
                               }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  if (fullSize) {
    return (
        <CardContainer
            className="card-container w-full h-full"
            style={{ cursor: imageLoaded && !imageError ? 'pointer' : 'default' }}
        >
          <CardBody
              className={cn(
                  "relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1]",
                  "dark:bg-black dark:border-white/[0.2] border-black/[0.1]",
                  "w-full h-full rounded-xl border overflow-hidden",
                  imageLoaded && !imageError ? "hover:scale-[1.02] transition-transform duration-300" : ""
              )}
          >
            <CardItem
                translateY="20"
                translateZ="101"
                className="title absolute z-10 bottom-4 left-4 right-4"
                style={{
                  textShadow: "0 2px 10px rgba(0,0,0,0.8)",
                  color: "white",
                  fontSize: "clamp(1rem, 2vw, 1.5rem)",
                  fontWeight: "bold",
                }}
            >
              {title}
            </CardItem>

            <CardItem translateZ="100" className="w-full h-full">
              {!imageLoaded && !imageError && <ImagePlaceholder />}

              <img
                  src={imageUrl}
                  className={cn(
                      "w-full h-full object-cover rounded-xl group-hover/card:shadow-xl transition-opacity duration-300",
                      imageLoaded ? "opacity-100" : "opacity-0"
                  )}
                  alt={title}
                  loading={loading}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  style={{
                    display: imageLoaded || imageError ? 'block' : 'none',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                  }}
              />

              {imageError && (
                  <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                    <p className="text-gray-500">Image non disponible</p>
                  </div>
              )}
            </CardItem>
          </CardBody>
        </CardContainer>
    );
  }

  return (
      <CardContainer
          className={cn('h-64', width === 'full' ? 'w-full' : 'w-lg') + ' card-container'}
          style={{ cursor: imageLoaded && !imageError ? 'pointer' : 'default' }}
      >
        <CardBody
            className={cn(
                "relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1]",
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
                style={{ display: imageLoaded || imageError ? 'block' : 'img-makeup' }}
            />

            {imageError && (
                <div className="w-full h-60 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                  <p className="text-gray-500">Image non disponible</p>
                </div>
            )}
          </CardItem>
        </CardBody>
      </CardContainer>
  );
}