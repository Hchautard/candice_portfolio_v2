import "../styles/Home.css";
import { motion } from "framer-motion";
import { useState, useEffect, Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls, Environment } from "@react-three/drei";

function TattooMachineModel() {
  const modelRef = useRef();
  const { scene } = useGLTF("/models/tattoo_machine/scene.gltf");
  
  // Animation for floating effect with 45-degree angle
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // Subtle vertical movement
    modelRef.current.position.y = Math.sin(t * 0.4) * 0.1 + 1;
    
    // Subtle rotation around the angled axis
    const wobbleAmount = 0.05;
    // modelRef.current.rotation.y = Math.PI/4 + Math.sin(t * 0.3) * wobbleAmount;
    modelRef.current.rotation.x = Math.sin(t * 0.1) * wobbleAmount;
  });

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
            transition={{ duration: 0.5, delay: 5 }}
          >
            <div className="flex flex-row items-center">
              <div className="text-container ">
                <h2 className="tracking-tight">Bienvenue chez l'Anomalie</h2>
              
                <p className="text mt-8 font-medium text-pretty">
                Plongez dans un univers où l’encre devient rituel. Inspirée par le cyber sigilism et le dark fantasy, 
                L'Anomalie crée des tatouages mystiques et intemporels, entre symboles occultes et visions futuristes. 
                Chaque tracé est une porte vers l’invisible.
                </p>
                
                <div className="grid grid-cols-1 gap-x-8 gap-y-6 text-base/7 font-semibold sm:grid-cols-2 md:flex lg:gap-x-10 mt-8">
                  <a href="/tattoo" className="button rounded">Tattoo</a>
                  <a href="/makeup" className="button rounded">Makeup</a>
                  <a href="/contact" className="button-light rounded">Contact<span aria-hidden="true">&rarr;</span></a>
                </div>
              </div>
              
              <div className="model-container">
                <Canvas camera={{ position: [5, 0, 5], fov: 50 }}>
                  <ambientLight intensity={0.6} />
                  <spotLight position={[5, 5, 5]} angle={0.15} penumbra={1} intensity={1} />
                  <pointLight position={[-5, -5, -5]} intensity={0.5} />
                  <Suspense fallback={null}>
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