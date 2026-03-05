"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { EffectComposer, Bloom, SMAA } from "@react-three/postprocessing";
import StarField from "./StarField";
import CloudLayer from "./CloudLayer";
import Door3D from "./Door3D";
import CinematicCamera from "./CinematicCamera";
import PortalTunnel from "./PortalTunnel";

interface SceneProps {
    progress: number;
}

export default function Scene({ progress }: SceneProps) {
    return (
        <div className="canvas-container" style={{ pointerEvents: "none" }}>
            <Canvas
                camera={{ position: [0, 0, 12], fov: 72, near: 0.1, far: 1200 }}
                dpr={[1, 2]}
                gl={{
                    antialias: false,
                    alpha: true,
                    powerPreference: "high-performance",
                    outputColorSpace: "srgb",
                }}
                style={{ background: "transparent" }}
            >
                <fog attach="fog" args={["#05080f", 60, 280]} />

                <Suspense fallback={null}>
                    <CinematicCamera progress={progress} />
                    <StarField progress={progress} />
                    <CloudLayer progress={progress} />
                    <Door3D progress={progress} />
                    <PortalTunnel progress={progress} />

                    <EffectComposer multisampling={0}>
                        <Bloom luminanceThreshold={0.15} luminanceSmoothing={0.9} intensity={2.0} radius={0.9} />
                        <SMAA />
                    </EffectComposer>
                </Suspense>
            </Canvas>
        </div>
    );
}
