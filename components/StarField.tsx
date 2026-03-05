"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface StarFieldProps {
    progress: number;
}

const vertexShader = `
attribute float aSize;
attribute float aPhase;
attribute vec3 aColor;
varying float vPhase;
varying vec3 vColor;
void main() {
    vPhase = aPhase;
    vColor = aColor;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
}
`;

const fragmentShader = `
uniform float uTime;
uniform float uOpacity;
varying float vPhase;
varying vec3 vColor;
void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float dist = length(uv);
    if (dist > 0.5) discard;
    float core = smoothstep(0.5, 0.1, dist);
    float glow = smoothstep(0.5, 0.0, dist) * 0.4;
    float alpha = core + glow;
    float twinkle = 0.75 + 0.25 * sin(uTime * 1.8 + vPhase * 6.28318);
    alpha *= twinkle;
    gl_FragColor = vec4(vColor, alpha * uOpacity);
}
`;

export default function StarField({ progress }: StarFieldProps) {
    const meshRef = useRef<THREE.Points>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    // Mouse parallax state — target & current rotation
    const mouseTarget = useRef({ x: 0, y: 0 });
    const mouseSmooth = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            // Normalize to -1..+1, apply a gentle ±0.12 rad max tilt
            mouseTarget.current.x = ((e.clientY / window.innerHeight) - 0.5) * 0.24;  // pitch
            mouseTarget.current.y = ((e.clientX / window.innerWidth) - 0.5) * 0.24;  // yaw
        };
        window.addEventListener("mousemove", onMove, { passive: true });
        return () => window.removeEventListener("mousemove", onMove);
    }, []);

    const { positions, sizes, phases, colors } = useMemo(() => {
        const count = 8000;
        const positions = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
        const phases = new Float32Array(count);
        const colors = new Float32Array(count * 3);
        const palette = [[1.0, 0.97, 0.93], [0.85, 0.92, 1.0], [1.0, 1.0, 0.80], [0.95, 0.85, 1.0]];
        for (let i = 0; i < count; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = 80 + Math.random() * 120;
            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = r * Math.cos(phi);
            sizes[i] = Math.random() < 0.05 ? 2.5 + Math.random() * 2.5 : 0.6 + Math.random() * 1.4;
            phases[i] = Math.random() * Math.PI * 2;
            const pick = palette[Math.floor(Math.random() * palette.length)];
            const b = 0.65 + Math.random() * 0.35;
            colors[i * 3] = pick[0] * b; colors[i * 3 + 1] = pick[1] * b; colors[i * 3 + 2] = pick[2] * b;
        }
        return { positions, sizes, phases, colors };
    }, []);

    const uniforms = useMemo(() => ({ uTime: { value: 0 }, uOpacity: { value: 1 } }), []);

    useFrame((state) => {
        if (!meshRef.current || !materialRef.current) return;
        materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;

        // Stars always visible — brief dip only during portal rush (0.58–0.66)
        const portalDip = 1 - Math.max(0, Math.min(1, (progress - 0.58) / 0.05))
            * Math.max(0, Math.min(1, 1 - (progress - 0.64) / 0.05));
        materialRef.current.uniforms.uOpacity.value = portalDip;

        // Slow ambient rotation
        const t = state.clock.elapsedTime;
        meshRef.current.rotation.y = t * 0.008;
        meshRef.current.rotation.x = t * 0.003;

        // Smooth mouse parallax — lerp toward target (factor 0.04 = gentle lag)
        mouseSmooth.current.x += (mouseTarget.current.x - mouseSmooth.current.x) * 0.04;
        mouseSmooth.current.y += (mouseTarget.current.y - mouseSmooth.current.y) * 0.04;

        // Add mouse parallax on top of ambient rotation
        meshRef.current.rotation.x += mouseSmooth.current.x;
        meshRef.current.rotation.y += mouseSmooth.current.y;
    });

    return (
        <points ref={meshRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
                <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
                <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
                <bufferAttribute attach="attributes-aColor" args={[colors, 3]} />
            </bufferGeometry>
            <shaderMaterial ref={materialRef} vertexShader={vertexShader} fragmentShader={fragmentShader}
                uniforms={uniforms} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
        </points>
    );
}
