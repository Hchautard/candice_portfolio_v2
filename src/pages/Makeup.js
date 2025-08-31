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
            <CardGrid />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
  
export default Makeup;