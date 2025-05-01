// @ts-nocheck
import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Edges, MeshPortalMaterial, CameraControls, Environment, PivotControls } from '@react-three/drei'
import { useControls } from 'leva'
import path from "path";

export default function ThreeDCube() {
    return (
        <Canvas shadows camera={{ position: [-3, 0.5, 3] }} style={{height: '100vh', width: '100vw'}}>
            <PivotControls anchor={[-1.1, -1.1, -1.1]} scale={0.75} lineWidth={3.5}>
                <mesh castShadow receiveShadow>
                    <boxGeometry args={[2, 2, 2]} />
                    <Edges />
                    <Side rotation={[0, 0, 0]} bg="orange" index={0}>
                        <torusGeometry args={[0.65, 0.3, 64]} />
                    </Side>
                    <Side rotation={[0, Math.PI, 0]} bg="lightblue" index={1}>
                        <torusKnotGeometry args={[0.55, 0.2, 128, 32]} />
                    </Side>
                    <Side rotation={[0, Math.PI / 2, Math.PI / 2]} bg="lightgreen" index={2}>
                        <boxGeometry args={[1.15, 1.15, 1.15]} />
                    </Side>
                    <Side rotation={[0, Math.PI / 2, -Math.PI / 2]} bg="aquamarine" index={3}>
                        <octahedronGeometry />
                    </Side>
                    <Side rotation={[0, -Math.PI / 2, 0]} bg="indianred" index={4}>
                        <icosahedronGeometry />
                    </Side>
                    <Side rotation={[0, Math.PI / 2, 0]} bg="hotpink" index={5}>
                        <dodecahedronGeometry />
                    </Side>
                </mesh>
            </PivotControls>
            <CameraControls makeDefault />
        </Canvas>
    )
}
//@ts-ignore
function Side({ rotation = [0, 0, 0] as [number, number, number], bg = '#f0f0f0', children, index }) {
    const mesh = useRef(null)
    const { worldUnits } = useControls({ worldUnits: false })

    let nodes
    try {
        // Disable MeshoptDecoder to comply with CSP
        const gltf = useGLTF(path.join(__dirname, '/aobox-transformed.js'), true) // Ensure the path is correct
        nodes = gltf.nodes
    } catch (error) {
        console.error("Failed to load GLTF model. Ensure the file exists at '/aobox-transformed.glb':", error)
        nodes = null // Fallback to avoid breaking the app
    }

    useFrame((state, delta) => {
        if (mesh.current) {
            mesh.current.rotation.x = mesh.current.rotation.y += delta
        }
    })

    if (!nodes || !nodes.Cube) {
        console.warn("GLTF model is missing or corrupted. Rendering fallback geometry.")
        return (
            <mesh>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="red" />
            </mesh>
        )
    }

    return (
        //@ts-ignore
        <MeshPortalMaterial
            worldUnits={worldUnits}
            attach={`material-${index}`}
        >
            {/** Everything in here is inside the portal and isolated from the canvas */}
            <ambientLight intensity={0.5} />
            <Environment preset="city" />
            {/** A box with baked AO @ts-ignore */}
            <mesh castShadow receiveShadow rotation={rotation} geometry={nodes.Cube.geometry}>
                <meshStandardMaterial aoMapIntensity={1} aoMap={nodes.Cube.material.aoMap} color={bg} />
                <spotLight castShadow color={bg} intensity={2} position={[10, 10, 10]} angle={0.15} penumbra={1} shadow-normalBias={0.05} shadow-bias={0.0001} />
            </mesh>
            {/** The shape */}
            <mesh castShadow receiveShadow ref={mesh}>
                {children}
                <meshLambertMaterial color={bg} />
            </mesh>
        </MeshPortalMaterial>
    )
}

