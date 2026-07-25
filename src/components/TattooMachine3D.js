import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";

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

export default function TattooMachine3D() {
    return (
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
    );
}
