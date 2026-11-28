import "../styles/Home.css";
import {motion} from "motion/react";
import {Link} from "react-router-dom";
import NewsSection from "../components/NewsSection";
import ReviewsSection from "../components/ReviewsSection";
import Triptych from "../components/Triptych";
import DocumentTitleSetter from "../utils/title-setter.ts";
import InstagramIcon from "../components/InstagramIcon";
import { INSTAGRAM } from "../data/social";

function Home() {
  // Description : celle de index.html. /home affiche la même page : son adresse de référence est /
  DocumentTitleSetter("Accueil", { canonicalPath: "/" });

  // La machine à tatouer en 3D (three.js) ne charge que sur ordinateur
  const isMobile = window.innerWidth < 768;

  return (
      <motion.div
          className="Home"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
      >
        {/* Présentation à gauche, les trois métiers en triptyque à droite (l'un sous l'autre
            sur les écrans étroits) */}
        <div className="banner">
          <motion.div
              className="content-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="text-container">
              <h1 className="tracking-tight">Bienvenue chez l&apos;<span>Anomalie</span></h1>

              <p className="text text-pretty">
                Je suis Candice, artiste indépendante de 24 ans à Montpellier : je tatoue, je maquille et je fabrique mes coiffes et accessoires.
              </p>
              <p className="text text-pretty">
                Mes tatouages naissent d&apos;un univers cyber-sigilism, gothique et dark fantasy, souvent en freehand pour épouser votre morphologie. Mes maquillages vont du défilé à l&apos;effet spécial, jusqu&apos;au drag.
              </p>

              {/* Instagram d'abord (objectif du site), le formulaire ensuite ; les pages sont dans le triptyque et le menu */}
              <div className="cta-buttons">
                <a className="button rounded" href={INSTAGRAM.dmUrl} target="_blank" rel="noopener noreferrer">
                  <InstagramIcon size={22} />
                  M&apos;écrire sur Instagram
                  <span className="sr-only"> (nouvel onglet)</span>
                </a>
                <Link to="/contact" className="button-light rounded">
                  Formulaire de demande
                </Link>
              </div>
            </div>
          </motion.div>

          <Triptych with3D={!isMobile} />
        </div>

        {/* Section News */}
        <NewsSection />

        {/* Section Avis */}
        <ReviewsSection />

      </motion.div>
  );
}

export default Home;
