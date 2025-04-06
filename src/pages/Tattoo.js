import "../styles/Tattoo.css"
import CardDistribution from "./CardDistribution";
import { useEffect, useState } from "react";

import image1 from "../assets/images/tattoo/1.png";
import image2 from "../assets/images/tattoo/2.png";
import image3 from "../assets/images/tattoo/3.png";
import image4 from "../assets/images/tattoo/4.png";
import image5 from "../assets/images/tattoo/5.png";
import image6 from "../assets/images/tattoo/6.png";
import image7 from "../assets/images/tattoo/7.png";
import image8 from "../assets/images/tattoo/8.png";

function Tattoo() {
  const [showComponent, setShowComponent] = useState(false);

  const myCards = [
    { id: 1, image: image1, backContent: "Information carte 1" },
    { id: 2, image: image2, backContent: "Information carte 2" },
    { id: 3, image: image3, backContent: "Information carte 3" },
    { id: 4, image: image4, backContent: "Information carte 4" },
    { id: 5, image: image5, backContent: "Information carte 5" },
    { id: 6, image: image6, backContent: "Information carte 6" },
    { id: 7, image: image7, backContent: "Information carte 7" },
    { id: 8, image: image8, backContent: "Information carte 8" },
    // ... autres cartes
  ];

  useEffect(() => {
      // Add class to body when component mounts
      document.body.classList.add('tattoo-page');
      
      // Set timeout to load CardDistribution after 2 seconds
      const timer = setTimeout(() => {
          setShowComponent(true);
      }, 2000);
      
      // Remove class and clear timeout when component unmounts
      return () => {
          document.body.classList.remove('tattoo-page');
          clearTimeout(timer);
      };
  }, []);
  
  return (
      <div className="Tattoo">
          <div className="container-tattoo">
              {showComponent ? <CardDistribution cards={myCards}/> : null}
          </div>
      </div>
  );
}
  
export default Tattoo;