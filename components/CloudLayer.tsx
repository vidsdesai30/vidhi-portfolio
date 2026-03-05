"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface CloudLayerProps {
    progress: number;
}

function generateCloudTexture(size = 512): THREE.CanvasTexture {
    const canvas = document.createElement("canvas");
    canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    // Dark sky undertone
    ctx.clearRect(0, 0, size, size);
    const puffs = [
        { x: size * 0.50, y: size * 0.50, rx: size * 0.48, ry: size * 0.38 },
        { x: size * 0.30, y: size * 0.55, rx: size * 0.32, ry: size * 0.22 },
        { x: size * 0.70, y: size * 0.52, rx: size * 0.30, ry: size * 0.20 },
        { x: size * 0.45, y: size * 0.35, rx: size * 0.27, ry: size * 0.18 },
        { x: size * 0.62, y: size * 0.38, rx: size * 0.22, ry: size * 0.16 },
        { x: size * 0.22, y: size * 0.42, rx: size * 0.20, ry: size * 0.14 },
    ];
    puffs.forEach(({ x, y, rx, ry }) => {
        const g = ctx.createRadialGradient(x, y, 0, x, y, rx);
        g.addColorStop(0, "rgba(55,65,95,0.85)");
        g.addColorStop(0.30, "rgba(40,50,78,0.65)");
        g.addColorStop(0.65, "rgba(28,35,58,0.32)");
        g.addColorStop(1.0, "rgba(15,20,38,0.00)");
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fill();
    });
    return new THREE.CanvasTexture(canvas);
}

interface Puff { pos: [number, number, number]; sx: number; sy: number; rotZ: number; phase: number; }

function mkPuffs(): Puff[] {
    const result: Puff[] = [];
    // 3 Z-layers of clouds for parallax depth
    const layers = [
        { z: -2, count: 14, yRange: [-6, -2] },
        { z: -6, count: 12, yRange: [-8, -3] },
        { z: -11, count: 10, yRange: [-9, -4] },
    ];
    for (const { z, count, yRange } of layers) {
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
            const rad = 8 + Math.random() * 14;
            result.push({
                pos: [Math.cos(angle) * rad, yRange[0] + Math.random() * (yRange[1] - yRange[0]), z + (Math.random() - 0.5) * 2],
                sx: 16 + Math.random() * 18,
                sy: 8 + Math.random() * 10,
                rotZ: (Math.random() - 0.5) * 0.5,
                phase: Math.random() * Math.PI * 2,
            });
        }
    }
    return result;
}

export default function CloudLayer({ progress }: CloudLayerProps) {
    const groupRef = useRef<THREE.Group>(null);
    const texture = useMemo(() => typeof document === "undefined" ? null : generateCloudTexture(512), []);
    const puffs = useMemo(mkPuffs, []);

    useFrame((st) => {
        if (!groupRef.current) return;
        const t = st.clock.elapsedTime;
        // Visible progress 0.10 – 0.48
        const alpha = Math.max(0, Math.min(1, (progress - 0.10) * 10))
            * Math.max(0, Math.min(1, 1 - (progress - 0.38) * 8));
        groupRef.current.visible = alpha > 0.01;
        // Float upward with camera tilt
        groupRef.current.position.y = -4 + progress * 35;

        let idx = 0;
        groupRef.current.children.forEach((c) => {
            const m = c as THREE.Mesh;
            if (m.material) {
                const mat = m.material as THREE.MeshBasicMaterial;
                const p = puffs[idx];
                if (p) m.position.y = p.pos[1] + Math.sin(t * 0.18 + p.phase) * 0.3;
                mat.opacity = alpha * 0.82;
            }
            idx++;
        });
    });

    if (!texture) return null;
    return (
        <group ref={groupRef}>
            {puffs.map((p, i) => (
                <mesh key={i} position={p.pos} rotation={[0, 0, p.rotZ]}>
                    <planeGeometry args={[p.sx, p.sy]} />
                    <meshBasicMaterial map={texture} transparent opacity={0} depthWrite={false}
                        alphaTest={0.01} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
                </mesh>
            ))}
        </group>
    );
}
