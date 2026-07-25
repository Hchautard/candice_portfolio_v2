import "../styles/Home.css";
import {motion} from "framer-motion";
import {Suspense, lazy} from "react";
import {Link} from "react-router-dom";
import NewsSection from "../components/NewsSection";
import ReviewsSection from "../components/ReviewsSection";
import DocumentTitleSetter from "../utils/title-setter.ts";

// three.js ne charge que sur desktop, dans son propre chunk, après le premier rendu
const TattooMachine3D = lazy(() => import("../components/TattooMachine3D"));

function Home() {
  DocumentTitleSetter("Accueil");

  const isMobile = window.innerWidth < 768;

  return (
      <motion.div
          className="Home"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
      >
        <div className="banner">
          <motion.div
              className="content-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="flex flex-row items-center banner-content">
              <div className="text-container">
                <h1 className="tracking-tight">Bienvenue chez l&apos;<span>Anomalie</span></h1>

                <p className="text text-pretty">
                  Je suis Candice, jeune tatoueuse indépendante de 24 ans et je vous présente mon univers, mêlant influences cyber-sigilism, gothique et dark fantasy.
                  <br />
                  Mon style est organique et instinctif, je travaille aussi en freehand afin d&apos;adapter chaque tatouage au maximum à votre morphologie et à votre univers.
                </p>

                <div className="grid grid-cols-1 gap-x-8 gap-y-6 text-base/7 font-semibold sm:grid-cols-2 md:flex lg:gap-x-8 mt-8 cta-buttons">
                  <Link to="/project" className="button rounded">Le shop</Link>
                  <Link to="/tattoo" className="button rounded">Tattoo</Link>
                  <Link to="/makeup" className="button rounded">Makeup</Link>
                  <div className="flex flex-col justify-center items-center">
                    <Link to="/contact" className="button-light rounded">Contact<span aria-hidden="true">&rarr;</span></Link>
                  </div>
                </div>
              </div>

              { !isMobile && (
                  <div className="model-container">
                    <Suspense fallback={null}>
                      <TattooMachine3D />
                    </Suspense>
                  </div>
              )}

            </div>
          </motion.div>
        </div>

        {/* Section News */}
        <NewsSection />

        {/* Section Avis */}
        <ReviewsSection />

      </motion.div>
  );
}

export default Home;
