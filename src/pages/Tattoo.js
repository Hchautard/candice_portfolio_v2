import "../styles/Tattoo.css"
import CardDistribution from "./CardDistribution";
import { useEffect } from "react";

function Tattoo() {
  useEffect(() => {
      // Add class to body when component mounts
      document.body.classList.add('tattoo-page');
      
      // Remove class when component unmounts
      return () => {
          document.body.classList.remove('tattoo-page');
      };
  }, []);
  
  return (
      <div className="Tattoo">
          <div className="container-tattoo">
              <CardDistribution />
          </div>
      </div>
  );
}
  
  export default Tattoo;