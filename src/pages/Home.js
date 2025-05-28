import "../styles/Home.css";
import { motion } from "framer-motion";
import { useState, useEffect, Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls, Environment } from "@react-three/drei";

function TattooMachineModel() {
  const modelRef = useRef();
  
  // ✅ Correction du chemin - ajout de process.env.PUBLIC_URL
  const { scene, error } = useGLTF(process.env.PUBLIC_URL + "/models/tattoo_machine/scene.gltf");
  
  // ✅ Gestion d'erreur
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

// ✅ Composant de fallback pour le chargement (THREE.js compatible)
function LoadingFallback() {
  return (
    <group>
      {/* Optionnel: vous pouvez ajouter une géométrie simple pendant le chargement */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.1, 0.1, 0.1]} />
        <meshBasicMaterial color="gray" opacity={0.3} transparent />
      </mesh>
    </group>
  );
}

function Home() {
  const [contentLoaded, setContentLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setContentLoaded(true);
    }, 800);
    
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
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="flex flex-row items-center banner-content">
              <div className="text-container">
                <h2 className="tracking-tight">Bienvenue chez l'Anomalie</h2>
              
                <p className="text font-medium text-pretty">
                Plongez dans un univers où l'encre devient rituel. Inspirée par le cyber sigilism et le dark fantasy, 
                <span> l'Anomalie</span> crée des tatouages mystiques et intemporels, entre symboles occultes et visions futuristes. 
                Chaque tracé est une porte vers l'invisible.
                </p>
                
                <div className="grid grid-cols-1 gap-x-8 gap-y-6 text-base/7 font-semibold sm:grid-cols-2 md:flex lg:gap-x-10 mt-8 cta-buttons">
                  <a href="/tattoo" className="button rounded">Tattoo</a>
                  <a href="/makeup" className="button rounded">Makeup</a>
                  <a href="/contact" className="button-light rounded">Contact<span aria-hidden="true">&rarr;</span></a>
                </div>
              </div>
              
              <div className="model-container">
                <Canvas 
                  camera={{ position: [5, 0, 5], fov: 50 }}
                  onCreated={({ gl }) => {
                    // ✅ Configuration pour la compatibilité
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
    </motion.div>
  );
}

export default Home;