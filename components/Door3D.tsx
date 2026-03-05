"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Door3DProps {
    progress: number;
}

const DOOR_W = 5;
const DOOR_H = 8;
const FT = 0.3;
const DOOR_Z = -18;
const VIS_START = 0.40;
const VIS_END = 0.80;
const OPEN_START = 0.53;
const OPEN_END = 0.67;

const ss = (t: number) => { const c = Math.max(0, Math.min(1, t)); return c * c * (3 - 2 * c); };

// Rich mahogany brown — visible and warm
const WOOD_DARK = new THREE.Color(0.32, 0.18, 0.08);   // dark rail / stile
const WOOD_MID = new THREE.Color(0.48, 0.28, 0.12);   // mid panel face
const WOOD_LIGHT = new THREE.Color(0.60, 0.36, 0.16);   // raised bevel highlight
const FRAME_C = new THREE.Color(1.0, 0.82, 0.45);    // warm gold frame glow
const KNOB_C = new THREE.Color(0.80, 0.62, 0.20);   // brass knob

export default function Door3D({ progress }: Door3DProps) {
    const groupRef = useRef<THREE.Group>(null);
    const panelPivot = useRef<THREE.Group>(null);
    const lightBleedRef = useRef<THREE.Mesh>(null);

    // Collect all materials that need opacity driven by vis
    const allMatsRef = useRef<(THREE.MeshBasicMaterial | THREE.MeshStandardMaterial)[]>([]);
    const matRef = (i: number) => (m: THREE.MeshBasicMaterial | THREE.MeshStandardMaterial | null) => {
        if (m) allMatsRef.current[i] = m;
    };

    useFrame((state) => {
        const t = state.clock.elapsedTime;
        const vis = ss((progress - VIS_START) / 0.06) * (1 - ss((progress - VIS_END) / 0.06));

        allMatsRef.current.forEach((m) => { if (m) m.opacity = vis; });

        if (groupRef.current) groupRef.current.visible = vis > 0.01;

        // Door opening
        if (panelPivot.current) {
            const openT = ss((progress - OPEN_START) / (OPEN_END - OPEN_START));
            panelPivot.current.rotation.y = openT * (Math.PI / 2);
        }

        // Light bleed when open
        if (lightBleedRef.current) {
            const openT = ss((progress - OPEN_START) / (OPEN_END - OPEN_START));
            const mat = lightBleedRef.current.material as THREE.MeshBasicMaterial;
            mat.opacity = openT * (0.28 + 0.04 * Math.sin(t * 3)) * vis;
        }
    });

    // Raised panel helper — renders the recessed rectangles on the door face
    const raisedPanel = (x: number, y: number, w: number, h: number, idx: number) => (
        <group key={idx} position={[x, y, 0.055]}>
            {/* Outer bevel (slightly raised border) */}
            <mesh>
                <boxGeometry args={[w, h, 0.025]} />
                <meshStandardMaterial
                    ref={matRef(20 + idx)}
                    color={WOOD_DARK}
                    roughness={0.55}
                    transparent
                    opacity={0}
                />
            </mesh>
            {/* Inner face (slightly more raised) */}
            <mesh position={[0, 0, 0.02]}>
                <boxGeometry args={[w - 0.18, h - 0.18, 0.03]} />
                <meshStandardMaterial
                    ref={matRef(30 + idx)}
                    color={WOOD_LIGHT}
                    roughness={0.45}
                    transparent
                    opacity={0}
                />
            </mesh>
        </group>
    );

    return (
        <group ref={groupRef} position={[0, 0, DOOR_Z]}>
            {/* Interior glow (behind panel) */}
            <pointLight position={[0, 0, -1]} intensity={3} color="#e8c060" distance={10} decay={2} />
            {/* Front fill light — illuminates the wood face toward the camera */}
            <pointLight position={[0, 1, 6]} intensity={5} color="#ffe8b0" distance={18} decay={2} />
            {/* Soft ambient so wood is never fully black */}
            <ambientLight intensity={0.55} color="#c8a060" />

            {/* ── Door Frame ── */}
            {/* Left pillar */}
            <mesh position={[-(DOOR_W / 2 + FT / 2), 0, 0]}>
                <boxGeometry args={[FT, DOOR_H + FT * 2, FT]} />
                <meshBasicMaterial ref={matRef(0)} color={FRAME_C} transparent opacity={0} />
            </mesh>
            {/* Right pillar */}
            <mesh position={[(DOOR_W / 2 + FT / 2), 0, 0]}>
                <boxGeometry args={[FT, DOOR_H + FT * 2, FT]} />
                <meshBasicMaterial ref={matRef(1)} color={FRAME_C} transparent opacity={0} />
            </mesh>
            {/* Top lintel */}
            <mesh position={[0, DOOR_H / 2 + FT / 2, 0]}>
                <boxGeometry args={[DOOR_W + FT * 2, FT, FT]} />
                <meshBasicMaterial ref={matRef(2)} color={FRAME_C} transparent opacity={0} />
            </mesh>
            {/* Crown accent line */}
            <mesh position={[0, DOOR_H / 2 + FT * 1.6, 0]}>
                <boxGeometry args={[DOOR_W * 0.55, 0.07, 0.07]} />
                <meshBasicMaterial ref={matRef(3)} color={new THREE.Color(1.0, 0.95, 0.7)} transparent opacity={0} />
            </mesh>
            {/* Sill */}
            <mesh position={[0, -DOOR_H / 2 - FT / 2, 0]}>
                <boxGeometry args={[DOOR_W + FT * 2, FT, FT * 1.5]} />
                <meshBasicMaterial ref={matRef(4)} color={FRAME_C} transparent opacity={0} />
            </mesh>

            {/* Light bleed when open */}
            <mesh ref={lightBleedRef} position={[0, 0, 0.08]}>
                <planeGeometry args={[DOOR_W - 0.1, DOOR_H - 0.1]} />
                <meshBasicMaterial color={new THREE.Color(1.0, 0.88, 0.6)} transparent opacity={0}
                    side={THREE.FrontSide} depthWrite={false} />
            </mesh>

            {/* ── Door panel — hinge pivot at left edge ── */}
            <group ref={panelPivot} position={[-DOOR_W / 2, 0, 0]}>

                {/* Main door body — warm medium wood */}
                <mesh position={[DOOR_W / 2, 0, 0]}>
                    <boxGeometry args={[DOOR_W, DOOR_H, 0.1]} />
                    <meshStandardMaterial
                        ref={matRef(5)}
                        color={WOOD_MID}
                        emissive={WOOD_DARK}
                        emissiveIntensity={0.4}
                        roughness={0.62}
                        metalness={0.0}
                        transparent
                        opacity={0}
                    />
                </mesh>

                {/* Horizontal mid-rail (splits top/bottom panels) */}
                <mesh position={[DOOR_W / 2, 0.5, 0.053]}>
                    <boxGeometry args={[DOOR_W, 0.22, 0.04]} />
                    <meshStandardMaterial ref={matRef(6)} color={WOOD_DARK} roughness={0.55} transparent opacity={0} />
                </mesh>

                {/* Top rail */}
                <mesh position={[DOOR_W / 2, DOOR_H / 2 - 0.22, 0.053]}>
                    <boxGeometry args={[DOOR_W, 0.22, 0.04]} />
                    <meshStandardMaterial ref={matRef(7)} color={WOOD_DARK} roughness={0.55} transparent opacity={0} />
                </mesh>

                {/* Bottom rail */}
                <mesh position={[DOOR_W / 2, -(DOOR_H / 2 - 0.22), 0.053]}>
                    <boxGeometry args={[DOOR_W, 0.22, 0.04]} />
                    <meshStandardMaterial ref={matRef(8)} color={WOOD_DARK} roughness={0.55} transparent opacity={0} />
                </mesh>

                {/* Left stile */}
                <mesh position={[0.22, 0, 0.053]}>
                    <boxGeometry args={[0.22, DOOR_H, 0.04]} />
                    <meshStandardMaterial ref={matRef(9)} color={WOOD_DARK} roughness={0.55} transparent opacity={0} />
                </mesh>

                {/* Right stile */}
                <mesh position={[DOOR_W - 0.22, 0, 0.053]}>
                    <boxGeometry args={[0.22, DOOR_H, 0.04]} />
                    <meshStandardMaterial ref={matRef(10)} color={WOOD_DARK} roughness={0.55} transparent opacity={0} />
                </mesh>

                {/* ── Raised panels — positions in pivot-local space (door spans x=0 to x=DOOR_W) ── */}
                {/* Top-left panel */}
                {raisedPanel(1.3, 2.2, 1.6, 2.8, 0)}
                {/* Top-right panel */}
                {raisedPanel(DOOR_W - 1.3, 2.2, 1.6, 2.8, 1)}
                {/* Bottom-left panel */}
                {raisedPanel(1.3, -1.4, 1.6, 2.8, 2)}
                {/* Bottom-right panel */}
                {raisedPanel(DOOR_W - 1.3, -1.4, 1.6, 2.8, 3)}

                {/* ── Brass door knob ── */}
                {/* Knob back-plate */}
                <mesh position={[DOOR_W - 0.62, 0, 0.082]}>
                    <cylinderGeometry args={[0.12, 0.12, 0.025, 12]} />
                    <meshStandardMaterial ref={matRef(11)} color={KNOB_C} roughness={0.25} metalness={0.8} transparent opacity={0} />
                </mesh>
                {/* Knob sphere */}
                <mesh position={[DOOR_W - 0.62, 0, 0.16]}>
                    <sphereGeometry args={[0.11, 16, 16]} />
                    <meshStandardMaterial ref={matRef(12)} color={KNOB_C} roughness={0.2} metalness={0.9} transparent opacity={0} />
                </mesh>

            </group>
        </group>
    );
}
