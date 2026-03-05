"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface HallwayProps {
    progress: number;
    theme: "night" | "day";
}

export default function Hallway({ progress, theme }: HallwayProps) {
    const groupRef = useRef<THREE.Group>(null);
    const cameraZ = useRef(0);

    const doorCount = 24;
    const spacing = 10;

    const doors = useMemo(() =>
        Array.from({ length: doorCount }, (_, i) => ({ z: -i * spacing, id: i })),
        []);

    useFrame(() => {
        if (!groupRef.current) return;

        const visible = progress > 0.3 && progress < 0.7;
        const localProgress = Math.max(0, Math.min(1, (progress - 0.35) / 0.3));

        groupRef.current.visible = visible;
        if (!visible) return;

        // Smooth camera rush through corridor
        const targetZ = localProgress * doorCount * spacing * 0.92;
        cameraZ.current += (targetZ - cameraZ.current) * 0.12;
        groupRef.current.position.z = cameraZ.current;

        // Fade in and out nicely
        const fadeIn = Math.min(1, localProgress * 6);
        const fadeOut = Math.max(0, 1 - (localProgress - 0.78) * 6);
        const opacity = fadeIn * fadeOut;

        groupRef.current.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                const mat = child.material as THREE.MeshPhysicalMaterial | THREE.MeshStandardMaterial;
                if ("opacity" in mat) mat.opacity = opacity;
            }
        });
    });

    return (
        <group ref={groupRef}>
            {/* Cascading lights down the corridor */}
            {Array.from({ length: 8 }, (_, i) => (
                <pointLight
                    key={`light-${i}`}
                    position={[0, 1.5, -i * spacing * 3]}
                    intensity={12}
                    color={theme === "day" ? "#e8f4ff" : "#e8c897"}
                    distance={spacing * 4}
                    decay={2}
                />
            ))}
            <ambientLight intensity={theme === "day" ? 0.6 : 0.08} color={theme === "day" ? "#cce8ff" : "#1a0f05"} />

            {doors.map(({ z, id }) => (
                <DoorFrame key={id} z={z} index={id} total={doorCount} spacing={spacing} theme={theme} />
            ))}
        </group>
    );
}

function DoorFrame({ z, index, total, spacing, theme }: {
    z: number; index: number; total: number; spacing: number; theme: "night" | "day";
}) {
    const t = index / total;
    // Night: warm amber glow; Day: cool white/blue tones
    const glowHue = theme === "day" ? (0.58 + t * 0.02) : (0.08 + t * 0.04);
    const glowSat = theme === "day" ? 0.3 : 0.9;
    const glowLit = theme === "day" ? 0.75 : 0.55;
    const emitLit = theme === "day" ? 0.55 : 0.35;
    const wallLit = theme === "day" ? (0.40 + t * 0.05) : (0.07 + t * 0.04);
    const glowColor = new THREE.Color().setHSL(glowHue, glowSat, glowLit);
    const emissiveColor = new THREE.Color().setHSL(glowHue, 0.6, emitLit);
    const wallColor = new THREE.Color().setHSL(0.56, theme === "day" ? 0.15 : 0.12, wallLit);

    const wallMat = {
        color: wallColor,
        roughness: 0.85,
        metalness: 0.02,
        transparent: true,
        opacity: 0.95,
    };

    const floorMat = {
        color: new THREE.Color(0.04, 0.03, 0.05),
        roughness: 0.15,  // reflective floor
        metalness: 0.3,
        transparent: true,
        opacity: 0.95,
    };

    const frameMat = {
        color: glowColor,
        emissive: emissiveColor,
        emissiveIntensity: 2.5,
        roughness: 0.2,
        metalness: 0.6,
        transparent: true,
        opacity: 0.95,
    };

    return (
        <group position={[0, 0, z]}>
            {/* Floor – glossy reflective */}
            <mesh position={[0, -3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[7, spacing]} />
                <meshPhysicalMaterial {...floorMat} />
            </mesh>

            {/* Ceiling */}
            <mesh position={[0, 3.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <planeGeometry args={[7, spacing]} />
                <meshPhysicalMaterial {...wallMat} roughness={0.9} metalness={0} />
            </mesh>

            {/* Left wall */}
            <mesh position={[-3.5, 0, 0]}>
                <planeGeometry args={[spacing, 6.5]} />
                <meshPhysicalMaterial {...wallMat} />
            </mesh>

            {/* Right wall */}
            <mesh position={[3.5, 0, 0]} rotation={[0, Math.PI, 0]}>
                <planeGeometry args={[spacing, 6.5]} />
                <meshPhysicalMaterial {...wallMat} />
            </mesh>

            {/* ——— Door arch ——— */}

            {/* Left pillar */}
            <mesh position={[-1.2, -0.5, 0.05]}>
                <boxGeometry args={[0.18, 4.0, 0.08]} />
                <meshPhysicalMaterial {...frameMat} />
            </mesh>

            {/* Right pillar */}
            <mesh position={[1.2, -0.5, 0.05]}>
                <boxGeometry args={[0.18, 4.0, 0.08]} />
                <meshPhysicalMaterial {...frameMat} />
            </mesh>

            {/* Top lintel */}
            <mesh position={[0, 1.65, 0.05]}>
                <boxGeometry args={[2.56, 0.18, 0.08]} />
                <meshPhysicalMaterial {...frameMat} />
            </mesh>

            {/* Arch crown – small ornate bar */}
            <mesh position={[0, 1.9, 0.05]}>
                <boxGeometry args={[2.0, 0.07, 0.07]} />
                <meshPhysicalMaterial {...frameMat} emissiveIntensity={3.5} />
            </mesh>

            {/* Inner door fill (dark void) */}
            <mesh position={[0, 0.32, 0.02]}>
                <planeGeometry args={[2.2, 3.5]} />
                <meshBasicMaterial color="#000000" transparent opacity={0.7} side={THREE.DoubleSide} />
            </mesh>

            {/* Threshold sill */}
            <mesh position={[0, -2.9, 0.04]}>
                <boxGeometry args={[2.6, 0.12, 0.09]} />
                <meshPhysicalMaterial {...frameMat} emissiveIntensity={1.5} />
            </mesh>

            {/* Wall sconce lights left & right */}
            <mesh position={[-2.2, 0.8, 0.1]}>
                <sphereGeometry args={[0.08, 8, 8]} />
                <meshBasicMaterial color={glowColor} />
            </mesh>
            <mesh position={[2.2, 0.8, 0.1]}>
                <sphereGeometry args={[0.08, 8, 8]} />
                <meshBasicMaterial color={glowColor} />
            </mesh>
        </group>
    );
}
