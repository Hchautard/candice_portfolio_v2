import "../styles/Home.css";
import {motion} from "framer-motion";
import {Suspense, useEffect, useRef, useState} from "react";
import {Canvas, useFrame} from "@react-three/fiber";
import {Environment, OrbitControls, useGLTF} from "@react-three/drei";
import {Link, useNavigate} from "react-router-dom";
import {getGoogleReviews} from '../services/reviews';
import NewsSection from "../components/NewsSection";
import ReviewsSection from "../components/ReviewsSection";

const handleGetReviews = async () => {
  try {
    return await getGoogleReviews({
      sort: 'relevant',
      nextpage: false
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des avis:', error.message);
  }
};

function TattooMachineModel() {
  const modelRef = useRef();

  const { scene, error } = useGLTF(process.env.PUBLIC_URL + "/models/tattoo_machine/scene.gltf");

  useEffect(() => {
    if (error) {
      console.error("Erreur de chargement du modèle:", error);
    }
  }, [error]);

  // Animation for floating effect with 45-degree angle
  useFrame((state) => {
    if (!modelRef.current) return; // ✅ Vérification de sécurité

    const t = state.clock.getElapsedTime();

    // Subtle vertical movement
    modelRef.current.position.y = Math.sin(t * 0.4) * 0.1 + 1;

    // Subtle rotation around the angled axis
    const wobbleAmount = 0.05;
    modelRef.current.rotation.x = Math.sin(t * 0.1) * wobbleAmount;
  });

  // ✅ Gestion du cas où le modèle n'est pas encore chargé
  if (!scene) {
    return null;
  }

  // Initial position with 45-degree rotation on z-axis (PI/4 radians)
  return (
      <primitive
          ref={modelRef}
          object={scene}
          scale={0.5}
          position={[0, 0, 0]}
          rotation={[0, Math.PI/4, Math.PI/2]}
      />
  );
}

function LoadingFallback() {
  return (
      <group>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshBasicMaterial color="gray" opacity={0.3} transparent />
        </mesh>
      </group>
  );
}


// Composant pour les avis défilants
function ScrollingReviews({ reviews }) {
  const scrollRef = useRef();

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || reviews.length === 0) return;

    let animationId;
    let scrollPosition = 0;
    const scrollSpeed = 0.5; // Vitesse de défilement

    const scroll = () => {
      scrollPosition += scrollSpeed;

      // Reset quand on atteint la fin
      if (scrollPosition >= scrollContainer.scrollWidth / 2) {
        scrollPosition = 0;
      }

      scrollContainer.scrollLeft = scrollPosition;
      animationId = requestAnimationFrame(scroll);
    };

    scroll();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [reviews]);

  if (reviews.length === 0) return null;

  // Dupliquer les avis pour un défilement infini
  const duplicatedReviews = [...reviews, ...reviews];

  return (
      <motion.section
          className="scrolling-reviews-section"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <h3 className="section-title">Ce que disent nos clients</h3>
          <div className="reviews-scroll-container" ref={scrollRef}>
            <div className="reviews-scroll-content">
              {duplicatedReviews.map((review, index) => (
                  <div key={`${review.author_name}-${index}`} className="review-scroll-card">
                    <div className="review-header">
                      <img
                          src={review.profile_photo_url}
                          alt={review.author_name}
                          className="review-avatar"
                          onError={(e) => {
                            e.target.src = '/default-avatar.png'; // Image par défaut
                          }}
                      />
                      <div>
                        <h4 className="review-author">{review.author_name}</h4>
                        <div className="review-rating">
                          {Array.from({ length: 5 }, (_, i) => (
                              <span
                                  key={i}
                                  className={i < review.rating ? 'star filled' : 'star'}
                              >
                          ★
                        </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="review-text">"{review.text}"</p>
                    <p className="review-date">
                      {new Date(review.time * 1000).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>
  );
}

function Home() {
  document.body.classList.remove('tattoo-page');
  document.body.classList.remove('contact-page');
  document.body.classList.remove('makeup-page');
  document.body.classList.remove('project-page');

  const [contentLoaded, setContentLoaded] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoaded, setReviewsLoaded] = useState(false);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setContentLoaded(true);
  //   }, 100);

  //   return () => clearTimeout(timer);
  // }, []);

  // Charger les avis automatiquement au chargement de la page
  useEffect(() => {
    const loadReviews = async () => {
      try {
        const reviewsData = await handleGetReviews();
        if (reviewsData && reviewsData['reviews']) {
          setReviews(reviewsData['reviews']);
          setReviewsLoaded(true);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des avis:', error);
      }
    };

    // Charger les avis avec un léger délai après le contenu principal
    const reviewsTimer = setTimeout(() => {
      loadReviews();
    }, 1500);

    return () => clearTimeout(reviewsTimer);
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
                  transition={{ duration: 0.5, delay: 0.5 }}
              >
                <div className="flex flex-row items-center banner-content">
                  <div className="text-container">
                    <h2 className="tracking-tight">Bienvenue chez l'Anomalie</h2>

                    <p className="text text-pretty">
                      Plongez dans un univers où l'encre devient rituel. Inspirée par le cyber sigilism et le dark fantasy,
                      <span> l'Anomalie</span> crée des tatouages mystiques et intemporels, entre symboles occultes et visions futuristes.
                      Chaque tracé est une porte vers l'invisible.
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

                  <div className="model-container">
                    <Canvas
                        camera={{ position: [5, 0, 5], fov: 50 }}
                        onCreated={({ gl }) => {
                          gl.physicallyCorrectLights = false;
                        }}
                    >
                      <ambientLight intensity={0.6} />
                      <spotLight position={[5, 5, 5]} angle={0.15} penumbra={1} intensity={1} />
                      <pointLight position={[-5, -5, -5]} intensity={0.5} />
                      <Suspense fallback={<LoadingFallback />}>
                        <TattooMachineModel />
                        <Environment preset="studio" />
                        <OrbitControls
                            enableZoom={false}
                            enablePan={false}
                            enableRotate={true}
                            autoRotate={false}
                        />
                      </Suspense>
                    </Canvas>
                  </div>
                </div>
              </motion.div>
          )}
        </div>

        {/* Section News */}
        <NewsSection />

        {/* Section Avis statiques */}
        <ReviewsSection />

        {/* Section Avis défilants */}
        {reviewsLoaded && <ScrollingReviews reviews={reviews} />}
      </motion.div>
  );
}

export default Home;