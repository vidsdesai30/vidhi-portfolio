"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface PortalTunnelProps {
    progress: number;
}

// Portal appears after the door opens, when camera crosses through
const PORTAL_START = 0.60;
const PORTAL_END = 0.80;
const ss = (t: number) => { const c = Math.max(0, Math.min(1, t)); return c * c * (3 - 2 * c); };

// Portal sits just behind the door opening
const PORTAL_Z = -19;

// Number of concentric energy rings
const RING_COUNT = 12;

// Build ring data: radius, z-offset, speed, color phase
const RINGS = Array.from({ length: RING_COUNT }, (_, i) => {
    const frac = i / (RING_COUNT - 1);
    return {
        radius: 0.3 + frac * 2.2,       // inner tiny → outer large
        zOffset: frac * -1.8,            // rings recede into depth
        speed: 2.8 - frac * 1.8,         // inner rings spin faster
        colorPhase: frac * Math.PI * 2,
        segments: 48 + i * 4,
        thickness: 0.04 + (1 - frac) * 0.06,
    };
});

// Particle positions for swirling debris inside the portal
const PARTICLE_COUNT = 120;

export default function PortalTunnel({ progress }: PortalTunnelProps) {
    const groupRef = useRef<THREE.Group>(null);
    const ringMats = useRef<(THREE.MeshBasicMaterial | null)[]>(Array(RING_COUNT).fill(null));
    const coreMat = useRef<THREE.MeshBasicMaterial | null>(null);
    const outerGlowMat = useRef<THREE.MeshBasicMaterial | null>(null);
    const particleMat = useRef<THREE.PointsMaterial | null>(null);
    const ringGroups = useRef<(THREE.Group | null)[]>(Array(RING_COUNT).fill(null));
    const { camera } = useThree();

    // Build particle positions once
    const particlePositions = useMemo(() => {
        const pos = new Float32Array(PARTICLE_COUNT * 3);
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const angle = Math.random() * Math.PI * 2;
            const r = 0.2 + Math.random() * 2.0;
            const depth = Math.random() * -1.5;
            pos[i * 3] = Math.cos(angle) * r;
            pos[i * 3 + 1] = Math.sin(angle) * r;
            pos[i * 3 + 2] = depth;
        }
        return pos;
    }, []);

    // Separate ref to track particle rotation
    const particleGroupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        const time = state.clock.elapsedTime;
        const alpha = ss((progress - PORTAL_START) / 0.05)
            * (1 - ss((progress - PORTAL_END) / 0.05));

        if (groupRef.current) groupRef.current.visible = alpha > 0.005;
        if (alpha < 0.005) return;

        // Spin each ring at its own speed + pulse brightness
        RINGS.forEach((ring, i) => {
            const g = ringGroups.current[i];
            if (g) {
                g.rotation.z = time * ring.speed;
            }
            const mat = ringMats.current[i];
            if (mat) {
                // Color cycles from cyan → violet → magenta → cyan
                const hue = ((time * 0.12 + ring.colorPhase / (Math.PI * 2)) % 1.0);
                const sat = 0.85;
                const lit = 0.55 + 0.15 * Math.sin(time * ring.speed + ring.colorPhase);
                const col = new THREE.Color().setHSL(hue, sat, lit);
                mat.color = col;

                // Pulse opacity: outer rings slightly dimmer, inner brighter
                const frac = i / (RING_COUNT - 1);
                const proximity = Math.max(0, 1 - Math.abs(camera.position.z - (PORTAL_Z + ring.zOffset)) / 8);
                const pulse = 0.7 + 0.3 * Math.sin(time * ring.speed * 1.3 + ring.colorPhase);
                mat.opacity = Math.min(0.95, (0.55 + (1 - frac) * 0.35 + proximity * 0.2) * pulse * alpha);
            }
        });

        // Core bright glow — pure white with slight color shift
        if (coreMat.current) {
            const pulse = 0.85 + 0.15 * Math.sin(time * 4.2);
            coreMat.current.opacity = pulse * alpha * 0.95;
            const hue = (time * 0.08) % 1.0;
            coreMat.current.color.setHSL(hue, 0.6, 0.95);
        }

        // Outer glow aura
        if (outerGlowMat.current) {
            const pulse = 0.5 + 0.2 * Math.sin(time * 2.1);
            outerGlowMat.current.opacity = pulse * alpha * 0.45;
        }

        // Rotate the particle swirl
        if (particleGroupRef.current) {
            particleGroupRef.current.rotation.z = time * 0.6;
        }
        if (particleMat.current) {
            particleMat.current.opacity = alpha * 0.7;
        }
    });

    return (
        <group ref={groupRef} position={[0, 0, PORTAL_Z]}>
            {/* ── Outer soft aura (large glow disc behind everything) ── */}
            <mesh position={[0, 0, 0.05]}>
                <circleGeometry args={[3.5, 64]} />
                <meshBasicMaterial
                    ref={(m) => { outerGlowMat.current = m; }}
                    color={new THREE.Color(0.3, 0.0, 0.9)}
                    transparent
                    opacity={0}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* ── Concentric spinning energy rings ── */}
            {RINGS.map((ring, i) => (
                <group
                    key={i}
                    ref={(g) => { ringGroups.current[i] = g; }}
                    position={[0, 0, ring.zOffset]}
                >
                    <mesh>
                        <torusGeometry args={[ring.radius, ring.thickness, 8, ring.segments]} />
                        <meshBasicMaterial
                            ref={(m) => { ringMats.current[i] = m; }}
                            color={new THREE.Color(0.5, 0.2, 1.0)}
                            transparent
                            opacity={0}
                            depthWrite={false}
                            blending={THREE.AdditiveBlending}
                        />
                    </mesh>
                </group>
            ))}

            {/* ── Swirling particle cloud ── */}
            <group ref={particleGroupRef} position={[0, 0, -0.5]}>
                <points>
                    <bufferGeometry>
                        <bufferAttribute
                            attach="attributes-position"
                            args={[particlePositions, 3]}
                        />
                    </bufferGeometry>
                    <pointsMaterial
                        ref={(m) => { particleMat.current = m; }}
                        size={0.045}
                        color={new THREE.Color(0.8, 0.4, 1.0)}
                        transparent
                        opacity={0}
                        depthWrite={false}
                        blending={THREE.AdditiveBlending}
                        sizeAttenuation
                    />
                </points>
            </group>

            {/* ── Bright core — the heart of the portal ── */}
            <mesh position={[0, 0, 0.1]}>
                <circleGeometry args={[0.55, 48]} />
                <meshBasicMaterial
                    ref={(m) => { coreMat.current = m; }}
                    color={new THREE.Color(1.0, 0.9, 1.0)}
                    transparent
                    opacity={0}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* ── Inner secondary glow ring ── */}
            <mesh position={[0, 0, 0.08]}>
                <torusGeometry args={[0.6, 0.18, 8, 48]} />
                <meshBasicMaterial
                    color={new THREE.Color(1.5, 1.0, 2.0)}
                    transparent
                    opacity={0.0}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                    ref={(m) => {
                        // Piggyback on coreMat for sync (we'll manually update it)
                        if (m) {
                            // We animate this via ringMats[0] which has inner radius effect
                        }
                    }}
                />
            </mesh>

            {/* ── Point light for scene illumination from portal ── */}
            <pointLight
                position={[0, 0, 1]}
                intensity={8}
                color="#8844ff"
                distance={15}
                decay={2}
            />
            <pointLight
                position={[0, 0, 0]}
                intensity={4}
                color="#44aaff"
                distance={8}
                decay={2}
            />
        </group>
    );
}
