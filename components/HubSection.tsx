"use client";

import { useEffect, useRef, useState } from "react";
import ExperienceSection from "./ExperienceSection";
import ProjectsSection from "./ProjectsSection";

interface HubSectionProps {
    progress: number;
}

// Painting image URLs (public domain art)
const DALI_IMAGE = "https://upload.wikimedia.org/wikipedia/en/d/dd/The_Persistence_of_Memory.jpg";
const WANDERER_IMAGE = "https://upload.wikimedia.org/wikipedia/commons/b/b9/Caspar_David_Friedrich_-_Wanderer_above_the_sea_of_fog.jpg";
const STARRY_IMAGE = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg";

export default function HubSection({ progress }: HubSectionProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [overlay, setOverlay] = useState<"experience" | "certificates" | null>(null);
    const [hubVisible, setHubVisible] = useState(false);

    useEffect(() => {
        // Hub visible only after portal animation ends (~0.80) to ~0.95 progress
        const localProgress = (progress - 0.80) / 0.15;
        const visible = progress > 0.80 && progress < 0.95;
        setHubVisible(visible);

        if (!containerRef.current) return;
        if (visible) {
            const fadeIn = Math.min(1, localProgress * 4);
            containerRef.current.style.opacity = String(Math.max(0, fadeIn));
        } else {
            containerRef.current.style.opacity = "0";
        }
    }, [progress]);

    return (
        <>
            <div className="section-hub" style={{ position: "relative" }}>
                <div
                    ref={containerRef}
                    style={{
                        position: "sticky",
                        top: 0,
                        height: "100vh",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 10,
                        opacity: 0,
                        transition: "opacity 0.4s ease",
                        padding: "2rem",
                    }}
                >
                    {/* Scattered "EXPERIENCE" text */}
                    <div
                        className="no-select"
                        style={{
                            marginBottom: "3rem",
                            textAlign: "center",
                            overflow: "hidden",
                        }}
                    >
                        {"EXPERIENCE".split("").map((letter, i) => (
                            <span
                                key={i}
                                className="font-serif float-letter"
                                style={{
                                    fontSize: "clamp(1.5rem, 4vw, 3rem)",
                                    color: "rgba(240,236,227,0.6)",
                                    letterSpacing: "0.6em",
                                    display: "inline-block",
                                    animationDelay: `${i * 0.1}s`,
                                    animationDuration: `${3 + i * 0.3}s`,
                                }}
                            >
                                {letter}
                            </span>
                        ))}
                    </div>

                    {/* Two painting portals */}
                    <div
                        style={{
                            display: "flex",
                            gap: "clamp(2rem, 5vw, 4rem)",
                            alignItems: "flex-start",
                            justifyContent: "center",
                            flexWrap: "wrap",
                        }}
                    >
                        {[
                            {
                                id: "experience" as const,
                                src: DALI_IMAGE,
                                alt: "The Persistence of Memory – Education portal",
                                label: "Education",
                                floatDelay: "0s",
                            },
                            {
                                id: "certificates" as const,
                                src: STARRY_IMAGE,
                                alt: "Starry Night – Certificates & Achievements portal",
                                label: "Certificates & Achievements",
                                floatDelay: "1.2s",
                            },
                        ].map(({ id, src, alt, label, floatDelay }) => (
                            <div
                                key={id}
                                style={{ textAlign: "center", perspective: "800px" }}
                                onMouseMove={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    const cx = rect.left + rect.width / 2;
                                    const cy = rect.top + rect.height / 2;
                                    const dx = (e.clientX - cx) / (rect.width / 2);
                                    const dy = (e.clientY - cy) / (rect.height / 2);
                                    const card = e.currentTarget.querySelector(".portal-inner") as HTMLElement | null;
                                    if (card) {
                                        card.style.transform = `rotateY(${dx * 12}deg) rotateX(${-dy * 8}deg) scale(1.04)`;
                                        card.style.boxShadow = `${-dx * 18}px ${-dy * 12}px 40px rgba(200,184,154,0.18), 0 0 60px rgba(200,184,154,0.08)`;
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    const card = e.currentTarget.querySelector(".portal-inner") as HTMLElement | null;
                                    if (card) {
                                        card.style.transform = "rotateY(0deg) rotateX(0deg) scale(1)";
                                        card.style.boxShadow = "none";
                                    }
                                }}
                            >
                                <div
                                    className="portal-inner"
                                    onClick={() => setOverlay(id)}
                                    role="button"
                                    aria-label={`View ${id}`}
                                    style={{
                                        width: "clamp(280px, 36vw, 480px)",
                                        aspectRatio: "4/3",
                                        overflow: "hidden",
                                        borderRadius: "6px",
                                        border: "1px solid rgba(200,184,154,0.25)",
                                        position: "relative",
                                        cursor: "pointer",
                                        transformStyle: "preserve-3d",
                                        transition: "transform 0.15s ease, box-shadow 0.15s ease",
                                        animation: `portalFloat 5s ease-in-out ${floatDelay} infinite`,
                                        outline: "1px solid rgba(200,184,154,0.08)",
                                        outlineOffset: "6px",
                                    }}
                                >
                                    {/* Corner ornaments */}
                                    {[
                                        { top: "6px", left: "6px", borderTop: "1px solid", borderLeft: "1px solid" },
                                        { top: "6px", right: "6px", borderTop: "1px solid", borderRight: "1px solid" },
                                        { bottom: "6px", left: "6px", borderBottom: "1px solid", borderLeft: "1px solid" },
                                        { bottom: "6px", right: "6px", borderBottom: "1px solid", borderRight: "1px solid" },
                                    ].map((style, ci) => (
                                        <div
                                            key={ci}
                                            style={{
                                                position: "absolute",
                                                width: "14px",
                                                height: "14px",
                                                borderColor: "rgba(200,184,154,0.55)",
                                                zIndex: 3,
                                                pointerEvents: "none",
                                                ...style,
                                            }}
                                        />
                                    ))}

                                    {/* Shimmer overlay */}
                                    <div
                                        style={{
                                            position: "absolute",
                                            inset: 0,
                                            background: "linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.07) 50%, transparent 60%)",
                                            backgroundSize: "200% 100%",
                                            animation: `shimmer 3.5s ease-in-out ${floatDelay} infinite`,
                                            zIndex: 2,
                                            pointerEvents: "none",
                                        }}
                                    />

                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={src}
                                        alt={alt}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            display: "block",
                                            filter: "saturate(0.65) brightness(0.8)",
                                            transition: "filter 0.5s ease, transform 0.5s ease",
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.filter = "saturate(1.1) brightness(1.05)";
                                            e.currentTarget.style.transform = "scale(1.06)";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.filter = "saturate(0.65) brightness(0.8)";
                                            e.currentTarget.style.transform = "scale(1)";
                                        }}
                                    />

                                    {/* Bottom label gradient */}
                                    <div
                                        style={{
                                            position: "absolute",
                                            inset: 0,
                                            background: "linear-gradient(to top, rgba(5,8,15,0.82) 0%, rgba(5,8,15,0.15) 55%, transparent 100%)",
                                            display: "flex",
                                            alignItems: "flex-end",
                                            padding: "1rem 1.1rem",
                                            zIndex: 1,
                                            pointerEvents: "none",
                                        }}
                                    >
                                        <p
                                            className="font-serif"
                                            style={{
                                                color: "rgba(240,236,227,0.85)",
                                                fontSize: "0.7rem",
                                                letterSpacing: "0.22em",
                                                textTransform: "uppercase",
                                            }}
                                        >
                                            {label}
                                        </p>
                                    </div>
                                </div>

                                <p
                                    style={{
                                        marginTop: "0.85rem",
                                        fontSize: "0.65rem",
                                        color: "rgba(240,236,227,0.3)",
                                        letterSpacing: "0.18em",
                                        textTransform: "uppercase",
                                    }}
                                >
                                    Click to explore · · ·
                                </p>
                            </div>
                        ))}
                    </div>

                    <style>{`
                        @keyframes portalFloat {
                            0%, 100% { transform: translateY(0px); }
                            50% { transform: translateY(-10px); }
                        }
                        @keyframes shimmer {
                            0% { background-position: 200% 0; }
                            100% { background-position: -200% 0; }
                        }
                    `}</style>
                </div>
            </div>

            {/* Experience overlay — dark backdrop */}
            <div className={`overlay ${overlay === "experience" ? "active" : ""}`}>
                {overlay === "experience" && (
                    <ExperienceSection onClose={() => setOverlay(null)} />
                )}
            </div>

            {/* Certificates overlay — renders its own full-screen background, no dark wrapper */}
            {overlay === "certificates" && (
                <ProjectsSection onClose={() => setOverlay(null)} />
            )}
        </>
    );
}
