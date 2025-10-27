"use client";

import React, { useState, useEffect } from "react";
import { ThreeDCardDemo } from "./ThreeDCard";

function getImages() {
  const images = require.context('../assets/images/makeup', false, /\.(png|jpg|jpeg)$/i);
  const imagePaths = images.keys().map(key => ({
    path: images(key),
    filename: key.replace('./', '')
  }));
  return imagePaths;
}

function formatImageForCards(imageSrc) {
  const imageData = {
    'flora_1.png': {
      title: "Magic Garden : La princesse",
      description: "Discover our collection of organic makeup products"
    },
    'flora_2.png': {
      title: "Magic Garden : La princesse",
      description: "Professional-grade brushes and applicators"
    },
    'alice_1.png': {
      title: "Allo Docteur Love : l'enivrante",
      description: "Express yourself with vibrant, long-lasting pigments"
    },
    'karole_1.png': {
      title: "Magic Garden : La sirène",
      description: "Makeup that nourishes your skin while enhancing your beauty"
    },
    'mira_1.png': {
      title: "Magic Garden : L'elfe",
      description: "Explore our exclusive seasonal palette with unique textures and finishes"
    },
    'karole_2.png': {
      title: "Portal",
      description: "Sustainable beauty products in recyclable packaging"
    },
    'song_1.png': {
      title: "Allo Docteur Love : la briseuse de coeur",
      description: "Inclusive shade ranges for all complexions"
    },
    'perles_1.png': {
      title: "Glam",
      description: "Free from harmful ingredients, gentle on sensitive skin"
    },
    'karole_3.png': {
      title: "Portal défilé POZ",
      description: "Just launched products to elevate your makeup routine"
    },
    'candice_1.jpg': {
      title: "Ice look",
      description: "Learn techniques from our expert makeup artists"
    },
    'carte_1.png': {
      title: "La reine de coeur",
      description: "Cruelty-free beauty products with plant-based ingredients"
    },
    'ziggy_1.png': {
      title: "Look David Bowie",
      description: "Our most loved products that customers can't get enough of"
    },
    'hematome_1.png': {
      title: "Hématome",
      description: "Perfect combinations for gifting or trying something new"
    },
    'Clown.PNG': {
      title: "Clown",
      description: "Bold and creative clown makeup artistry"
    },
    'Pink_spider.PNG': {
      title: "Pink Spider",
      description: "Mystical spider-inspired pink makeup"
    },
    'Bloody_Mary.jpeg': {
      title: "Bloody Mary",
      description: "Dramatic horror-inspired makeup look"
    },
    'fleau.PNG': {
      title: "Fléau",
      description: "Dark and haunting makeup creation"
    },
    'Zombie.PNG': {
      title: "Zombie",
      description: "Realistic zombie makeup effects"
    },
    'Blue2.PNG': {
      title: "Blue Avatar",
      description: "Fantasy blue character makeup"
    },
    'Goth.JPG': {
      title: "Gothic",
      description: "Classic gothic makeup style"
    },
    'Operetta.JPG': {
      title: "Operetta",
      description: "Theatrical operetta-inspired look"
    },
    'Freddy.JPG': {
      title: "Freddy",
      description: "Horror movie character makeup"
    },
    'Pearl.JPEG': {
      title: "Pearl",
      description: "Elegant pearl-inspired makeup"
    },
    'Pearl2.JPEG': {
      title: "Pearl 2",
      description: "Another pearl-inspired variation"
    },
    'Blue.jpeg': {
      title: "Blue Dreams",
      description: "Dreamy blue makeup artistry"
    },
    'Chrome.JPEG': {
      title: "Chrome",
      description: "Futuristic chrome makeup effect"
    },
  };

  const displayOrder = [
    // Anciennes images
    'flora_1.png',
    'alice_1.png',
    'karole_1.png',
    'mira_1.png',
    'karole_2.png',
    'song_1.png',
    'flora_2.png',
    'perles_1.png',
    'karole_3.png',
    'candice_1.jpg',
    'carte_1.png',
    'ziggy_1.png',
    'hematome_1.png',
    'Clown.PNG',
    'Pink_spider.PNG',
    'Bloody_Mary.jpeg',
    'fleau.PNG',
    'Zombie.PNG',
    'Blue2.PNG',
    'Goth.JPG',
    'Operetta.JPG',
    'Freddy.JPG',
    'Pearl.JPEG',
    'Pearl2.JPEG',
    'Blue.jpeg',
    'Chrome.JPEG'
  ];

  const sortedImages = displayOrder
      .map(filename => {
        const image = imageSrc.find(img =>
            img.filename.toLowerCase() === filename.toLowerCase()
        );
        if (image && imageData[filename]) {
          return {
            id: displayOrder.indexOf(filename) + 1,
            imageSrc: image.path,
            title: imageData[filename].title,
            description: imageData[filename].description
          };
        }
        return null;
      })
      .filter(img => img !== null);

  return sortedImages;
}

function getGridLayout(totalImages) {
  const patterns = [
    [1, 1, 1],
    [2, 1],
    [1, 1, 1],
    [1, 2],
    [1, 1, 1],
  ];

  let layout = [];
  let imageIndex = 0;

  while (imageIndex < totalImages) {
    const pattern = patterns[layout.length % patterns.length];
    const row = [];

    for (let span of pattern) {
      if (imageIndex < totalImages) {
        row.push({
          imageIndex: imageIndex,
          span: span
        });
        imageIndex++;
      }
    }

    if (row.length > 0) {
      layout.push(row);
    }
  }

  return layout;
}

// Composant pour précharger les images
const ImagePreloader = ({ images }) => {
  useEffect(() => {
    images.forEach((card) => {
      const img = new Image();
      img.src = card.imageSrc;
    });
  }, [images]);

  return null;
};

// Composant Skeleton pour le chargement
const CardSkeleton = ({ span = 1 }) => {
  return (
      <div className={`animate-pulse ${span === 2 ? 'col-span-2' : 'col-span-1'}`}>
        <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
      </div>
  );
};

export function CardGrid() {
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const formattedImages = formatImageForCards(getImages());
  const gridLayout = getGridLayout(formattedImages.length);

  const priorityImages = formattedImages.slice(0, 5);

  useEffect(() => {
    // Précharger les images prioritaires
    const loadImages = async () => {
      const promises = priorityImages.map(card => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = reject;
          img.src = card.imageSrc;
        });
      });

      try {
        await Promise.all(promises);
        setImagesLoaded(true);
      } catch (error) {
        console.error("Erreur lors du chargement des images:", error);
        setImagesLoaded(true);
      }
    };

    loadImages();
  }, []);

  return (
      <div className="container mx-auto px-4 py-8">
        <ImagePreloader images={formattedImages} />

        {gridLayout.map((row, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-3 gap-4 mb-4">
              {!imagesLoaded ? (
                  // Afficher les skeletons
                  row.map((cell, cellIndex) => (
                      <CardSkeleton key={cellIndex} span={cell.span} />
                  ))
              ) : (
                  row.map((cell, cellIndex) => {
                    const card = formattedImages[cell.imageIndex];
                    if (!card) return null;

                    return (
                        <div key={cellIndex} className={cell.span === 2 ? 'col-span-2' : 'col-span-1'}>
                          <ThreeDCardDemo
                              width={cell.span === 2 ? 'full' : 'auto'}
                              title={card.title}
                              description={card.description}
                              imageUrl={card.imageSrc}
                              loading={cell.imageIndex < 5 ? "eager" : "lazy"}
                          />
                        </div>
                    );
                  })
              )}
            </div>
        ))}
      </div>
  );
}