import "../styles/Home.css";
import {motion} from "framer-motion";
import {Suspense, useEffect, useRef, useState} from "react";
import {Canvas, useFrame} from "@react-three/fiber";
import {Environment, OrbitControls, useGLTF} from "@react-three/drei";
import {Link} from "react-router-dom";
import NewsSection from "../components/NewsSection";
import ReviewsSection from "../components/ReviewsSection";

function TattooMachineModel() {
  const modelRef = useRef();

  const { scene, error } = useGLTF(process.env.PUBLIC_URL + "/models/tattoo_machine/scene-v2.glb");

  useEffect(() => {
    if (error) {
      console.error("Erreur de chargement du modèle:", error);
    }
  }, [error]);

  // Animation for floating effect with 45-degree angle
  useFrame((state) => {
    if (!modelRef.current) return;

    const t = state.clock.getElapsedTime();

    // Subtle vertical movement
    modelRef.current.position.y = Math.sin(t * 0.4) * 0.1 + 1;

    // Subtle rotation around the angled axis
    const wobbleAmount = 0.05;
    modelRef.current.rotation.x = Math.sin(t * 0.1) * wobbleAmount;
  });

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

function Home() {
  document.body.classList.remove('tattoo-page');
  document.body.classList.remove('contact-page');
  document.body.classList.remove('makeup-page');
  document.body.classList.remove('project-page');

  const [contentLoaded] = useState(true);

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
          {contentLoaded && (
              <motion.div
                  className="content-container"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
              >
                <div className="flex flex-row items-center banner-content">
                  <div className="text-container">
                    <h2 className="tracking-tight">Bienvenue chez l&apos;<span>Anomalie</span></h2>

                    <p className="text text-pretty">
                      Je suis Candice, jeune tatoueuse indépendante de 24 ans et je vous présente mon univers, mêlant influences cyber-sigilism, gothique et dark fantasy.
                      <br />
                      Mon style est organique et instinctif, je travaille aussi en freehand afin d’adapter chaque tatouage au maximum à votre morphologie et à votre univers.
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
                  )}

                </div>
              </motion.div>
          )}
        </div>

        {/* Section News */}
        <NewsSection />

        {/* Section Avis */}
        <ReviewsSection />

      </motion.div>
  );
}

export default Home;