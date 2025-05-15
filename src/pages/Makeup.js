import '../styles/Makeup.css';
import { CardGrid } from "../components/CardGrid";
import { motion } from "framer-motion";
import { useState, useEffect } from 'react';

function Makeup() {
  const [contentLoaded, setContentLoaded] = useState(false);

  // Délai similaire à celui utilisé dans Home.js
  useEffect(() => {
    const timer = setTimeout(() => {
      setContentLoaded(true);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div 
      className="Makeup w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center w-full">
        {contentLoaded && (
          <motion.div 
            className="mx-auto h-auto card-grid-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            {/* Vous pouvez décommenter ce bloc si vous souhaitez l'utiliser */}
            {/* <div className="container-makeup flex flex-col mx-auto max-w-5xl justify-center items-center mb-20 mt-20">
              <motion.h2 
                className="title-makeup tracking-tight"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                Mes Makeup
              </motion.h2>
              
              <motion.p 
                className="mt-8 font-medium text-pretty sm:text-xl/8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                Ici, vous trouverez une galerie de créations allant du makeup artistique au beauty glam, en passant par des transformations audacieuses et des looks inspirés du fantastique. 
                Chaque maquillage raconte une histoire, mêlant technique et créativité. 
                Explorez, inspirez-vous et plongez dans cet univers où la beauté devient une œuvre d'art.
              </motion.p>
            </div> */}

            <CardGrid />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
  
export default Makeup;