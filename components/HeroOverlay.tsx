"use client";

import { useEffect, useRef } from "react";

interface HeroOverlayProps {
    progress: number;
}

export default function HeroOverlay({ progress }: HeroOverlayProps) {
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!textRef.current) return;
        // Fade out + drift up as scroll begins
        const opacity = Math.max(0, 1 - progress * 9);
        const translateY = progress * -80;
        textRef.current.style.opacity = String(opacity);
        textRef.current.style.transform = `translateY(${translateY}px)`;
    }, [progress]);

    return (
        <div
            className="section-hero"
            style={{ position: "relative" }}
        >
            {/* Sticky 100vh container – text truly centered in viewport on first load */}
            <div
                style={{
                    position: "sticky",
                    top: 0,
                    height: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 10,
                    pointerEvents: "none",
                }}
            >
                <div ref={textRef} className="text-center no-select" style={{ willChange: "opacity, transform" }}>
                    <h1
                        className="font-serif"
                        style={{
                            fontSize: "clamp(2.2rem, 6vw, 5.5rem)",
                            fontWeight: 500,
                            fontStyle: "italic",
                            color: "#f0ece3",
                            letterSpacing: "0.02em",
                            textShadow: "0 0 50px rgba(200,184,130,0.5), 0 2px 30px rgba(0,0,0,0.7)",
                            lineHeight: 1.2,
                        }}
                    >
                        Hi, I am Vidhi Desai.
                    </h1>
                    <p
                        className="font-sans"
                        style={{
                            marginTop: "1.2rem",
                            fontSize: "clamp(0.85rem, 1.8vw, 1.1rem)",
                            color: "rgba(240,236,227,0.55)",
                            letterSpacing: "0.18em",
                            textTransform: "uppercase",
                        }}
                    >
                        Cybersecurity by profession, Creative at heart.
                    </p>
                    <div
                        className="scroll-hint"
                        style={{ marginTop: "3.5rem", color: "rgba(240,236,227,0.35)", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem" }}
                    >
                        <span style={{ fontSize: "0.65rem", letterSpacing: "0.22em", textTransform: "uppercase" }}>scroll</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
}
