import "../styles/Home.css";
import {motion} from "motion/react";
import {Suspense, lazy} from "react";
import {Link} from "react-router-dom";
import NewsSection from "../components/NewsSection";
import ReviewsSection from "../components/ReviewsSection";
import ErrorBoundary from "../components/ErrorBoundary";
import DocumentTitleSetter from "../utils/title-setter.ts";
import InstagramIcon from "../components/InstagramIcon";
import { INSTAGRAM } from "../data/social";

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

                {/* Instagram d'abord (objectif du site), le formulaire ensuite ; les pages restent dans le menu */}
                <div className="cta-buttons">
                  <a className="button rounded" href={INSTAGRAM.dmUrl} target="_blank" rel="noopener noreferrer">
                    <InstagramIcon size={22} />
                    M&apos;écrire sur Instagram
                    <span className="sr-only"> (nouvel onglet)</span>
                  </a>
                  <Link to="/contact" className="button-light rounded">
                    Formulaire de demande<span aria-hidden="true">&rarr;</span>
                  </Link>
                </div>
                <p className="hero-explore">
                  Découvrir <Link to="/tattoo">les flashs</Link>, <Link to="/makeup">le makeup</Link> ou <Link to="/project">le futur salon</Link>.
                </p>
              </div>

              { !isMobile && (
                  <div className="model-container">
                    {/* Sans WebGL, le modèle disparaît au lieu de faire planter l'accueil */}
                    <ErrorBoundary>
                      <Suspense fallback={null}>
                        <TattooMachine3D />
                      </Suspense>
                    </ErrorBoundary>
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
