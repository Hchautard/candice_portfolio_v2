"use client";

import React, { useState, useEffect } from "react";
import { ThreeDCardDemo } from "./ThreeDCard";

// Import des images
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

// Composant pour précharger les images
const ImagePreloader = ({ images }) => {
  useEffect(() => {
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [images]);
  
  return null;
};

// Composant Skeleton pour le chargement
const CardSkeleton = ({ width = 'auto' }) => {
  return (
    <div className={`animate-pulse ${width === 'full' ? 'col-span-2' : ''}`}>
      <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
    </div>
  );
};

export function CardGrid() {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  
  // Liste de toutes les images
  const allImages = [
    flora1, flora2, mira1, karole1, karole2, alice1, 
    song1, candice1, karole3, perles1, carte1, ziggy1, hematome1
  ];

  // Précharger les images prioritaires (visible dans la première vue)
  const priorityImages = [flora1, alice1, karole1, mira1, karole2];
  
  useEffect(() => {
    // Précharger les images prioritaires
    const loadImages = async () => {
      const promises = priorityImages.map(src => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = reject;
          img.src = src;
        });
      });
      
      try {
        await Promise.all(promises);
        setImagesLoaded(true);
      } catch (error) {
        console.error("Erreur lors du chargement des images:", error);
        setImagesLoaded(true); // On affiche quand même
      }
    };
    
    loadImages();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Préchargement des autres images en arrière-plan */}
      <ImagePreloader images={allImages} />
      
      {/* First row - 3 equal cards */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {!imagesLoaded ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          <>
            <ThreeDCardDemo 
              title="Magic Garden : La princesse"
              description="Discover our collection of organic makeup products" 
              imageUrl={flora1}
              loading="eager"
            />
            <ThreeDCardDemo 
              title="Allo Docteur Love : l'enivrante"
              description="Express yourself with vibrant, long-lasting pigments" 
              imageUrl={alice1}
              loading="eager"
            />
            <ThreeDCardDemo 
              title="Magic Garden : La sirène" 
              description="Makeup that nourishes your skin while enhancing your beauty" 
              imageUrl={karole1}
              loading="eager"
            />
          </>
        )}
      </div>
      
      {/* Second row - 1 card spanning 2 columns, 1 card in the last column */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {!imagesLoaded ? (
          <>
            <CardSkeleton width="full" />
            <CardSkeleton />
          </>
        ) : (
          <>
            <div className="col-span-2">
              <ThreeDCardDemo 
                width="full" 
                title="Magic Garden : L'elfe"
                description="Explore our exclusive seasonal palette with unique textures and finishes" 
                imageUrl={mira1}
                loading="eager"
              />
            </div>
            <div className="col-span-1">
              <ThreeDCardDemo 
                title="Portal" 
                description="Sustainable beauty products in recyclable packaging" 
                imageUrl={karole2}
                loading="eager"
              />
            </div>
          </>
        )}
      </div>
      
      {/* Third row - 3 equal cards */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <ThreeDCardDemo 
          title="Allo Docteur Love : la briseuse de coeur"
          description="Inclusive shade ranges for all complexions" 
          imageUrl={song1}
          loading="lazy"
        />
        <ThreeDCardDemo 
          title="Magic Garden : La princesse"
          description="Professional-grade brushes and applicators" 
          imageUrl={flora2}
          loading="lazy"
        />
        <ThreeDCardDemo 
          title="Glam" 
          description="Free from harmful ingredients, gentle on sensitive skin" 
          imageUrl={perles1}
          loading="lazy"
        />
      </div> 

      {/* Fourth row - 1 card in the first column, 1 card spanning 2 columns */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="col-span-1">
          <ThreeDCardDemo  
            title="Portal défilé POZ"
            description="Just launched products to elevate your makeup routine" 
            imageUrl={karole3}
            loading="lazy"
          />
        </div>
        <div className="col-span-2">
          <ThreeDCardDemo 
            width="full" 
            title="Ice look"
            description="Learn techniques from our expert makeup artists" 
            imageUrl={candice1}
            loading="lazy"
          />
        </div>
      </div>

      {/* Fifth row - 3 equal cards */}
      <div className="grid grid-cols-3 gap-4">
        <ThreeDCardDemo 
          title="La reine de coeur"
          description="Cruelty-free beauty products with plant-based ingredients" 
          imageUrl={carte1}
          loading="lazy"
        />
        <ThreeDCardDemo 
          title="Look David Bowie"
          description="Our most loved products that customers can't get enough of" 
          imageUrl={ziggy1}
          loading="lazy"
        />
        <ThreeDCardDemo 
          title="Hématome"
          description="Perfect combinations for gifting or trying something new" 
          imageUrl={hematome1}
          loading="lazy"
        />
      </div> 
    </div>
  );
}