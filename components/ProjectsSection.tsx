"use client";

import { useRef, useEffect, useState, useCallback } from "react";

interface ProjectsSectionProps {
    onClose: () => void;
}

const certificates = [
    { title: "Cyber Threat Management", issuer: "Cisco NetAcad", url: "https://www.credly.com/badges/832860ef-a59f-4b45-ab33-52877118b222/public_url" },
    { title: "Endpoint Security", issuer: "Cisco NetAcad", url: "https://www.credly.com/badges/28b1ea8d-ab3c-42c4-b5c5-448a3ede666b/public_url" },
    { title: "Ethical Hacker", issuer: "Cisco NetAcad", url: "https://www.credly.com/badges/d38e7acb-1f45-4545-97fd-027a0d54e8cb/public_url" },
    { title: "Introduction to Cybersecurity", issuer: "Cisco NetAcad", url: "https://www.credly.com/badges/ec769ac1-6491-420b-b1c2-dfeabb6ef7e1/public_url" },
    { title: "Junior Cybersecurity Analyst", issuer: "Cisco NetAcad", url: "https://www.credly.com/badges/39dbb90d-4a71-4853-adae-b3ebd1a3589e/public_url" },
    { title: "Network Defense", issuer: "Cisco NetAcad", url: "https://www.credly.com/badges/427a25b1-3dea-4894-94bf-beb568be60a2/public_url" },
    { title: "Network Basics", issuer: "Cisco NetAcad", url: "https://www.credly.com/badges/58d8ea59-3f5b-4128-98b3-d3e58bffbfad/public_url" },
    { title: "Network Devices & Config", issuer: "Cisco NetAcad", url: "https://www.credly.com/badges/3b3dfaf9-98eb-47a5-ba31-528c9bf0d6d6/public_url" },
];

const tools = [
    {
        category: "Cybersecurity",
        items: ["Wireshark", "Nmap", "Burp Suite", "Metasploit", "Kali Linux", "Nessus", "Snort", "John the Ripper", "Hydra", "Aircrack-ng", "OWASP ZAP", "Splunk"],
    },
    {
        category: "Networking",
        items: ["Cisco Packet Tracer", "Wireshark", "TCP/IP", "VPN", "Firewalls", "IDS/IPS", "DNS", "DHCP", "VirtualBox", "VMware"],
    },
    {
        category: "Web & Development",
        items: ["HTML", "CSS", "JavaScript", "Python", "Bash", "SQL", "Git", "Linux CLI", "VS Code", "Docker"],
    },
];

const WANDERER_BG =
    "https://upload.wikimedia.org/wikipedia/commons/b/b9/Caspar_David_Friedrich_-_Wanderer_above_the_sea_of_fog.jpg";

export default function ProjectsSection({ onClose }: ProjectsSectionProps) {
    const bgRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const mouseRef = useRef({ x: 0.5, y: 0.5 });
    const currentRef = useRef({ x: 0.5, y: 0.5 });
    const rafRef = useRef<number>(0);

    const [isDragging, setIsDragging] = useState(false);
    const dragStart = useRef({ x: 0, scrollLeft: 0 });

    // Smooth parallax RAF loop (only moves bg)
    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            mouseRef.current = {
                x: e.clientX / window.innerWidth,
                y: e.clientY / window.innerHeight,
            };
        };
        window.addEventListener("mousemove", onMove);

        const tick = () => {
            const t = mouseRef.current;
            const c = currentRef.current;
            c.x += (t.x - c.x) * 0.05;
            c.y += (t.y - c.y) * 0.05;
            const dx = (c.x - 0.5) * 2;
            const dy = (c.y - 0.5) * 2;
            if (bgRef.current) bgRef.current.style.transform = `scale(1.08) translate(${dx * -18}px, ${dy * -10}px)`;
            rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
        return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(rafRef.current); };
    }, []);

    // Cert row drag-to-scroll
    const onMouseDown = useCallback((e: React.MouseEvent) => {
        if (!trackRef.current) return;
        setIsDragging(true);
        dragStart.current = { x: e.pageX, scrollLeft: trackRef.current.scrollLeft };
    }, []);
    const onMouseMove = useCallback((e: React.MouseEvent) => {
        if (!isDragging || !trackRef.current) return;
        e.preventDefault();
        trackRef.current.scrollLeft = dragStart.current.scrollLeft - (e.pageX - dragStart.current.x);
    }, [isDragging]);
    const stopDrag = useCallback(() => setIsDragging(false), []);

    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, overflow: "hidden" }}>

            {/* ── Painting background ── */}
            <div
                ref={bgRef}
                style={{
                    position: "absolute",
                    inset: "-4%",
                    backgroundImage: `url(${WANDERER_BG})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center 28%",
                    willChange: "transform",
                }}
            />

            {/* Fog vignette */}
            <div style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                background: `
                    radial-gradient(ellipse 110% 50% at 50% 100%, rgba(215,230,242,0.55) 0%, transparent 55%),
                    linear-gradient(to bottom, rgba(165,192,215,0.15) 0%, transparent 38%, rgba(215,230,242,0.25) 80%, rgba(228,240,250,0.6) 100%)
                `,
            }} />

            {/* ── X Close ── */}
            <button
                onClick={onClose}
                style={{ position: "absolute", top: "1.5rem", left: "1.5rem", zIndex: 50, background: "none", border: "none", cursor: "pointer", padding: "0.5rem" }}
                aria-label="Close"
            >
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <line x1="5" y1="5" x2="23" y2="23" stroke="#1a1a2e" strokeWidth="2.2" strokeLinecap="round" />
                    <line x1="23" y1="5" x2="5" y2="23" stroke="#1a1a2e" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
            </button>

            {/* ── Vertically scrollable content ── */}
            <div
                ref={scrollRef}
                style={{
                    position: "absolute",
                    inset: 0,
                    overflowY: "auto",
                    overflowX: "hidden",
                    scrollbarWidth: "none",
                    zIndex: 10,
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <style>{`
                    div::-webkit-scrollbar { display: none; }
                    @keyframes certIn {
                        from { opacity: 0; transform: translateY(18px); }
                        to   { opacity: 1; transform: translateY(0); }
                    }
                    @keyframes tagIn {
                        from { opacity: 0; transform: translateY(10px) scale(0.95); }
                        to   { opacity: 1; transform: translateY(0) scale(1); }
                    }
                `}</style>

                {/* ── Spacer to push certs to ~38% ── */}
                <div style={{ flex: "0 0 30vh" }} />

                {/* ── Certificate horizontal scroll ── */}
                <div
                    ref={trackRef}
                    onMouseDown={onMouseDown}
                    onMouseMove={onMouseMove}
                    onMouseUp={stopDrag}
                    onMouseLeave={stopDrag}
                    style={{
                        display: "flex",
                        alignItems: "flex-end",
                        gap: "1.8rem",
                        padding: "0.5rem 6vw 1rem",
                        overflowX: "auto",
                        overflowY: "visible",
                        cursor: isDragging ? "grabbing" : "grab",
                        scrollbarWidth: "none",
                        userSelect: "none",
                        flexShrink: 0,
                    }}
                >
                    {certificates.map((cert, i) => (
                        <a
                            key={i}
                            href={cert.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                flexShrink: 0,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                animation: `certIn 0.5s ease ${i * 0.09}s both`,
                                textDecoration: "none",
                            }}
                            onClick={(e) => { if (isDragging) e.preventDefault(); }}
                        >
                            <div
                                style={{
                                    background: "rgba(255,255,255,0.93)",
                                    border: "1px solid #1a1a2e",
                                    width: "clamp(148px, 17vw, 205px)",
                                    height: "clamp(85px, 10vw, 120px)",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-start",
                                    justifyContent: "center",
                                    padding: "0.85rem 1rem",
                                    transition: "box-shadow 0.16s ease, transform 0.16s ease",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.boxShadow = "4px 4px 0 #1a1a2e";
                                    e.currentTarget.style.transform = "translate(-2px,-2px)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.boxShadow = "none";
                                    e.currentTarget.style.transform = "translate(0,0)";
                                }}
                            >
                                <h3 style={{
                                    fontFamily: "'Times New Roman', Georgia, serif",
                                    fontSize: "clamp(0.85rem, 1.6vw, 1.12rem)",
                                    fontWeight: 400,
                                    color: "#1a1a2e",
                                    margin: 0,
                                    lineHeight: 1.25,
                                }}>
                                    {cert.title}
                                </h3>
                                <p style={{
                                    fontFamily: "system-ui, sans-serif",
                                    fontSize: "0.56rem",
                                    color: "#555",
                                    letterSpacing: "0.1em",
                                    textTransform: "uppercase",
                                    margin: "0.4rem 0 0",
                                }}>
                                    {cert.issuer}
                                </p>
                                <p style={{
                                    fontFamily: "system-ui, sans-serif",
                                    fontSize: "0.5rem",
                                    color: "#2563eb",
                                    letterSpacing: "0.08em",
                                    textTransform: "uppercase",
                                    margin: "0.3rem 0 0",
                                }}>
                                    View on Credly ↗
                                </p>
                            </div>
                        </a>
                    ))}
                </div>

                {/* ── Divider ── */}
                <div style={{ padding: "2.8rem 6vw 0", flexShrink: 0 }}>
                    <div style={{
                        width: "100%",
                        height: "1px",
                        background: "linear-gradient(to right, transparent, rgba(26,26,46,0.2) 30%, rgba(26,26,46,0.2) 70%, transparent)",
                    }} />
                </div>

                {/* ── Tools & Technologies ── */}
                <div style={{
                    padding: "2.4rem 6vw 5rem",
                    flexShrink: 0,
                }}>
                    {/* Section header */}
                    <p style={{
                        fontFamily: "'Times New Roman', Georgia, serif",
                        fontSize: "clamp(0.55rem, 1.1vw, 0.7rem)",
                        letterSpacing: "0.35em",
                        textTransform: "uppercase",
                        color: "rgba(26,26,46,0.8)",
                        margin: "0 0 2rem 0",
                    }}>
                        Tools &amp; Technologies
                    </p>

                    {tools.map((group, gi) => (
                        <div key={gi} style={{ marginBottom: "1.8rem" }}>
                            {/* Category label */}
                            <p style={{
                                fontFamily: "system-ui, sans-serif",
                                fontSize: "0.52rem",
                                letterSpacing: "0.22em",
                                textTransform: "uppercase",
                                color: "rgba(26,26,46,0.6)",
                                margin: "0 0 0.7rem 0",
                            }}>
                                {group.category}
                            </p>

                            {/* Tags */}
                            <div style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "0.55rem",
                            }}>
                                {group.items.map((tool, ti) => (
                                    <span
                                        key={ti}
                                        style={{
                                            fontFamily: "'Times New Roman', Georgia, serif",
                                            fontSize: "clamp(0.72rem, 1.2vw, 0.88rem)",
                                            color: "#1a1a2e",
                                            background: "rgba(255,255,255,0.72)",
                                            border: "1px solid rgba(26,26,46,0.28)",
                                            borderRadius: "2px",
                                            padding: "0.28rem 0.7rem",
                                            backdropFilter: "blur(6px)",
                                            animation: `tagIn 0.4s ease ${gi * 0.1 + ti * 0.04}s both`,
                                            transition: "background 0.18s ease, color 0.18s ease, border-color 0.18s ease",
                                            cursor: "default",
                                            letterSpacing: "0.02em",
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = "rgba(255,255,255,0.95)";
                                            e.currentTarget.style.color = "#1a1a2e";
                                            e.currentTarget.style.borderColor = "rgba(26,26,46,0.5)";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = "rgba(255,255,255,0.72)";
                                            e.currentTarget.style.color = "#1a1a2e";
                                            e.currentTarget.style.borderColor = "rgba(26,26,46,0.28)";
                                        }}
                                    >
                                        {tool}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Scroll hint (shown only at top) ── */}
            <div style={{
                position: "absolute", bottom: "1.6rem", left: "50%", transform: "translateX(-50%)",
                display: "flex", alignItems: "center", gap: "0.45rem",
                color: "#2a3a4a", fontSize: "0.6rem", letterSpacing: "0.18em",
                textTransform: "uppercase", pointerEvents: "none",
                fontFamily: "system-ui, sans-serif", zIndex: 30,
            }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <polyline points="8,2 2,6 8,10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <polyline points="4,2 10,6 4,10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Drag certs · Scroll for tools
            </div>
        </div>
    );
}
