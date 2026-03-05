"use client";

import { useEffect, useRef } from "react";

interface SocialFooterProps {
    progress: number;
}

const socials = [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/vidhi-desai-a6670327a/" },
    { label: "GitHub", href: "https://github.com/vidsdesai30" },
    { label: "TryHackMe", href: "https://tryhackme.com/p/vidsdesai30" },
    { label: "Email", href: "mailto:vidsdesai30@gmail.com" },
];

export default function SocialFooter({ progress }: SocialFooterProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;
        const localProgress = (progress - 0.88) / 0.12;
        const opacity = Math.max(0, Math.min(1, localProgress * 4));
        ref.current.style.opacity = String(opacity);
    }, [progress]);

    return (
        <div className="section-footer" style={{ position: "relative" }}>
            <div
                ref={ref}
                style={{
                    position: "sticky",
                    top: 0,
                    height: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "3rem",
                    opacity: 0,
                    zIndex: 10,
                    padding: "2rem",
                }}
            >
                {/* Name */}
                <div className="text-center no-select">
                    <p
                        className="font-serif"
                        style={{
                            fontSize: "clamp(0.7rem, 1.5vw, 0.9rem)",
                            color: "var(--color-text-muted)",
                            letterSpacing: "0.3em",
                            textTransform: "uppercase",
                            marginBottom: "1.5rem",
                        }}
                    >
                        Vidhi
                    </p>
                    <p
                        style={{
                            fontSize: "clamp(0.7rem, 1.5vw, 0.85rem)",
                            color: "var(--color-text-muted)",
                            letterSpacing: "0.15em",
                        }}
                    >
                        Developer · Creative · Builder
                    </p>
                </div>

                {/* Social links */}
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "clamp(1.5rem, 4vw, 3rem)",
                        justifyContent: "center",
                    }}
                >
                    {socials.map((social, i) => (
                        <a
                            key={i}
                            href={social.href}
                            target={social.href.startsWith("http") ? "_blank" : undefined}
                            rel="noopener noreferrer"
                            className="hover-underline"
                            style={{
                                textDecoration: "none",
                                color: "var(--color-text)",
                                fontSize: "clamp(1.2rem, 3vw, 2rem)",
                                fontFamily: "'Playfair Display', serif",
                                fontStyle: "italic",
                                fontWeight: 400,
                                letterSpacing: "0.02em",
                                transition: "color 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.color = "var(--color-accent)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.color = "var(--color-text)";
                            }}
                        >
                            {social.label}
                        </a>
                    ))}
                </div>

                {/* Quote */}
                <div style={{ textAlign: "center", maxWidth: "520px" }}>
                    <p
                        className="font-serif"
                        style={{
                            fontSize: "clamp(1.1rem, 2.4vw, 1.65rem)",
                            color: "rgba(240,236,227,0.92)",
                            fontStyle: "italic",
                            fontWeight: 600,
                            letterSpacing: "0.06em",
                            lineHeight: 1.75,
                            marginBottom: "1rem",
                        }}
                    >
                        &ldquo;You are the artist of your own life.
                        <br />
                        Don&rsquo;t hand the paintbrush to anyone else.&rdquo;
                    </p>
                    <p
                        style={{
                            fontSize: "0.65rem",
                            color: "var(--color-text-muted)",
                            letterSpacing: "0.22em",
                            textTransform: "uppercase",
                            opacity: 0.5,
                        }}
                    >
                        © 2026 Vidhi · Made with love &amp; Three.js
                    </p>
                </div>
            </div>
        </div>
    );
}
