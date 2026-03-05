"use client";

import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface CinematicCameraProps {
    progress: number;
}

// Door is at Z=-18. Camera starts at Z=12.
//
// Phase breakdown (progress 0→1):
//   0.00–0.16  Hero — camera at z=12, looking forward at horizon
//   0.16–0.30  Clouds fly-through — gently drifting forward
//   0.30–0.38  Sky linger — camera still high, still looking forward (buffer gap)
//   0.38–0.45  Dramatic tilt: camera rises to Y=6, looks STEEPLY DOWN (targetY=-5)
//              Door appears tiny, far below, like a speck on the ground
//   0.45–0.58  Long slow descent — camera glides lower & forward toward door
//   0.58–0.66  Close approach — door fills frame, panel swings open
//   0.66–0.73  Cross threshold — burst into portal
//   0.73–1.00  Settled inside
//
// [progress, posX, posY, posZ, targetX, targetY, targetZ]
const KF = [
    [0.00, 0, 0, 12, 0, 0, 0],   // Hero start — looking forward at horizon
    [0.16, 0, 0, 12, 0, 0, 0],   // Hero linger
    [0.30, 0, 0, 10, 0, 0, 0],   // End of clouds — still looking forward
    [0.38, 0, 0, 10, 0, 0, 0],   // Brief pause in sky (buffer, no movement)
    [0.45, 0, 6, 10, 0, -5, -18],   // STEEP DOWNWARD TILT — door tiny dot far below
    [0.53, 0, 3, 2, 0, -2, -18],   // Descend — door growing, camera lower
    [0.60, 0, 0, -6, 0, 0, -18],   // Eye-level approach — door fills frame
    [0.67, 0, 0, -15, 0, 0, -22],   // Crossing threshold
    [0.73, 0, 0, -20, 0, 0, -30],   // Deep in portal tunnel
    [0.82, 0, 0, -22, 0, 0, -30],   // Settling
    [1.00, 0, 0, -22, 0, 0, -30],   // Settled – experience
];

const ss = (t: number) => { const c = Math.max(0, Math.min(1, t)); return c * c * (3 - 2 * c); };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const _target = new THREE.Vector3();

export default function CinematicCamera({ progress }: CinematicCameraProps) {
    const { camera } = useThree();

    useFrame(() => {
        let from = KF[0], to = KF[KF.length - 1];
        for (let i = 0; i < KF.length - 1; i++) {
            if (progress >= KF[i][0] && progress <= KF[i + 1][0]) {
                from = KF[i]; to = KF[i + 1]; break;
            }
        }
        const span = to[0] - from[0];
        const t = ss(span > 0 ? (progress - from[0]) / span : 1);

        camera.position.set(
            lerp(from[1], to[1], t),
            lerp(from[2], to[2], t),
            lerp(from[3], to[3], t),
        );
        _target.set(
            lerp(from[4], to[4], t),
            lerp(from[5], to[5], t),
            lerp(from[6], to[6], t),
        );
        camera.lookAt(_target);
    });

    return null;
}
