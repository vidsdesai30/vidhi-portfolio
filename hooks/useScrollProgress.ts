"use client";

import { useEffect, useRef, useState } from "react";

export function useScrollProgress() {
    const [progress, setProgress] = useState(0);
    const [scrollY, setScrollY] = useState(0);
    const rafRef = useRef<number>(0);

    useEffect(() => {
        const update = () => {
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const current = window.scrollY;
            setScrollY(current);
            setProgress(docHeight > 0 ? Math.min(current / docHeight, 1) : 0);
        };

        const onScroll = () => {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(update);
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        update();

        return () => {
            window.removeEventListener("scroll", onScroll);
            cancelAnimationFrame(rafRef.current);
        };
    }, []);

    return { progress, scrollY };
}
