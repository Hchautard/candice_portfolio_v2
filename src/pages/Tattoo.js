import "../styles/Tattoo.css"
import CardDistribution from "./CardDistribution";
import { useEffect, useState } from "react";

function Tattoo() {
  const [showComponent, setShowComponent] = useState(false);

  useEffect(() => {
      // Add class to body when component mounts
      document.body.classList.add('tattoo-page');
      
      // Set timeout to load CardDistribution after 2 seconds
      const timer = setTimeout(() => {
          setShowComponent(true);
      }, 500);
      
      // Remove class and clear timeout when component unmounts
      return () => {
          document.body.classList.remove('tattoo-page');
          clearTimeout(timer);
      };
  }, []);
  
  return (
      <div className="Tattoo">
          <div className="container-tattoo">
              {showComponent ? <CardDistribution /> : null}
          </div>
      </div>
  );
}
  
export default Tattoo;