import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { useReducedMotion } from "motion/react";

// Fichiers allégés par scripts/optimize-3d.mjs. Tout est servi par le site : sans CDN tiers,
// aucune adresse IP de visiteur ne part chez Google ou GitHub, et rien ne casse s'ils changent.
const MODEL_URL = import.meta.env.BASE_URL + "models/tattoo_machine/scene-v3.glb";
// Éclairage studio de Poly Haven (CC0), le même que le preset "studio" de drei
const ENVIRONMENT_URL = import.meta.env.BASE_URL + "hdri/studio_small_03_256.hdr";
// Décodeur Draco : copie de node_modules/three/examples/jsm/libs/draco/gltf/
const DRACO_PATH = import.meta.env.BASE_URL + "draco/";

function TattooMachineModel({ floating }) {
    const modelRef = useRef();
    const { scene } = useGLTF(MODEL_URL, DRACO_PATH);

    // Flottement lent ; immobile si le visiteur a demandé moins d'animations
    useFrame((state) => {
        if (!floating || !modelRef.current) return;

        const t = state.clock.getElapsedTime();
        modelRef.current.position.y = Math.sin(t * 0.4) * 0.1 + 1;
        modelRef.current.rotation.x = Math.sin(t * 0.1) * 0.05;
    });

    // Couchée à 45°, à la hauteur moyenne du flottement
    return (
        <primitive
            ref={modelRef}
            object={scene}
            scale={0.5}
            position={[0, 1, 0]}
            rotation={[0, Math.PI / 4, Math.PI / 2]}
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

// R3F crée le contexte WebGL dans une promesse non interceptée : sans WebGL (GPU blacklisté,
// accélération matérielle désactivée…), l'erreur échappe aux error boundaries. On vérifie donc avant.
function hasWebGL() {
    try {
        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
        gl?.getExtension("WEBGL_lose_context")?.loseContext(); // libère le contexte de test
        return !!gl;
    } catch {
        return false;
    }
}

export default function TattooMachine3D() {
    const [webGLAvailable] = useState(hasWebGL);
    const reducedMotion = useReducedMotion();
    const canvasRef = useRef(null);
    const [onScreen, setOnScreen] = useState(true);

    // Hors écran (lecture des actualités…), on arrête de dessiner : le GPU et la batterie se reposent
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || typeof IntersectionObserver === "undefined") return undefined;
        const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
        observer.observe(canvas);
        return () => observer.disconnect();
    }, [webGLAvailable]);

    if (!webGLAvailable) return null;

    // Sans flottement, une image n'est redessinée que si elle change (rotation à la souris, chargement)
    let frameloop = reducedMotion ? "demand" : "always";
    if (!onScreen) frameloop = "never";

    return (
        <Canvas
            ref={canvasRef}
            frameloop={frameloop}
            camera={{ position: [5, 0, 5], fov: 50 }}
            onCreated={({ gl }) => {
                gl.physicallyCorrectLights = false;
            }}
        >
            <ambientLight intensity={0.6} />
            <spotLight position={[5, 5, 5]} angle={0.15} penumbra={1} intensity={1} />
            <pointLight position={[-5, -5, -5]} intensity={0.5} />
            <Suspense fallback={<LoadingFallback />}>
                <TattooMachineModel floating={!reducedMotion} />
                <Environment files={ENVIRONMENT_URL} />
                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    enableRotate={true}
                    autoRotate={false}
                />
            </Suspense>
        </Canvas>
    );
}
