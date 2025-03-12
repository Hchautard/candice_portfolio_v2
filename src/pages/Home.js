import "../styles/Home.css"
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

function Home() {
  const [contentLoaded, setContentLoaded] = useState(false);

  // Simuler le temps de chargement de l'effet d'encre
  useEffect(() => {
    // Attendre que l'effet d'encre soit chargé avant d'afficher le contenu
    const timer = setTimeout(() => {
      setContentLoaded(true);
    }, 800); // Ajuster ce délai selon le temps nécessaire pour que l'effet d'encre apparaisse
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div 
      className="Home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="banner">
        {contentLoaded && (
          <motion.div 
            className="content-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 5 }}
          >
            <div className="mx-auto max-w-5xl w-full">
              <h2 className="text-5xl font-semibold tracking-tight sm:text-7xl">Bienvenue chez l'anomalie</h2>
            
              <p className="mt-8 font-medium text-pretty sm:text-xl/8">
                Anim aute id magna aliqua ad ad non deserunt sunt. 
                Qui irure qui lorem cupidatat commodo. 
                Elit sunt amet fugiat veniam occaecat fugiat.
                Anim aute id magna aliqua ad ad non deserunt sunt. 
                Qui irure qui lorem cupidatat commodo. 
                Elit sunt amet fugiat veniam occaecat fugiat.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-6 text-base/7 font-semibold sm:grid-cols-2 md:flex lg:gap-x-10 mt-8 mx-auto max-w-5xl w-full">
              <a href="/tattoo" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Tattoo</a>
              <a href="/makeup" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Makeup</a>
              <a href="/contact" className="font-bold py-2 px-4 rounded">Contact<span aria-hidden="true">&rarr;</span></a>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default Home;