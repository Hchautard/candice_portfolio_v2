import '../styles/Makeup.css';
import { useState, useEffect } from 'react';
import BentoSlider from '../components/BentoSlider';
import DocumentTitleSetter from "../utils/title-setter.ts";

function setupCss() {
  document.body.classList.remove('tattoo-page');
  document.body.classList.remove('project-page');
  document.body.classList.remove('contact-page');
  document.body.classList.add('makeup-page');
}

function getImages() {
  const images = require.context('../assets/images/makeup', false, /\.(png|jpg|jpeg)$/i);
  const imagesSmall = require.context('../assets/images/makeup/thumbnails', false, /\.(png|jpg|jpeg)$/i);

  const imagePaths = images.keys().map(key => ({
    path: images(key),
    filename: key.replace('./', '')
  }));

  const imagePathsSmall = imagesSmall.keys().map(key => ({
    path: imagesSmall(key),
    filename: key.replace('./', '')
  }));

  return [imagePaths, imagePathsSmall];
}

// Données des images avec titres et descriptions
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
    description: "Our most loved products that customers can't get enough of"
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

// Ordre d'affichage
const displayOrder = [
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

const displayOrderSmall = [
  'flora_1-small.jpg',
  'alice_1-small.jpg',
  'karole_1-small.jpg',
  'mira_1-small.jpg',
  'karole_2-small.jpg',
  'song_1-small.jpg',
  'flora_2-small.jpg',
  'perles_1-small.jpg',
  'karole_3-small.jpg',
  'candice_1-small.jpg',
  'carte_1-small.jpg',
  'ziggy_1-small.jpg',
  'hematome_1-small.jpg',
  'Clown-small.jpg',
  'Pink_spider-small.jpg',
  'Bloody_Mary-small.jpg',
  'fleau-small.jpg',
  'Zombie-small.jpg',
  'Blue2-small.jpg',
  'Goth-small.jpg',
  'Operetta-small.jpg',
  'Freddy-small.jpg',
  'Pearl-small.jpg',
  'Pearl2-small.jpg',
  'Blue-small.jpg',
  'Chrome-small.jpg'
];

// Formater les images pour le slider
function formatImagesForSlider(imageSrc, imagesSrcSmall) {
  return displayOrder
      .map((filename, index) => {
        const image = imageSrc.find(img =>
            img.filename.toLowerCase() === filename.toLowerCase()
        );
        const smallFilename = displayOrderSmall[index];
        const imageSmall = imagesSrcSmall.find(img =>
            img.filename.toLowerCase() === smallFilename.toLowerCase()
        );

        if (image && imageData[filename]) {
          return {
            id: index + 1,
            imageSrc: image.path,
            imageSrcSmall: imageSmall ? imageSmall.path : image.path,
            title: imageData[filename].title,
            description: imageData[filename].description
          };
        }
        return null;
      })
      .filter(img => img !== null);
}

function Makeup() {
  const [contentLoaded, setContentLoaded] = useState(false);
  const [images, setImages] = useState([]);

  DocumentTitleSetter("Makeup");

  setupCss();

  useEffect(() => {
    // Charger les images avec leurs thumbnails
    const [imagePaths, imagePathsSmall] = getImages();
    const loadedImages = formatImagesForSlider(imagePaths, imagePathsSmall);

    setImages(loadedImages);

    const timer = setTimeout(() => {
      setContentLoaded(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
      <div className="makeup-container">
        {contentLoaded && images.length > 0 ? (
            <BentoSlider images={images} />
        ) : (
            <div className="flex items-center justify-center h-screen">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
            </div>
        )}
      </div>
  );
}

export default Makeup;