import '../styles/Makeup.css';
import { CardGrid } from "../components/CardGrid";
import { motion } from "framer-motion";

function Makeup() {
  return (
    <motion.div 
      className="Makeup w-full"
      initial={{ width: 0 }}
      animate={{ width: "100%" }}
      exit={{ x: window.innerWidth }}
    >
      {/* This outer div should be full width */}
      <div className="flex flex-col items-center w-full">
        {/* Your content container with max-width */}
        <div className="flex flex-col mx-auto max-w-5xl justify-center items-center mb-20 mt-20">
          <h2 className="tracking-tight">Mes Makeup</h2>
          
          <p className="mt-8 font-medium text-pretty sm:text-xl/8">
          Ici, vous trouverez une galerie de créations allant du makeup artistique au beauty glam, en passant par des transformations audacieuses et des looks inspirés du fantastique. 
          Chaque maquillage raconte une histoire, mêlant technique et créativité. 
          Explorez, inspirez-vous et plongez dans cet univers où la beauté devient une œuvre d’art.
          </p>
        </div>

        <div className="mx-auto h-auto card-grid-container">
          <CardGrid />
        </div>
      </div>
    </motion.div>
  );
}
  
  export default Makeup;
